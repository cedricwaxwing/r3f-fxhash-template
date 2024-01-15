import { Environment, Sky, SoftShadows } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { mapValue } from "../common/utils";
import { Suspense } from "react";
import Grid from "./Grid";
import Water from "./Water";
import { useThree } from "@react-three/fiber";

export default function Scene() {
  const { theme, lighting, lightingBrightness } = useFeatures();
  const { viewport } = useThree();

  return (
    <>
      <Suspense fallback={null}>
        <ambientLight
          intensity={mapValue(lightingBrightness, 0, 1, 1.25, 0.5)}
          color={lighting}
        />
        <directionalLight
          castShadow
          position={[50, 60, 50]}
          intensity={1}
          shadow-mapSize={4096}
          shadow-bias={0.2}
          color={lighting}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-21, 21, -21, 21]}
          />
        </directionalLight>
        <Sky scale={10000} sunPosition={[50, 60, 50]} />
        <fog attach="fog" args={[theme.background[1], 10, 15]} />
        <Environment preset="sunset" resoltuion={4096} />
        <Grid />
        <Water position={[0, -(viewport.height / 2) * 0.7, 0]} />
        <SoftShadows size={32} focus={0.1} samples={48} />
      </Suspense>
    </>
  );
}
