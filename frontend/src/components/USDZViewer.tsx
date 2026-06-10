import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader.js'

interface Props {
  src: string
  playing?: boolean
  rotationSpeed?: number
  tiltX?: number
  tiltY?: number
  tiltZ?: number
  offsetY?: number
  cameraAzimuth?: number
  cameraElevation?: number
  cameraDistance?: number
  fov?: number
  scale?: number
  lAmbient?: number
  lTopRight?: number
  lBottomLeft?: number
  lTopLeft?: number
  lFront?: number
  lRight?: number
  lBottom?: number
  style?: React.CSSProperties
  className?: string
}

export default function USDZViewer({
  src,
  playing = true,
  rotationSpeed = 0.004,
  tiltX = 0, tiltY = 0, tiltZ = 0,
  offsetY = 0,
  cameraAzimuth = 0,
  cameraElevation = 1.57,
  cameraDistance = 1,
  fov = 40,
  scale = 1,
  lAmbient    = 2,
  lTopRight   = 3,
  lBottomLeft = 3,
  lTopLeft    = 3,
  lFront      = 0,
  lRight      = 0,
  lBottom     = 0,
  style,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const r = {
    playing:       useRef(playing),
    rotationSpeed: useRef(rotationSpeed),
    tiltX:         useRef(tiltX),
    tiltY:         useRef(tiltY),
    tiltZ:         useRef(tiltZ),
    offsetY:       useRef(offsetY),
    azimuth:       useRef(cameraAzimuth),
    elevation:     useRef(cameraElevation),
    distance:      useRef(cameraDistance),
    fov:           useRef(fov),
    scale:         useRef(scale),
    lAmbient:      useRef(lAmbient),
    lTopRight:     useRef(lTopRight),
    lBottomLeft:   useRef(lBottomLeft),
    lTopLeft:      useRef(lTopLeft),
    lFront:        useRef(lFront),
    lRight:        useRef(lRight),
    lBottom:       useRef(lBottom),
  }

  r.playing.current       = playing
  r.rotationSpeed.current = rotationSpeed
  r.tiltX.current         = tiltX
  r.tiltY.current         = tiltY
  r.tiltZ.current         = tiltZ
  r.offsetY.current       = offsetY
  r.azimuth.current       = cameraAzimuth
  r.elevation.current     = cameraElevation
  r.distance.current      = cameraDistance
  r.fov.current           = fov
  r.scale.current         = scale
  r.lAmbient.current      = lAmbient
  r.lTopRight.current     = lTopRight
  r.lBottomLeft.current   = lBottomLeft
  r.lTopLeft.current      = lTopLeft
  r.lFront.current        = lFront
  r.lRight.current        = lRight
  r.lBottom.current       = lBottom

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.01, 10000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, lAmbient)
    scene.add(ambient)

    const lights = [
      { l: new THREE.DirectionalLight(0xffffff), pos: [ 5,  10,  5] as const, ref: r.lTopRight   },
      { l: new THREE.DirectionalLight(0xffffff), pos: [-5,  -5, -5] as const, ref: r.lBottomLeft  },
      { l: new THREE.DirectionalLight(0xffffff), pos: [-5,  10,  5] as const, ref: r.lTopLeft     },
      { l: new THREE.DirectionalLight(0xffffff), pos: [ 0,   0, 10] as const, ref: r.lFront       },
      { l: new THREE.DirectionalLight(0xffffff), pos: [10,   0,  0] as const, ref: r.lRight       },
      { l: new THREE.DirectionalLight(0xffffff), pos: [ 0, -10,  0] as const, ref: r.lBottom      },
    ]
    lights.forEach(({ l, pos }) => { l.position.set(pos[0], pos[1], pos[2]); scene.add(l) })

    // tiltGroup applies world-space tilt (the spin axis itself is tilted)
    const tiltGroup  = new THREE.Group()
    const turntable  = new THREE.Group()
    tiltGroup.add(turntable)
    scene.add(tiltGroup)

    let model: THREE.Group | null = null
    let baseDistance = 5
    let animId: number
    let elapsed = 0
    let lastTs = performance.now()

    new USDZLoader().load(src, (group) => {
      const box = new THREE.Box3().setFromObject(group)
      const size = box.getSize(new THREE.Vector3())
      baseDistance = Math.max(size.x, size.y, size.z) * 2.2
      group.position.sub(box.getCenter(new THREE.Vector3()))
      camera.near = baseDistance * 0.001
      camera.far  = baseDistance * 100
      camera.updateProjectionMatrix()
      model = group
      turntable.add(group)
    })

    const animate = (ts: number) => {
      animId = requestAnimationFrame(animate)
      if (r.playing.current) elapsed += (ts - lastTs) * 0.001
      lastTs = ts

      ambient.intensity = r.lAmbient.current
      lights.forEach(({ l, ref }) => { l.intensity = ref.current })

      // world-space tilt — spin axis is tilted, model always appears same lean
      tiltGroup.rotation.x = r.tiltX.current
      tiltGroup.rotation.z = r.tiltZ.current

      // spin on the tilted Y axis
      turntable.rotation.y = r.offsetY.current + elapsed * r.rotationSpeed.current * 60

      if (model) {
        const s = r.scale.current
        model.scale.set(s, s, s)
        model.rotation.y = r.tiltY.current
      }

      const dist = baseDistance * r.distance.current
      const phi  = r.elevation.current
      const tht  = r.azimuth.current
      camera.position.set(
        dist * Math.sin(phi) * Math.sin(tht),
        dist * Math.cos(phi),
        dist * Math.sin(phi) * Math.cos(tht),
      )
      camera.lookAt(0, 0, 0)
      camera.fov = r.fov.current
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }
    animate(performance.now())

    const ro = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [src])

  return <div ref={containerRef} style={{ width: '100%', height: '100%', ...style }} className={className} />
}
