import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";
import CustomShapes from "./CustomShapes";
import { Canvas } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";
import { useControls } from "leva";

function Experience() {
  const { theme, name } = useFeatures();
  console.log(name);
  const { enabled, ...config } = useControls({
    enabled: true,
    size: { value: 25, min: 0, max: 100 },
    focus: { value: 0.88, min: 0, max: 2 },
    samples: { value: 16, min: 1, max: 20, step: 1 },
  });
  return (
    <Canvas shadows camera={{ fov: 8, position: [15, 15, 30] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 7, 10]} />
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize={2048}
        shadow-bias={0.2}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-10, 10, -10, 10, 0.1, 50]}
        />
      </directionalLight>
      <color attach="background" args={[theme.background]} />
      <CustomShapes />
      {enabled && <SoftShadows {...config} />}
      <OrbitControls />
    </Canvas>
  );
}

export default Experience;
