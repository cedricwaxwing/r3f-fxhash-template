import { OrbitControls } from "@react-three/drei";
import CustomShapes from "./CustomShapes";
import { Canvas } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";

function Experience() {
  const { theme } = useFeatures();
  return (
    <Canvas camera={{ fov: 8, position: [0, 0, 40] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <color attach="background" args={[theme.background]} />
      <CustomShapes />
      <OrbitControls />
    </Canvas>
  );
}

export default Experience;
