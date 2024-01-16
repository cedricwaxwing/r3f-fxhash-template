import * as THREE from "three";
import { useMemo } from "react";
import { createNoise2D } from "simplex-noise";
import { useFeatures } from "../common/FeaturesProvider";
import { Gradient, LayerMaterial, Noise } from "lamina";
import { blendColors, mapValue } from "../common/utils";

const Hills = ({
  numPoints = 800,
  width = 45,
  maxHeight = 5,
  position,
  // intensity = 0.5,
  easingPoint = 0.2,
}) => {
  const simplexMacro = createNoise2D();
  const simplexMed = createNoise2D();
  const simplexMicro = createNoise2D();
  const { theme, envRotation, timeOfDay } = useFeatures();

  const intensity = mapValue(position[2], -35, -60, 0, 1);

  const easing = (x, threshold) => {
    if (x < threshold) {
      return x / threshold;
    } else {
      return 1 - (x - threshold) / (1 - threshold);
    }
  };

  const hillsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width;
      const z = 0;
      let yMacro = simplexMacro(x / 30, 0) * (intensity * 3);
      let yMed = simplexMed(x / 5, 0) * (intensity * 0.8);
      let yMicro =
        simplexMicro(x * 3, 0) * mapValue(intensity, 0, 0.8, 0.25, 0);

      let easingFactor = easing(i / numPoints, easingPoint);

      let y =
        easingFactor * maxHeight + easingFactor * (yMacro + yMed + yMicro);

      y = Math.max(y, 0);

      vertices.push(x, y, z);
      vertices.push(x, 0, z);
    }

    for (let i = 0; i < 2 * numPoints; i += 2) {
      indices.push(i, i + 1, i + 3);
      indices.push(i, i + 3, i + 2);
    }

    geometry.setIndex(indices);
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.computeVertexNormals();

    return geometry;
  }, [
    numPoints,
    width,
    maxHeight,
    intensity,
    easingPoint,
    simplexMacro,
    simplexMed,
    simplexMicro,
  ]);

  return (
    <mesh position={position} geometry={hillsGeometry}>
      <meshBasicMaterial
        color={blendColors(
          timeOfDay[envRotation].hills,
          timeOfDay[envRotation].fog,
          intensity
        )}
      />
    </mesh>
  );
};

export default Hills;
