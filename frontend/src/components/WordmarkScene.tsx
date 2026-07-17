import UnicornScene from "unicornstudio-react";

/**
 * "1367" wordmark with a progressive blur — used by the Footer and the About
 * hero. The parent must be sized and positioned; the scene fills it.
 *
 * Pinned to SDK v2.2.8 because footer-scene.json declares version 2.2.8 —
 * HeroScene's v2.2.1 SDK cannot read it. The wordmark is embedded in the JSON
 * as a base64 SVG, so the scene needs no external assets, and its background
 * layer is authored at alpha 0 so whatever sits behind it shows through.
 */
export default function WordmarkScene() {
  return (
    <UnicornScene
      jsonFilePath="/footer-scene.json"
      width="100%"
      height="100%"
      scale={1}
      dpi={1.5}
      fps={60}
      lazyLoad
      ariaLabel="1367"
      sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.8/dist/unicornStudio.umd.js"
    />
  );
}
