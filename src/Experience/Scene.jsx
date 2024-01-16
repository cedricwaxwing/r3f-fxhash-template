import { useFeatures } from "../common/FeaturesProvider";
import { Suspense } from "react";
import Env from "./Env";
import Grid from "./Grid";
import Water from "./Water";
import Hills from "./Hills";
import { useThree } from "@react-three/fiber";
import {
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  ToneMapping,
  SSAO,
  Vignette,
} from "@react-three/postprocessing";
import { Color } from "three";
import { BlendFunction, SSAOEffect } from "postprocessing";

export default function Scene() {
  const { theme, lighting } = useFeatures();
  const { viewport } = useThree();
  const groundY = -(viewport.height / 2) * 0.8;

  return (
    <>
      <Suspense fallback={null}>
        <Grid groundY={groundY} />
        <Hills
          position={[-30, groundY, -55]}
          maxHeight={6}
          width={70}
          intensity={0.8}
        />
        <Hills
          position={[-22, groundY, -40]}
          maxHeight={6}
          width={30}
          intensity={0.5}
          easingPoint={0.8}
        />
        <Hills
          position={[-26, groundY, -35]}
          maxHeight={3}
          width={40}
          intensity={0.3}
        />
        <Water
          position={[0, groundY, -10]}
          waterColor={new Color(theme.primary)}
          sunColor={new Color(lighting)}
          fog
          distortionScale={2}
        />
        <Env groundY={groundY} />
      </Suspense>
      <EffectComposer>
        <DepthOfField
          worldFocusDistance={10}
          worldFocusRange={10}
          bokehScale={3}
          resolutionScale={1}
        />
        <ToneMapping blendFunction={BlendFunction.SOFT_LIGHT} whitePoint={2} />
        <BrightnessContrast brightness={-0.02} contrast={0.2} />
        <SSAO />
        <Vignette opacity={0.6} />
      </EffectComposer>
    </>
  );
}
