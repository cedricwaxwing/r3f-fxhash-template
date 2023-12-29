import { useMemo } from "react";
import * as THREE from "three";
import { random_choice, random_num } from "../common/utils";
import { useFeatures } from "../common/FeaturesProvider";

function CustomShape({ data }) {
  const { theme } = useFeatures();
  const depth = random_num(0.1, 0.5);

  const shape = useMemo(() => {
    const height = random_num(0.5, 5);
    const width = random_num(0.5, 5);
    const lShape = new THREE.Shape();
    lShape.moveTo(0, 0);
    lShape.lineTo(0, height);
    lShape.lineTo(depth, height);
    lShape.lineTo(depth, depth);
    lShape.lineTo(width, depth);
    lShape.lineTo(width, 0);
    lShape.lineTo(0, 0);
    return lShape;
  }, [depth]);

  const geometry = useMemo(() => {
    const extrudeSettings = {
      steps: 2,
      depth: depth,
      bevelEnabled: false,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [shape, depth]);

  return (
    <mesh geometry={geometry} {...data}>
      <meshStandardMaterial color={random_choice(theme.colors)} />
    </mesh>
  );
}

export default CustomShape;
