import { Environment } from "@react-three/drei";
import { SoftShadows } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { mapValue } from "../common/utils";
import { Suspense } from "react";
import Grid from "./Grid";
import Water from "./Water";
import wideStreetHdr from "../assets/hdri/wide_street_02_4k.hdr";
import {
  DepthOfField,
  EffectComposer,
  SMAA,
  SSAO,
  ToneMapping,
} from "@react-three/postprocessing";
import { folder, useControls } from "leva";

export default function Scene() {
  const { theme, lighting, lightingBrightness } = useFeatures();

  const dofConfig = useControls({
    dof: folder(
      {
        focusDistance: { min: 0, max: 30, value: 0.0 },
        focalLength: { min: 0, max: 30, value: 0.02, step: 0.0001 },
        bokehScale: { min: 0, max: 5, value: 2 },
        target: { value: [0, 0, 0] },
      },
      { collapsed: true }
    ),
  });

  const ssaoConfig = useControls({
    ssao: folder(
      {
        samples: { min: 0, max: 100, value: 30 },
        rings: { min: 0, max: 20, value: 4 },
        distanceThreshold: { min: 0, max: 5, value: 1.0 },
        distanceFalloff: { min: 0, max: 1, value: 0.0 },
        rangeThreshold: { min: 0, max: 1, value: 0.5 },
        rangeFalloff: { min: 0, max: 1, value: 0.1 },
        luminanceInfluence: { min: 0, max: 1, value: 0.9 },
        radius: { min: 0, max: 100, value: 20 },
        scale: { min: 0, max: 1, value: 0.5 },
        bias: { min: 0, max: 1, value: 0.5 },
        enabled: { value: false },
      },
      { collapsed: true }
    ),
  });

  const toneMapping = useControls({
    toneMapping: folder(
      {
        samples: { min: 0, max: 100, value: 30 },
        adaptive: { value: true },
        resolution: { value: 256 },
        middleGrey: { value: 0.6, min: 0, max: 1 },
        maxLuminance: { value: 16.0, min: 0, max: 64 },
        averageLuminance: { value: 1.0, min: 0, max: 5.0 },
        adaptationRate: { value: 1.0, min: 0, max: 10 },
        enabled: true,
      },
      { collapsed: true }
    ),
  });

  return (
    <>
      <Suspense fallback={null}>
        <ambientLight
          intensity={mapValue(lightingBrightness, 0, 1, 1.25, 0.5)}
          color={lighting}
        />
        <directionalLight
          castShadow
          position={[50, 50, 50]}
          intensity={2}
          shadow-mapSize={4096}
          shadow-bias={0.2}
          color={lighting}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-15, 15, -15, 15]}
          />
        </directionalLight>
        <color attach="background" args={[theme.background[1]]} />
        <Environment files={wideStreetHdr} resoltuion={4096} />
        <Grid />
        <Water />
        <SoftShadows size={32} focus={0.1} samples={48} />
      </Suspense>
      <EffectComposer>
        <DepthOfField {...dofConfig} />
        {ssaoConfig.enabled && <SSAO {...ssaoConfig} />}
        {toneMapping.enabled && <ToneMapping />}
      </EffectComposer>
    </>
  );
}
