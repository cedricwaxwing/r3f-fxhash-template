import { Environment } from "@react-three/drei";
import { SoftShadows } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { mapValue } from "../common/utils";
import { Suspense } from "react";
import Grid from "./Grid";
import Water from "./Water";

export default function Scene() {
  const { theme, lighting, lightingBrightness } = useFeatures();

  return (
    <Suspense fallback={null}>
      <ambientLight
        intensity={mapValue(lightingBrightness, 0, 1, 1.25, 0.5)}
        color={lighting}
      />
      <directionalLight
        castShadow
        position={[50, 50, 50]}
        intensity={2}
        shadow-mapSize={2048}
        shadow-bias={0.2}
        color={lighting}
      >
        <orthographicCamera attach="shadow-camera" args={[-15, 15, -15, 15]} />
      </directionalLight>
      {/* <color attach="background" args={[theme.background[1]]} /> */}
      <Environment
        background
        files={"./assets/hdri/wide_street_02_4k.hdr"}
        resoltuion={4096}
      />
      <Grid />
      <Water />
      <SoftShadows size={24} focus={0.88} samples={16} />
    </Suspense>
  );
}
