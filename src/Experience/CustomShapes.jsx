import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { random_choice, random_num } from "../common/utils";
import { useFeatures } from "../common/FeaturesProvider";

const snapAngle = (value, snapTo) => Math.round(value / snapTo) * snapTo;

const CustomShapes = () => {
  const { shapes } = useFeatures();
  const { viewport } = useThree();

  const data = useMemo(() => {
    return [...Array(shapes)].map(() => {
      return {
        position: [
          random_num(-viewport.width / 2, viewport.width / 2),
          random_num(-viewport.height / 2, viewport.height / 2),
          random_num(-0.5, 0.5),
        ],
        scale: random_num(0.5, 1.5),
        rotation: [
          snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
          snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
          snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
        ],
      };
    });
  }, [viewport.width, viewport.height]);

  return (
    <>
      {data.map((shapeData, index) => (
        <CustomShape key={index} data={shapeData} />
      ))}
    </>
  );
};

const CustomShape = ({ data }) => {
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
};

export default CustomShapes;
