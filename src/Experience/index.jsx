import { memo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, Environment, OrbitControls } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { Perf } from "r3f-perf";

const Experience = () => {
  const { palette } = useFeatures();

  return (
    <>
      <Canvas
        id="fxhash-canvas"
        shadows
        camera={{ position: [2, 2, 2], fov: 50 }}
        performace={{
          min: 0.2,
        }}
        dpr={[1, 2]}
        gl={{
          preserveDrawingBuffer: true,
        }}
      >
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <color attach="background" args={[palette.bg]} />
          <Box>
            <meshStandardMaterial color={palette.primary} />
          </Box>
          <OrbitControls />
        </Suspense>
        <Perf position="top-left" />
      </Canvas>
    </>
  );
};

export default memo(Experience);
