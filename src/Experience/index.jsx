import { CubeCamera, SoftShadows, Sphere } from "@react-three/drei";
import { RGBELoader } from "three-stdlib";
import { Canvas, useLoader } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";
import art_studio from "../assets/hdri/art_studio_1k.hdr";
import { mapValue, random_choice } from "../common/utils";
import CubeGrid from "./CubeGrid";
import CameraAnimation from "./CameraAnimation";
import { Suspense, useEffect } from "react";
import HopLeaves from "./HopLeaves";
import LotusLeaves from "./Lotuses";
import { Perf } from "r3f-perf";
import Loader from "./Loader";
import { LayerMaterial, Gradient } from "lamina";
import * as THREE from "three";

function Experience() {
  const { theme, lighting, lightingBrightness } = useFeatures();
  const texture = useLoader(RGBELoader, art_studio);

  useEffect(() => {
    console.log("Features:", window.$fx.getFeatures());
  }, []);

  return (
    <div className="wrapper">
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
        <Suspense fallback={<Loader />}>
          <ambientLight
            intensity={mapValue(lightingBrightness, 0, 1, 1.5, 0.5)}
            color={lighting}
          />
          <pointLight
            intensity={mapValue(lightingBrightness, 0, 1, 2, 0.05)}
            position={[100, 30, 10]}
            color={lighting}
          />
          <pointLight
            intensity={mapValue(lightingBrightness, 0, 1, 4, 0.25)}
            position={[30, 100, 10]}
            color={lighting}
          />
          <directionalLight
            castShadow
            position={[2.5, 8, 5]}
            intensity={1}
            shadow-mapSize={2048}
            shadow-bias={0.2}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-10, 10, -10, 10, 0.1, 50]}
            />
          </directionalLight>
          {theme.background.length > 1 ? (
            <Sphere scale={10000}>
              <LayerMaterial side={THREE.DoubleSide}>
                <Gradient
                  axes="y"
                  mapping="local"
                  colorA={theme.background[0]}
                  colorB={theme.background[1]}
                />
              </LayerMaterial>
            </Sphere>
          ) : (
            <color attach="background" args={[theme.background[0]]} />
          )}
          <CubeCamera envMap={texture} resolution={1024}>
            {(texture) => (
              <>
                <CubeGrid texture={texture} />
                <HopLeaves texture={texture} />
                <LotusLeaves texture={texture} />
              </>
            )}
          </CubeCamera>
          <SoftShadows size={24} focus={0.88} samples={16} />
          <CameraAnimation />
        </Suspense>
        {process.env.NODE_ENV === "development" && <Perf />}
      </Canvas>
    </div>
  );
}

export default Experience;
