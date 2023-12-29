import { CubeCamera, OrbitControls, SoftShadows } from "@react-three/drei";
import CustomShapes from "./CustomShapes";
import Plant from "./Plant";
import { RGBELoader } from "three-stdlib";
import { Canvas, useLoader } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";
import art_studio from "../assets/hdri/art_studio_1k.hdr";

function Experience() {
  const { theme, name } = useFeatures();
  const texture = useLoader(RGBELoader, art_studio);

  console.log(name, texture);
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
      <CubeCamera frames={1} envMap={texture} resolution={1024}>
        {(texture) => (
          <>
            <CustomShapes texture={texture} />
            <Plant texture={texture} />
          </>
        )}
      </CubeCamera>
      <SoftShadows size={24} focus={0.88} samples={16} />
      <OrbitControls />
    </Canvas>
  );
}

export default Experience;
