import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import { random_choice, random_num } from "../common/utils";
import { memo, useEffect, useRef } from "react";
import { useFeatures } from "../common/FeaturesProvider";

function LotusLeaves({ texture, lotus }) {
  const { theme } = useFeatures();
  const lotuses = [];
  const num = 90;

  for (let i = 0; i <= num; i++) {
    const leaf = {
      position: [random_num(-10, 10), random_num(-16, 16), random_num(-10, 10)],
      scale: random_num(0.02, 0.2),
      rotation: [
        random_num(-Math.PI * 2, Math.PI * 2),
        random_num(-Math.PI * 2, Math.PI * 2),
        random_num(-Math.PI * 2, Math.PI * 2),
      ],
      color: random_choice(theme.colors),
    };
    lotuses.push(leaf);
  }

  const { nodes, materials } = lotus;
  const { map, roughnessMap, heightMap } = materials["Default OBJ"];

  return (
    <Instances
      castShadow
      receiveShadow
      limit={lotuses.length}
      geometry={nodes.lotus_OBJ_low.geometry}
    >
      <meshStandardMaterial
        map={map}
        roughness={1}
        roughnessMap={roughnessMap}
        bumpMap={heightMap}
        bumpScale={3}
        envMap={texture}
        envMapIntensity={0.25}
        displacementMap={heightMap}
        displacementScale={0.5}
        side={THREE.DoubleSide}
        transparent
        needsUpdate
      />
      <group position={[0, 0, 0]}>
        {lotuses.map((data, i) => (
          <Lotus key={i} {...data} />
        ))}
      </group>
    </Instances>
  );
}

function Lotus({ position, scale, rotation, color }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.scale.setScalar(scale);
      ref.current.rotation.set(...rotation);
      ref.current.position.set(...position);
      ref.current.color.set(color);
    }
  }, [ref, position, scale, rotation, color]);

  return <Instance ref={ref}></Instance>;
}

export default memo(LotusLeaves);
