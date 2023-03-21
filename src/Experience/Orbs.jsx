import {
  Instance,
  Instances,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { random_int, random_num } from "../common/utils";

const particles = Array.from({ length: 450 }, () => ({
  factor: random_int(20, 100),
  speed: random_num(0.01, 1),
  xFactor: random_num(-40, 40),
  yFactor: random_num(-20, 40),
  zFactor: random_num(-40, 40),
}));

export default function Orbs() {
  return (
    <Instances
      limit={particles.length}
      // ref={ref}
      castShadow
      receiveShadow
      position={[0, 10, 0]}
    >
      <sphereGeometry args={[1, 16, 16]} />
      {/* <MeshTransmissionMaterial
        roughness={0.2}
        thickness={0.4}
        ior={1.3}
        chromaticAberration={100}
        distortion={0.7}
        distortionScale={2}
        transmission={1.5}
        emissiveIntensity={0.25}
        emissive={"#f0f0f0"}
        reflectivity={0.2}
      /> */}
      <meshStandardMaterial color="#f0f0f0" />
      {particles.map((data, i) => (
        <Orb key={i} {...data} />
      ))}
    </Instances>
  );
}

function Orb({ factor, speed, xFactor, yFactor, zFactor }) {
  const ref = useRef();
  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed * 0.015);
    ref.current.scale.setScalar(Math.max(0.05, Math.cos(t) * 0.5));
    ref.current.position.set(
      Math.cos(t) +
        Math.sin(t * 1) / 10 +
        xFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 1) * factor) / 10,
      Math.sin(t) +
        Math.cos(t * 2) / 10 +
        yFactor +
        Math.sin((t / 10) * factor) +
        (Math.cos(t * 2) * factor) / 10,
      Math.sin(t) +
        Math.cos(t * 2) / 10 +
        zFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 3) * factor) / 10
    );
  });
  return <Instance ref={ref} />;
}
