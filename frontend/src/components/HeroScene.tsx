import UnicornScene from "unicornstudio-react";

export default function HeroScene() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ width: "1440px", height: "900px", transform: "scale(var(--hero-scale, 1))", transformOrigin: "top left" }}>
        <UnicornScene
          projectId="8uD5QYeJGrupmwn7CwM8"
          width="1440px"
          height="900px"
          scale={1}
          dpi={1}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.1/dist/unicornStudio.umd.js"
        />
      </div>
    </div>
  );
}
