/* globe.js — scroll-linked wireframe globe + projected city cards.
   Plain JS, depends on global THREE (r128). Exposes window.Globe. */
(function () {
  "use strict";

  // ── City data ─────────────────────────────────────────────────────────────
  // Real coordinates so cities sit where they truly are on the sphere.
  const CITIES = [
    {
      id: "london",
      city: "London",
      country: "United Kingdom",
      tz: "Europe/London",
      lat: 51.5074,
      lon: -0.1278,
      dx: 8,
      dy: -30,
    },
        {
      id: "paris",
      city: "Paris",
      country: "France",
      tz: "Europe/Paris",
      lat: 48.8566,
      lon: 2.3522,
      dx: 30,
      dy: 30,
    },
    {
      id: "marseille",
      city: "Marseille",
      country: "France",
      tz: "Europe/Paris",
      lat: 43.2965,
      lon: 5.3698,
      dx: 30,
      dy: 30,
    },
    {
      id: "floripa",
      city: "Florianópolis",
      country: "Brazil",
      tz: "America/Sao_Paulo",
      lat: -27.5954,
      lon: -48.548,
      dx: 0,
      dy: 0,
    },
        {
      id: "vancouver",
      city: "Vancouver",
      country: "Canada",
      tz: "America/Vancouver",
      lat: 49.246292,
      lon: -123.116226,
      dx: 0,
      dy: 0,
    },
  ];

  const DEG = Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  // smoothstep
  const ss = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  // lon=0 sits on +Z (facing camera) when rotation.y = 0
  function latLonToVec(lat, lon, R) {
    const la = lat * DEG,
      lo = lon * DEG;
    return new THREE.Vector3(
      R * Math.cos(la) * Math.sin(lo),
      R * Math.sin(la),
      R * Math.cos(la) * Math.cos(lo),
    );
  }

  // ── State / config ──────────────────────────────────────────────────────────
  const cfg = {
    spins: 1, // decorative FULL turns added before landing on Florianópolis
    density: "dense", // sparse | regular | dense
  };

  // Longitude rotation (rad) that brings a given lon to the front (+Z, facing camera).
  // latLonToVec puts lon at effective angle lon+rotation.y, so front needs rotation.y = -lon.
  const FLORIPA_LON = -48.548;
  const FLORIPA_FRONT = -FLORIPA_LON * DEG; // ≈ +0.847 rad → Florianópolis dead-front

  let scene, camera, renderer, spinGroup, lineMaterial;
  let canvas, cardsLayer, sceneEl;
  let cardEls = {};
  const R = 2.0; // globe radius (world units)
  const START_Y = -1.32; // partial north-pole dome at scroll start
  // End offset places Florianópolis (lat -27.6) at the vertical centre of the page
  // once it has rotated to the front:  -(R*sin(-27.6°)) = +0.926
  const END_Y = 0.926;
  const GROUP_Y = START_Y; // initial vertical offset
  let targetRot = 0,
    curRot = 0;
  let curY = START_Y; // smoothed vertical reveal position
  let raf = null;
  let clockInterval = null;
  const _v = new THREE.Vector3();
  const _n = new THREE.Vector3();
  const _camDir = new THREE.Vector3();

  // ── Build the graticule (parallels + meridians) ──────────────────────────────
  const SHADER = {
    vertex: `
      varying float vFacing;
      void main(){
        vec3 vn = normalize(normalMatrix * normalize(position));
        vFacing = vn.z;                       // +z faces the camera
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragment: `
      uniform vec3 uColor; uniform float uFront; uniform float uBack;
      varying float vFacing;
      void main(){
        float t = smoothstep(-0.35, 0.7, vFacing);
        float a = mix(uBack, uFront, t);
        gl_FragColor = vec4(uColor, a);
      }`,
  };

  function buildGraticule() {
    if (spinGroup) {
      scene.remove(spinGroup);
      spinGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
    }
    spinGroup = new THREE.Group();
    spinGroup.position.y = GROUP_Y;
    spinGroup.rotation.z = 0; // perfectly upright N–S axis

    const steps = {
      sparse: { par: 30, mer: 30, seg: 96 },
      regular: { par: 20, mer: 20, seg: 128 },
      dense: { par: 15, mer: 15, seg: 160 },
    }[cfg.density] || { par: 20, mer: 20, seg: 128 };

    // parallels (circles of latitude)
    for (let lat = -80; lat <= 80; lat += steps.par) {
      const pts = [];
      const rr = R * Math.cos(lat * DEG),
        y = R * Math.sin(lat * DEG);
      for (let i = 0; i <= steps.seg; i++) {
        const a = (i / steps.seg) * Math.PI * 2;
        pts.push(new THREE.Vector3(rr * Math.sin(a), y, rr * Math.cos(a)));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      spinGroup.add(new THREE.Line(g, lineMaterial));
    }
    // meridians (pole-to-pole half circles)
    for (let lon = 0; lon < 360; lon += steps.mer) {
      const pts = [];
      for (let i = 0; i <= steps.seg / 2; i++) {
        const phi = (i / (steps.seg / 2)) * Math.PI; // 0..pi
        pts.push(
          new THREE.Vector3(
            R * Math.sin(phi) * Math.sin(lon * DEG),
            R * Math.cos(phi),
            R * Math.sin(phi) * Math.cos(lon * DEG),
          ),
        );
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      spinGroup.add(new THREE.Line(g, lineMaterial));
    }
    scene.add(spinGroup);
  }

  // ── Cards (DOM) ───────────────────────────────────────────────────────────
  const PIN =
    '<svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.7c-3.7 0-6.7 3-6.7 6.7 0 4.9 6.7 13.2 6.7 13.2s6.7-8.3 6.7-13.2c0-3.7-3-6.7-6.7-6.7z"/><circle cx="12" cy="8.4" r="2.4" fill="#f4f4f5"/></svg>';

  function buildCards() {
    cardsLayer.innerHTML = "";
    cardEls = {};
    CITIES.forEach((c) => {
      const el = document.createElement("div");
      el.className = "gcard";
      el.dataset.id = c.id;
      el.innerHTML =
        '<span class="gpin">' +
        PIN +
        "</span>" +
        '<span class="gtext">' +
        '<span class="gtitle">' +
        c.city +
        "</span>" +
        '<span class="gsub">' +
        c.country.toUpperCase() +
        ' <span class="gdot">·</span> <span class="gclock" data-tz="' +
        c.tz +
        '">--:--</span></span>' +
        "</span>";
      cardsLayer.appendChild(el);
      cardEls[c.id] = el;
    });
    tickClocks();
  }

  function tickClocks() {
    CITIES.forEach((c) => {
      const el = cardEls[c.id];
      if (!el) return;
      const clk = el.querySelector(".gclock");
      try {
        clk.textContent = new Intl.DateTimeFormat("en-GB", {
          timeZone: c.tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
      } catch (e) {
        clk.textContent = "--:--";
      }
    });
  }

  // ── Per-frame projection of cards ───────────────────────────────────────────
  function updateCards(w, h) {
    spinGroup.updateMatrixWorld();
    _camDir.copy(camera.position);
    CITIES.forEach((c) => {
      const el = cardEls[c.id];
      if (!el) return;
      const local = latLonToVec(c.lat, c.lon, R);
      _v.copy(local).applyMatrix4(spinGroup.matrixWorld); // world pos
      _n.copy(local).normalize().applyQuaternion(spinGroup.quaternion); // world normal
      // facing: 1 = pointed straight at camera, <0 = back side
      const toCam = _camDir.clone().sub(_v).normalize();
      const facing = _n.dot(toCam);

      const proj = _v.clone().project(camera);
      const x = (proj.x * 0.5 + 0.5) * w + (c.dx || 0);
      const y = (-proj.y * 0.5 + 0.5) * h + (c.dy || 0);

      const vis = ss(0.02, 0.34, facing); // fade in as it crosses the limb
      const scale = lerp(0.86, 1.0, ss(-0.1, 0.85, facing));

      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.setProperty("--s", scale.toFixed(3));
      el.style.opacity = vis.toFixed(3);
      el.style.zIndex = String(1000 + Math.round(facing * 500));
      el.style.pointerEvents = vis > 0.6 ? "auto" : "none";
    });
  }

  // ── Scroll → rotation ─────────────────────────────────────────────────────
  function scrollProgress() {
    if (!sceneEl) return 0;
    const total = sceneEl.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return clamp(-sceneEl.getBoundingClientRect().top / total, 0, 1);
  }

  let _frames = 0,
    _lastP = 0,
    _err = null;
  function frame() {
    try {
      _frames++;
      const p = scrollProgress();
      _lastP = p;
      const eased = ss(0, 1, p); // eased 0→1 over the scroll track

      // Rotation: travel from London/Marseille (front at start) to Florianópolis
      // (front at end), plus any decorative full turns. End ALWAYS lands on Florianópolis.
      const endRot = FLORIPA_FRONT + cfg.spins * Math.PI * 2;
      targetRot = eased * endRot;
      curRot = lerp(curRot, targetRot, 0.09); // cinematic easing
      spinGroup.rotation.y = curRot;

      // Vertical reveal: lift the sphere through the frame so more surface
      // (north dome → equator → southern hemisphere) comes into view. No zoom.
      curY = lerp(curY, lerp(START_Y, END_Y, eased), 0.09);
      spinGroup.position.y = curY;

      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      if (
        renderer.domElement.width !== Math.floor(w * devicePixelRatio) ||
        renderer.domElement.height !== Math.floor(h * devicePixelRatio)
      ) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      updateCards(w, h);
    } catch (e) {
      _err = (e && e.message) || String(e);
      if (window.console) console.log("FRAME_ERR", _err);
    }
    raf = requestAnimationFrame(frame);
  }

  // ── Public API ──────────────────────────────────────────────────────────────
  const Globe = {
    init(opts) {
      // Page-transition navigations can call init() again with a fresh canvas
      // before the previous instance is ever torn down — always destroy first.
      Globe.destroy();

      canvas = opts.canvas;
      cardsLayer = opts.cardsLayer;
      sceneEl = opts.sceneEl;

      scene = new THREE.Scene();
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      camera = new THREE.PerspectiveCamera(26, w / h, 0.1, 100);
      camera.position.set(0, 0, 5.0);
      camera.lookAt(0, -0.2, 0);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x000000, 0);

      lineMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color(0x111113) },
          uFront: { value: 0.62 },
          uBack: { value: 0.06 },
        },
        vertexShader: SHADER.vertex,
        fragmentShader: SHADER.fragment,
      });

      buildGraticule();
      buildCards();
      clockInterval = setInterval(tickClocks, 1000 * 10);
      // align clocks to the minute-ish quickly too
      setTimeout(tickClocks, 1000);

      window.addEventListener("resize", () => {
        /* handled in frame */
      });
      frame();
    },
    destroy() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      if (clockInterval !== null) {
        clearInterval(clockInterval);
        clockInterval = null;
      }
      if (renderer) {
        renderer.dispose();
        renderer = null;
      }
      cardEls = {};
    },
    setConfig(next) {
      const prevDensity = cfg.density;
      Object.assign(cfg, next || {});
      if (next && next.density && next.density !== prevDensity)
        buildGraticule();
    },
    cities: CITIES,
    // verification helper: snap to a scroll progress p∈[0,1] and render one frame
    _renderAt(p) {
      const eased = ss(0, 1, clamp(p, 0, 1));
      curRot = eased * (FLORIPA_FRONT + cfg.spins * Math.PI * 2);
      curY = lerp(START_Y, END_Y, eased);
      spinGroup.rotation.y = curRot;
      spinGroup.position.y = curY;
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      renderer.render(scene, camera);
      updateCards(w, h);
      return this._debug();
    },
    // debug: report Florianópolis' screen position + current vertical offset
    _debug() {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      spinGroup.updateMatrixWorld();
      const local = latLonToVec(-27.5954, -48.548, R);
      const wp = local.clone().applyMatrix4(spinGroup.matrixWorld);
      const proj = wp.clone().project(camera);
      return {
        curY: +curY.toFixed(3),
        floripaXpct: +((proj.x * 0.5 + 0.5) * 100).toFixed(1),
        floripaYpct: +((-proj.y * 0.5 + 0.5) * 100).toFixed(1),
        rotDeg: +((curRot * 180) / Math.PI).toFixed(1),
        frames: _frames,
        lastP: +_lastP.toFixed(3),
      };
    },
  };

  window.Globe = Globe;
})();
