import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Plane, useTexture } from "@react-three/drei";
import { LayerMaterial, Displace, Noise } from "lamina";
import { useControls } from "leva";
import { useFeatures } from "../common/FeaturesProvider";
import { getNoiseColors } from "../common/utils";
import roughnessMap from "../assets/textures/roughness_map.webp";

const Water = () => {
  const strength = useRef(0.15);
  const speed = useRef(1.8);
  const displaceRef = useRef(null);
  const { theme } = useFeatures();
  const displace = useTexture(roughnessMap);
  const { viewport } = useThree();

  const { sheen, sheenColor, clearcoat, clearcoatRoughness, envMapIntensity } =
    useControls({
      sheenColor: { value: "#1f58b5" },
      sheen: { min: 0, max: 10, value: 3.0 },
      clearcoat: { min: 0, max: 1, value: 0.95 },
      clearcoatRoughness: { min: 0, max: 1, value: 0.15 },
      envMapIntensity: { min: 0, max: 5, value: 0.9 },
    });

  useFrame((state, dt) => {
    if (displaceRef.current) {
      displaceRef.current.offset.x += speed.current * dt;
      displaceRef.current.offset.y += (speed.current / 4) * dt;
      displaceRef.current.offset.z += (speed.current / 4) * dt;
    }
  });

  return (
    <group
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      position={[0, -((viewport.height / 2) * 0.75), -40]}
    >
      <Plane args={[100, 200, 256, 512]} receiveShadow>
        <LayerMaterial
          lighting="physical"
          sheenColor={sheenColor}
          sheen={sheen}
          transmissionMap={displace}
          clearcoat={clearcoat}
          clearcoatRoughness={clearcoatRoughness}
          envMapIntensity={envMapIntensity}
        >
          <Displace ref={displaceRef} strength={strength.current} scale={0.5} />
          <Noise {...getNoiseColors([...theme.colors])} scale={1} />
        </LayerMaterial>
      </Plane>
    </group>
  );
};

export default Water;
