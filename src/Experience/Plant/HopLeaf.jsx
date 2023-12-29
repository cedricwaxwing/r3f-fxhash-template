import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import leafGbl from "../../assets/plants/hops/leaf_1.gltf";
const HopLeaf = ({ ...props }) => {
  const { nodes, materials } = useGLTF(leafGbl);
  const { map, roughnessMap } = materials["Leaf_1"];
  [map, roughnessMap].map((map) => {
    map.offset.set(0.01, 0.01);
    map.repeat.set(0.95, 0.95);
  });

  return (
    <Float floatIntensity={0.8} rotationIntensity={0}>
      <group {...props}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Leaf_1.geometry}
          scale-x={0.7}
        >
          <meshStandardMaterial
            map={map}
            roughness={2}
            roughnessMap={roughnessMap}
            side={THREE.DoubleSide}
            transparent
            needsUpdate
          />
        </mesh>
      </group>
    </Float>
  );
};

export default HopLeaf;
