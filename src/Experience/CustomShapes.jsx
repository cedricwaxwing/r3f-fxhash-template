import { useMemo, useState, useEffect, memo } from "react";
import { useThree } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";
import * as THREE from "three";
import { random_choice, random_num } from "../common/utils";
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
    scale: random_num(0.85, 1.15),
    rotation: [
      snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
      snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
      snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
    ],
  };

  const depth = random_num(0.1, 0.5);
  const height = random_num(0.5, 4);
  const width = random_num(0.5, 4);
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
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.02,
    bevelThickness: 0.02,
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

const CustomShapes = () => {
  const { viewport } = useThree();
  const features = useFeatures();
  const [shapes, setShapes] = useState([]);
  const [materialConfig, setMaterialConfig] = useState({
    colors: [],
    seeds: [],
  });

  const { num_shapes, theme } = features;

  useEffect(() => {
    const generatedShapes = [];
    const generatedColors = [];
    const genereatedSeeds = [];
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
        generatedColors.push(random_choice(theme.colors));
        genereatedSeeds.push(random_num(0, 1));
      }

      protection++;
      if (protection > 1000) {
        console.error(
          "Protection limit reached. Consider increasing the viewport size or decreasing num_shapes."
        );
        break;
      }
    }

    setMaterialConfig({ colors: generatedColors, seeds: genereatedSeeds });
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
                  <Material
                    color={materialConfig.colors[index]}
                    texture={texture}
                    seed={materialConfig.seeds[index]}
                  />
                </mesh>
              );
            })}
          </>
        )}
      </CubeCamera>
    </>
  );
};

export default memo(CustomShapes);

const Material = ({ color, texture, seed }) => {
  if (seed < 0.8) {
    return (
      <meshStandardMaterial
        envMap={texture}
        envMapIntensity={0.8}
        color={color}
      />
    );
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
        distortion={0.1}
        distortionScale={0.3}
        chromaticAberration={30}
      />
    );
  }
};
