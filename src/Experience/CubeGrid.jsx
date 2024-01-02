import {
  MeshTransmissionMaterial,
  Instance,
  Instances,
} from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { random_bool, random_choice, random_num } from "../common/utils";
import { useEffect, useMemo, useRef } from "react";
import { RoundedBoxGeometry } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

const Cube = ({ position, scale }) => {
  const instanceRef = useRef();
  const { theme } = useFeatures();
  const color = useMemo(() => random_choice(theme.colors), [theme.colors]);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.color.set(color);
    }
  }, [color]);

  return (
    <Instance
      castShadow
      receiveShadow
      ref={instanceRef}
      position={position}
      scale={scale}
    />
  );
};

const height = 8;
const depth = 4;
const exponent = random_num(1, 2);
const precomputedX = Array.from(
  { length: depth * 2 },
  (_, i) => Math.sign(i - depth) * Math.pow(Math.abs(i - depth), exponent)
);
const precomputedY = Array.from(
  { length: height * 2 },
  (_, i) => Math.sign(i - height) * Math.pow(Math.abs(i - height), exponent)
);
const precomputedZ = Array.from(
  { length: depth * 2 },
  (_, i) => Math.sign(i - depth) * Math.pow(Math.abs(i - depth), exponent)
);

const CubeGrid = ({ texture }) => {
  const roundedBoxGeo = new RoundedBoxGeometry(
    1,
    1,
    1,
    1,
    random_num(0.01, 0.1)
  );

  const standardMaterial = (
    <meshStandardMaterial
      envMap={texture}
      envMapIntensity={0.8}
      roughness={0.6}
      color={"#fff"}
    />
  );
  const transmissionMaterial = (
    <MeshTransmissionMaterial
      envMap={texture}
      transmission={0.9}
      backside={true}
      backsideThickness={2.3}
      thickness={2.3}
      envMapIntensity={0.9}
      roughness={0.1}
      color={"#fff"}
    />
  );
  const cubes = [[], [], [], []];

  for (let x = -depth; x < depth; x++) {
    for (let y = -height; y < height; y++) {
      for (let z = -depth; z < depth; z++) {
        const seed = random_num(0, 1);
        const scale = random_bool(0.5) ? random_num(0.5, 0.95) : 0.95;
        const adjustedX = precomputedX[x + depth];
        const adjustedY = precomputedY[y + height];
        const adjustedZ = precomputedZ[z + depth];
        const cube = (
          <Cube
            key={`${x}-${y}-${z}`}
            texture={texture}
            position={[adjustedX, adjustedY, adjustedZ]}
            scale={scale}
          />
        );
        if (seed < 0.2) {
          cubes[0].push(cube);
        } else if (seed < 0.35) {
          cubes[1].push(cube);
        } else if (seed < 0.55) {
          cubes[2].push(cube);
        } else if (seed < 0.7) {
          cubes[3].push(cube);
        }
      }
    }
  }

  return (
    <>
      <Instances range={cubes[0].length}>
        <sphereGeometry args={[0.4, 48, 48]} />
        {standardMaterial}
        {cubes[0].map((cube, i) => cube)}
      </Instances>
      <Instances range={cubes[1].length} geometry={roundedBoxGeo}>
        {transmissionMaterial}
        {cubes[1].map((cube, i) => cube)}
      </Instances>
      <Instances range={cubes[2].length}>
        <sphereGeometry args={[0.4, 48, 48]} />
        {transmissionMaterial}
        {cubes[2].map((cube, i) => cube)}
      </Instances>
      <Instances range={cubes[3].length} geometry={roundedBoxGeo}>
        {standardMaterial}
        {cubes[3].map((cube, i) => cube)}
      </Instances>
    </>
  );
};

export default CubeGrid;
