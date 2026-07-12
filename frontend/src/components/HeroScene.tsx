import UnicornScene from "unicornstudio-react";

export default function HeroScene() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden"}}>
      <div style={{ width: "100%", height: "100%"}}>
        <UnicornScene
          jsonFilePath="/scene.json"
          width="100%"
          height="100%"
          scale={1}
          dpi={1}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.1/dist/unicornStudio.umd.js"
        />
      </div>
    </div>
  );
}
