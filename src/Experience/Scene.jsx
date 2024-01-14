import { Environment, SoftShadows } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { mapValue } from "../common/utils";
import { Suspense } from "react";
import Grid from "./Grid";
import wideStreetHdr from "../assets/hdri/wide_street_02_4k.hdr";
import Water from "./Water";

export default function Scene() {
  const { theme, lighting, lightingBrightness } = useFeatures();

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
          intensity={2}
          shadow-mapSize={4096}
          shadow-bias={0.2}
          color={lighting}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-21, 21, -21, 21]}
          />
        </directionalLight>
        <color attach="background" args={[theme.background[1]]} />
        {/* <fog attach="fog" args={[theme.background[1], 10, 15]} /> */}
        <Environment files={wideStreetHdr} resoltuion={4096} />
        <Grid />
        <Water />
        <SoftShadows size={32} focus={0.1} samples={48} />
      </Suspense>
    </>
  );
}
