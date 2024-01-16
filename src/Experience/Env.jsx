import {
  Environment,
  Sphere,
  ContactShadows,
  SoftShadows,
} from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { useLoader } from "@react-three/fiber";
import environmentFile from "../assets/hdri/kloppenheim_06_puresky_2k.hdr";
import { BackSide } from "three";
import { RGBELoader } from "three-stdlib";
import { useMemo } from "react";

const Env = ({ groundY }) => {
  const { timeOfDay, lighting, envRotation, envIntensity } = useFeatures();
  const environmentTexture = useLoader(RGBELoader, environmentFile);

  const position = useMemo(() => {
    const radius = 10000;
    const sunOffset = -0.1;

    // Calculate x and z
    const x = radius * Math.cos(-envRotation + sunOffset);
    const z = radius * Math.sin(-envRotation + sunOffset);

    const minY = 8;
    const maxY = 7000;

    const minRotation = -0.1;
    const maxRotation = -2.35;

    let normalizedRotation =
      (envRotation - minRotation) / (maxRotation - minRotation);

    normalizedRotation = Math.max(0, Math.min(normalizedRotation, 1));

    const y = minY + normalizedRotation * (maxY - minY);

    return [x, y, z];
  }, [envRotation]);

  return (
    <>
      <directionalLight
        castShadow
        position={position}
        intensity={1.5}
        shadow-mapSize={4096}
        shadow-bias={0.2}
        color={lighting}
      >
        <orthographicCamera attach="shadow-camera" args={[-21, 21, -21, 21]} />
      </directionalLight>
      <Environment background blur={0.06} resolution={4096}>
        <color attach="background" args={[timeOfDay.background]} />
        <Sphere scale={100} rotation={[0, envRotation, 0]}>
          <meshBasicMaterial
            map={environmentTexture}
            side={BackSide}
            toneMapped={false}
            transparent
            opacity={envIntensity * 0.7}
          />
        </Sphere>
      </Environment>
      <SoftShadows size={25} focus={0.01} samples={10} />
      <ContactShadows
        position={[0, groundY + 0.001, 0]}
        frames={2}
        ambient={0.2}
        radius={10}
        amount={4}
        opacity={0.5}
        scale={10}
        blur={2}
        far={10}
        resolution={128}
        color="#000"
      />
    </>
  );
};

export default Env;
