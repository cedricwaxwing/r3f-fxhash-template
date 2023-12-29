import { useMemo } from "react";
import * as THREE from "three";
import { random_choice, random_num } from "../common/utils";
import { useFeatures } from "../common/FeaturesProvider";

function CustomShape() {
  const { theme } = useFeatures();
  const depth = random_num(0.1, 0.5);
  const shape = useMemo(() => {
    const verticalLength = random_num(0.5, 2);
    const horizontalLength = random_num(0.5, 2);
    const lShape = new THREE.Shape();
    lShape.moveTo(0, 0);
    lShape.lineTo(0, verticalLength); // Vertical line
    lShape.lineTo(depth, verticalLength); // Small horizontal line to the right
    lShape.lineTo(depth, depth); // Small vertical line downwards
    lShape.lineTo(horizontalLength, depth); // Horizontal line to the right
    lShape.lineTo(horizontalLength, 0); // Small vertical line downwards
    lShape.lineTo(0, 0);
    return lShape;
  }, [depth]);

  const extrudeSettings = useMemo(() => {
    return {
      steps: 2,
      depth: depth,
      bevelEnabled: false,
    };
  }, [depth]);

  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [shape, extrudeSettings]);

  const data = useMemo(() => {
    const position_range = 1.5;
    const snapAngle = (value, snapTo) => {
      return Math.round(value / snapTo) * snapTo;
    };
    return {
      position: [
        random_num(-position_range, position_range),
        random_num(-position_range, position_range),
        random_num(-position_range, position_range),
      ],
      scale: random_num(0.5, 1.5),
      rotation: [
        snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
        snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
        snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
      ],
    };
  }, []);

  return (
    <mesh geometry={geometry} {...data}>
      <meshStandardMaterial color={random_choice(theme.colors)} />
    </mesh>
  );
}

export default CustomShape;
