import { Environment, useGLTF, useTexture } from "@react-three/drei";
import leafGlb from "../assets/plants/hops/leaf_2.gltf";
import lotusGlb from "../assets/plants/lotus/lotus.glb";
import { RGBELoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import art_studio from "../assets/hdri/art_studio_1k.hdr";
import CubeGrid from "./CubeGrid";
import HopLeaves from "./HopLeaves";
import height from "../assets/plants/hops/leaf1-height.jpg";
import alpha from "../assets/plants/hops/leaf1-alpha.jpg";
import LotusLeaves from "./Lotuses";
import { CubeCamera } from "@react-three/drei";
import { SoftShadows, Sphere } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { mapValue } from "../common/utils";
import Camera from "./Camera";
import { Suspense, useEffect } from "react";
import { LayerMaterial, Gradient } from "lamina";
import * as THREE from "three";

export default function Scene({ canvasRef }) {
  const { theme, lighting, lightingBrightness } = useFeatures();

  const texture = useLoader(RGBELoader, art_studio);
  const heightMap = useTexture(height);
  const alphaMap = useTexture(alpha);
  const leaf = useGLTF(leafGlb);
  const lotus = useGLTF(lotusGlb);

  useEffect(() => {
    console.log("Features:", window.$fx.getFeatures());
  }, []);

  return (
    <Suspense fallback={null}>
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
      {/* <color attach="background" args={[theme.background[0]]} /> */}
      <CubeCamera envMap={texture} resolution={1024}>
        {(texture) => (
          <>
            <CubeGrid texture={texture} />
            <HopLeaves
              texture={texture}
              heightMap={heightMap}
              alphaMap={alphaMap}
              leaf={leaf}
            />
            <LotusLeaves texture={texture} lotus={lotus} />
          </>
        )}
      </CubeCamera>
      <SoftShadows size={24} focus={0.88} samples={16} />
      <Camera canvasRef={canvasRef} />
    </Suspense>
  );
}
