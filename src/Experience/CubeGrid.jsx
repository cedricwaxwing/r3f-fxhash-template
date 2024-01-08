import {
  MeshTransmissionMaterial,
  Instance,
  Instances,
} from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { memo, useEffect, useRef } from "react";
import { RoundedBoxGeometry } from "three-stdlib";

const Cube = ({ position, scale, color }) => {
  const instanceRef = useRef();

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.color.set(color);
    }
  }, [color]);

  return <Instance ref={instanceRef} position={position} scale={scale} />;
};

const Line = ({ position, scale, rotation, color }) => {
  const instanceRef = useRef();

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.color.set(color);
    }
  }, [color]);

  return (
    <Instance
      ref={instanceRef}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
};

const CubeGrid = ({ texture }) => {
  const { cubes, lines, lighting, config } = useFeatures();

  const roundedBoxGeo = new RoundedBoxGeometry(1, 1, 1, 8, config.boxBevel);

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
      envMapIntensity={1.25}
      transmission={0.9}
      backside={true}
      backsideThickness={0.2}
      thickness={0.15}
      chromaticAberration={3}
      distortion={1}
      distortionScale={1.95}
      roughness={0.2}
      emissive={lighting}
      emissiveIntensity={0.1}
    />
  );

  return (
    <>
      <Instances castShadow receiveShadow range={cubes[0].length}>
        <sphereGeometry args={[0.4, 48, 48]} />
        {standardMaterial}
        {cubes[0].map((cube, i) => (
          <Cube {...cube} />
        ))}
      </Instances>
      <Instances
        castShadow
        receiveShadow
        range={cubes[1].length}
        geometry={roundedBoxGeo}
      >
        {transmissionMaterial}
        {cubes[1].map((cube, i) => (
          <Cube {...cube} />
        ))}
      </Instances>
      <Instances castShadow receiveShadow range={cubes[2].length}>
        <sphereGeometry args={[0.4, 48, 48]} />
        {transmissionMaterial}
        {cubes[2].map((cube, i) => (
          <Cube {...cube} />
        ))}
      </Instances>
      <Instances
        castShadow
        receiveShadow
        range={cubes[3].length}
        geometry={roundedBoxGeo}
      >
        {standardMaterial}
        {cubes[3].map((cube, i) => (
          <Cube {...cube} />
        ))}
      </Instances>
      <Instances
        castShadow
        receiveShadow
        range={lines.length}
        geometry={roundedBoxGeo}
      >
        {standardMaterial}
        {lines.map((line, i) => (
          <Line {...line} />
        ))}
      </Instances>
    </>
  );
};

export default memo(CubeGrid);
