import {
  MeshTransmissionMaterial,
  Instance,
  Instances,
} from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { random_choice, random_num } from "../common/utils";
import { memo, useEffect, useMemo, useRef } from "react";
import { RoundedBoxGeometry } from "three-stdlib";

const Cube = ({ position, scale }) => {
  const instanceRef = useRef();
  const { theme } = useFeatures();
  const color = useMemo(() => random_choice(theme.colors), [theme.colors]);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.color.set(color);
    }
  }, [color]);

  return <Instance ref={instanceRef} position={position} scale={scale} />;
};

const height = 8;
const depth = 4;
const exponent = random_num(1.4, 2.4);
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
  const b = random_num(0.01, 0.1);
  const roundedBoxGeo = new RoundedBoxGeometry(1, 1, 1, 1, b);

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
      distortion={1.5}
      envMapIntensity={0.9}
      roughness={0.1}
      color={"#fff"}
    />
  );
  const cubes = [[], [], [], []];
  const visible = random_num(0.45, 0.7);

  for (let x = -depth; x < depth; x++) {
    for (let y = -height; y < height; y++) {
      for (let z = -depth; z < depth; z++) {
        const seed = random_num(0, 1);
        const scale = random_num(0.25, 0.999);
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
        if (seed < (visible / 4) * 1) {
          cubes[0].push(cube);
        } else if (seed < (visible / 4) * 2) {
          cubes[1].push(cube);
        } else if (seed < (visible / 4) * 3) {
          cubes[2].push(cube);
        } else if (seed < (visible / 4) * 4) {
          cubes[3].push(cube);
        }
      }
    }
  }

  return (
    <>
      <Instances castShadow receiveShadow range={cubes[0].length}>
        <sphereGeometry args={[0.4, 48, 48]} />
        {standardMaterial}
        {cubes[0].map((cube, i) => cube)}
      </Instances>
      <Instances
        castShadow
        receiveShadow
        range={cubes[1].length}
        geometry={roundedBoxGeo}
      >
        {transmissionMaterial}
        {cubes[1].map((cube, i) => cube)}
      </Instances>
      <Instances castShadow receiveShadow range={cubes[2].length}>
        <sphereGeometry args={[0.4, 48, 48]} />
        {transmissionMaterial}
        {cubes[2].map((cube, i) => cube)}
      </Instances>
      <Instances
        castShadow
        receiveShadow
        range={cubes[3].length}
        geometry={roundedBoxGeo}
      >
        {standardMaterial}
        {cubes[3].map((cube, i) => cube)}
      </Instances>
    </>
  );
};

export default memo(CubeGrid);
