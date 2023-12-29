import { useThree } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";
import * as THREE from "three";
import { random_choice, random_num } from "../common/utils";
import { useState, useEffect } from "react";
import {
  CubeCamera,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
} from "@react-three/drei";

const snapAngle = (value, snapTo) => {
  const roundedValue = Math.round(value / snapTo) * snapTo;
  return Math.abs(roundedValue) < snapTo / 2 ? snapTo : roundedValue;
};

const generateShape = (vWidth, vHeight) => {
  const data = {
    position: [
      random_num(-vWidth / 1.8, vWidth / 1.8),
      random_num(-vHeight / 1.8, vHeight / 1.8),
      random_num(-0.15, 0.15),
    ],
    scale: random_num(0.5, 1.5),
    rotation: [
      snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
      snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
      snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
    ],
  };

  const depth = random_num(0.1, 0.5);
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

  const shapeGeometry = new THREE.ExtrudeGeometry(lShape, {
    steps: 2,
    depth: depth,
    bevelEnabled: false,
  });

  // Apply position and rotation transformations to the geometry
  const { position, rotation, scale } = data;
  shapeGeometry.translate(...position);
  shapeGeometry.rotateX(rotation[0]);
  shapeGeometry.rotateY(rotation[1]);
  shapeGeometry.rotateZ(rotation[2]);
  shapeGeometry.scale(scale, scale, scale);

  shapeGeometry.computeBoundingBox(); // Compute the bounding box here

  return shapeGeometry;
};

export default function CustomShapes() {
  const { viewport } = useThree();
  const { num_shapes, theme } = useFeatures();
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const generatedShapes = [];
    let protection = 0;

    while (generatedShapes.length < num_shapes) {
      const geometry = generateShape(viewport.width, viewport.height);
      const mesh = new THREE.Mesh(geometry);

      let overlapping = false;
      for (let i = 0; i < generatedShapes.length; i++) {
        const existingShape = generatedShapes[i];
        existingShape.geometry.computeBoundingBox(); // Compute bounding box for existing shape
        if (
          mesh.geometry.boundingBox.intersectsBox(
            existingShape.geometry.boundingBox
          )
        ) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        generatedShapes.push(mesh);
      }

      protection++;
      if (protection > 1000) {
        console.error(
          "Protection limit reached. Consider increasing the viewport size or decreasing num_shapes."
        );
        break;
      }
    }

    setShapes(generatedShapes);
  }, [viewport.height, viewport.width, num_shapes, theme]);

  return (
    <>
      <CubeCamera frames={1}>
        {(texture) => (
          <>
            {shapes.map((shape, index) => {
              const { geometry, position, rotation, scale } = shape;
              return (
                <mesh
                  castShadow
                  receiveShadow
                  key={index}
                  geometry={geometry}
                  position={position}
                  rotation={rotation}
                  scale={scale}
                >
                  {applyMaterial(random_choice(theme.colors), texture)}
                  {/* <primitive  object={shape} /> */}
                </mesh>
              );
            })}
          </>
        )}
      </CubeCamera>
    </>
  );
}

const applyMaterial = (color, texture) => {
  const r = random_num(0, 1);
  if (r < 0.8) {
    return (
      <meshStandardMaterial
        envMap={texture}
        envMapIntensity={0.8}
        color={color}
      />
    );
    // } else if (r < 0.9) {
    //   return (
    //     <MeshReflectorMaterial
    //       envMapIntensity={0.8}
    //       envMap={texture}
    //       // color={color}
    //     />
    //   );
  } else {
    return (
      <MeshTransmissionMaterial
        envMap={texture}
        envMapIntensity={0.8}
        color="#fff"
        ior={1.33}
        thickness={2}
        backside
        backsideThickness={0.3}
        distortion={0.6}
        distortionScale={0.3}
        chromaticAberration={30}
      />
    );
  }
};
