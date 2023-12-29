import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";
import CustomShapes from "./CustomShapes";
import { Canvas } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";

function Experience() {
  const { theme, name } = useFeatures();
  console.log(name);
  return (
    <Canvas shadows camera={{ fov: 8, position: [10, 10, 20] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 7, 10]} />
      <color attach="background" args={[theme.background]} />
      <CustomShapes />
      <SoftShadows />
      <OrbitControls />
    </Canvas>
  );
}

export default Experience;
