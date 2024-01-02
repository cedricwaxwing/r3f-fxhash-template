import { Float, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import height from "../../assets/plants/hops/leaf1-height.jpg";
import leafGbl from "../../assets/plants/hops/leaf_1.gltf";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { random_num } from "../../common/utils";

const HopLeaf = ({ texture, ...props }) => {
  const leafRef = useRef(null);
  const { nodes, materials } = useGLTF(leafGbl);

  const heightMap = useTexture(height);
  heightMap.flipY = true;

  const { map, roughnessMap, normalMap } = materials["Leaf_1"];

  [map, roughnessMap, normalMap, heightMap].forEach((map) => {
    map.offset.set(0.01, 0.01);
    map.repeat.set(0.95, 0.95);
  });

  const speed = random_num(0.05, 0.5);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (leafRef.current) {
      const oscillation = 0.95 * Math.sin(time * speed);
      leafRef.current.rotation.z = oscillation;
    }
  });

  return (
    <Float floatIntensity={0.2} rotationIntensity={0}>
      <group ref={leafRef} {...props}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Leaf_1.geometry}
          scale-x={0.7}
          position-y={0.015}
        >
          <meshStandardMaterial
            map={map}
            roughnessMap={roughnessMap}
            bumpMap={heightMap}
            bumpScale={3}
            envMap={texture}
            envMapIntensity={1}
            displacementMap={heightMap}
            displacementScale={0.15}
            normalMap={normalMap}
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
