import { SoftShadows } from "@react-three/drei";
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
} from "@react-three/postprocessing";
import { Color } from "three";

export default function Scene() {
  const { theme, lighting } = useFeatures();
  const { viewport } = useThree();
  const groundY = -(viewport.height / 2) * 0.78;

  return (
    <>
      <Suspense fallback={null}>
        <Env />
        <Grid groundY={groundY} />
        <Hills
          position={[-30, groundY, -35]}
          maxHeight={6}
          width={70}
          intensity={0.8}
        />
        <Hills
          position={[-22, groundY, -31]}
          maxHeight={6}
          width={30}
          intensity={0.5}
          easingPoint={0.8}
        />
        <Hills
          position={[-26, groundY, -28]}
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
        <SoftShadows size={32} focus={0.1} samples={48} />
      </Suspense>
      <EffectComposer>
        <DepthOfField
          worldFocusDistance={9.5}
          worldFocusRange={10}
          bokehScale={8}
          resolutionScale={1}
        />
        <BrightnessContrast brightness={-0.1} contrast={0.05} />
      </EffectComposer>
    </>
  );
}
