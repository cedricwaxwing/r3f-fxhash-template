import { Instance, Instances, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import height from "../assets/plants/hops/leaf1-height.jpg";
import alpha from "../assets/plants/hops/leaf1-alpha.jpg";
import leafGbl from "../assets/plants/hops/leaf_1.gltf";
import { random_num } from "../common/utils";
import { memo, useEffect, useRef } from "react";

function HopLeaves({ texture }) {
  const hopLeaves = [];
  const num = 90;

  for (let i = 0; i <= num; i++) {
    const leaf = {
      position: [random_num(-10, 10), random_num(-16, 16), random_num(-10, 10)],
      scale: random_num(0.1, 0.5),
      rotation: [
        random_num(-Math.PI * 2, Math.PI * 2),
        random_num(-Math.PI * 2, Math.PI * 2),
        random_num(-Math.PI * 2, Math.PI * 2),
      ],
    };
    hopLeaves.push(leaf);
  }

  const { nodes, materials } = useGLTF(leafGbl);

  const heightMap = useTexture(height);
  const alphaMap = useTexture(alpha);
  heightMap.flipY = true;
  alphaMap.flipY = true;

  const { map, roughnessMap, normalMap } = materials["Leaf_1"];

  [map, alphaMap, roughnessMap, normalMap, heightMap].forEach((map) => {
    map.offset.set(0.01, 0.01);
    map.repeat.set(0.95, 0.95);
  });

  return (
    <Instances
      castShadow
      receiveShadow
      limit={hopLeaves.length}
      geometry={nodes.Leaf_1.geometry}
    >
      <meshStandardMaterial
        alphaMap={alphaMap}
        map={map}
        roughnessMap={roughnessMap}
        bumpMap={heightMap}
        bumpScale={3}
        envMap={texture}
        envMapIntensity={0.5}
        displacementMap={heightMap}
        displacementScale={0.5}
        normalMap={normalMap}
        side={THREE.DoubleSide}
        transparent
        needsUpdate
      />
      <group position={[0, 0, 0]}>
        {hopLeaves.map((data, i) => (
          <HopLeaf key={i} {...data} />
        ))}
      </group>
    </Instances>
  );
}

function HopLeaf({ position, scale, rotation }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scale.setScalar(scale);
      ref.current.position.set(...position);
      ref.current.rotation.set(...rotation);
    }
  }, [ref, scale, position, rotation]);

  return <Instance ref={ref}></Instance>;
}

export default memo(HopLeaves);
