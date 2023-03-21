import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import buildingGlb from "../assets/models/building1.glb";

export default function Stairs({ ...props }) {
  const { nodes } = useGLTF(buildingGlb);

  return (
    <>
      <group {...props} dispose={null}>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Steps2.geometry}
            position={[0, 0, 0]}
            scale={[0.1, 0.1, 1]}
          >
            <MeshTransmissionMaterial
              transmission={1.02}
              roughness={0}
              emissive={"orange"}
              emissiveIntensity={0.02}
              ior={1.33}
              thickness={2}
              distortion={1.3}
              backsideThickness={3}
              chromaticAberration={3}
            />
          </mesh>
        </RigidBody>
      </group>
    </>
  );
}
