import { Box, MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import buildingGlb from "../assets/models/building1.glb";
import { DoubleSide } from "three";
import { Base, Geometry, Subtraction } from "@react-three/csg";

export default function Building1({ ...props }) {
  const { nodes } = useGLTF(buildingGlb);

  return (
    <>
      <group scale={0.8} {...props} dispose={null}>
        {/* <RigidBody type="fixed" colliders="trimesh">
        </RigidBody> */}
        <group position={[8, -2.99, 0]}>
          {/* <RigidBody type="fixed">
            <mesh scale={[12.25, 4, 12.25]}>
              <boxGeometry />
            </mesh>
          </RigidBody> */}
          {[...Array(12)].map((step, i) => (
            <RigidBody type="fixed" key={i}>
              <mesh
                position={[4, 1.75 - i * 0.25, -6.4 - i * 0.5]}
                scale={[3, 0.25, 0.5]}
              >
                <boxGeometry />
                {/* <MeshTransmissionMaterial
                  transmission={0.92}
                  emissive={"orange"}
                  emissiveIntensity={0.05}
                  rougness={0.8}
                  ior={1.33}
                  thickness={2}
                  distortion={1.3}
                  backside
                  backsideThickness={3}
                  chromaticAberration={3}
                  side={DoubleSide}
                /> */}
                <meshBasicMaterial color="red" />
              </mesh>
            </RigidBody>
          ))}
        </group>
        <RigidBody type="fixed">
          <mesh castShadow receiveShadow>
            <Geometry>
              <Base
                geometry={nodes.House002.geometry}
                scale={[6, 1, 6]}
                position={[8, 0, 0]}
              />
              <Subtraction
                geometry={nodes.Archway.geometry}
                position={[12, 0, -6]}
              />
            </Geometry>
            {/* <MeshTransmissionMaterial
                transmission={0.92}
                emissive={"orange"}
                emissiveIntensity={0.05}
                rougness={0.8}
                ior={1.33}
                thickness={2}
                distortion={1.3}
                backside
                backsideThickness={3}
                chromaticAberration={3}
                side={DoubleSide}
              /> */}
            <meshBasicMaterial color="red" />
          </mesh>
        </RigidBody>
        {/* <RigidBody type="fixed"> */}
        <mesh position={[11.8, 0, -5.4]} castShadow receiveShadow>
          <Geometry scale={0.25} position={[16.5, 2, 0]}>
            <Base
              geometry={nodes.Steps1002.geometry}
              scale={0.75}
              position={[-2, 4.22, 0]}
            />
            <Subtraction geometry={nodes.Archway.geometry} />
          </Geometry>
          {/* <MeshTransmissionMaterial
                transmission={0.92}
                emissive={"orange"}
                emissiveIntensity={0.05}
                rougness={0.8}
                ior={1.33}
                thickness={2}
                distortion={1.3}
                backside
                backsideThickness={3}
                chromaticAberration={3}
                side={DoubleSide}
              /> */}
          <meshBasicMaterial color="red" />
        </mesh>
        {/* </RigidBody> */}
      </group>
    </>
  );
}
