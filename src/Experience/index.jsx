import { CubeCamera, SoftShadows } from "@react-three/drei";
import Plant from "./Plant";
import { RGBELoader } from "three-stdlib";
import { Canvas, useLoader } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";
import art_studio from "../assets/hdri/art_studio_1k.hdr";
import { random_choice } from "../common/utils";
import CubeGrid from "./CubeGrid";
import CameraAnimation from "./CameraAnimation";

function Experience() {
  const { theme, name } = useFeatures();
  const texture = useLoader(RGBELoader, art_studio);

  console.log(name);

  return (
    <div
      style={{
        maxHeight: "90vh",
        width: "100%",
        position: "relative",
        aspectRatio: "5/7",
        maxWidth: "calc(90vh * 5/7)",
        border: "12px solid #fff",
        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      }}
    >
      <Canvas
        shadows
        orthographic
        camera={{
          position: [32, 32, 32],
          fov: 15,
          zoom: 48,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ambientLight intensity={0.7} color={random_choice(theme.colors)} />
        <pointLight
          intensity={0.5}
          position={[10, 7, 10]}
          color={random_choice(theme.colors)}
        />
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
        <CubeCamera envMap={texture} resolution={1024}>
          {(texture) => (
            <>
              <CubeGrid texture={texture} />
              <Plant texture={texture} />
            </>
          )}
        </CubeCamera>
        <SoftShadows size={24} focus={0.88} samples={16} />
        <CameraAnimation />
      </Canvas>
    </div>
  );
}

export default Experience;
