import { OrbitControls } from "@react-three/drei";
import CustomShape from "./CustomShape";
import { Canvas } from "@react-three/fiber";

function Experience() {
  return (
    <Canvas camera={{ fov: 8, position: [0, 0, 40] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CustomShape />
      <OrbitControls />
    </Canvas>
  );
}

export default Experience;
