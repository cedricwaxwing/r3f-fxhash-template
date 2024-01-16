import concrete from "../assets/textures/TCom_GenericBrickSurface_New_4K_roughness.webp";
import { MeshTransmissionMaterial, useTexture } from "@react-three/drei";

export const TubeMaterial = ({ color }) => {
  return (
    <meshPhysicalMaterial
      envMapIntensity={1.3}
      sheen={2}
      sheenColor={color}
      sheenRoughness={0.2}
      clearcoat={0.5}
      color={color}
    />
  );
};

export const PhysicalMaterial = ({ color }) => {
  const texture = useTexture(concrete);
  return (
    <meshPhysicalMaterial
      envMapIntensity={1.3}
      metalness={0.7}
      bumpMap={texture}
      bumpScale={1}
      sheen={2}
      sheenColor={color}
      sheenRoughness={0.2}
      clearcoat={0.3}
      clearcoatRoughness={0.4}
      clearcoatRoughnessMap={texture}
      clearcoatMap={texture}
      color={color}
    />
  );
};

export const MetalMaterial = ({ color }) => {
  const texture = useTexture(concrete);
  return (
    <meshPhysicalMaterial
      metalness={1}
      roughness={0.29}
      sheen={2}
      sheenColor={color}
      sheenRoughness={0.9}
      clearcoat={0.3}
      envMapIntensity={1.3}
      reflectivity={2}
      iridescence={3}
      iridescenceMap={texture}
      iridescenceThicknessMap={texture}
      color={color}
    />
  );
};

export const TransmissiveMaterial = () => {
  const texture = useTexture(concrete);
  return (
    <MeshTransmissionMaterial
      thickness={0.25}
      distortion={1}
      roughness={0.1}
      bumpMap={texture}
      bumpScale={0.5}
      envMapIntensity={1.3}
      backside
      backsideThickness={0.3}
      backsideResolution={4096}
      iridescence={2}
      iridescenceMap={texture}
    />
  );
};
