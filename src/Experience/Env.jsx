import { Environment, Sphere } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { blendColors } from "../common/utils";
import { useLoader } from "@react-three/fiber";
import environmentFile from "../assets/hdri/kloppenheim_06_puresky_2k.hdr";
import { BackSide } from "three";
import { useControls } from "leva";
import { RGBELoader } from "three-stdlib";

const Env = () => {
  const { theme, lighting } = useFeatures();
  const environmentTexture = useLoader(RGBELoader, environmentFile);

  const { y, intensity } = useControls({
    y: { value: 2.76, min: -Math.PI, max: Math.PI },
    intensity: { value: 0.9, min: 0.5, max: 1 },
  });

  return (
    <>
      <ambientLight intensity={0.5} color={lighting} />
      <directionalLight
        castShadow
        position={[-50, 10, 10]}
        intensity={0.5}
        shadow-mapSize={4096}
        shadow-bias={0.2}
        color={lighting}
      >
        <orthographicCamera attach="shadow-camera" args={[-21, 21, -21, 21]} />
      </directionalLight>
      <fog
        attach="fog"
        args={[blendColors(theme.background, "#9cafc0", intensity), 25, 50]}
      />
      <Environment background>
        <color attach="background" args={[theme.background]} />
        <Sphere scale={100} rotation={[0, y, 0]}>
          <meshBasicMaterial
            map={environmentTexture}
            side={BackSide}
            toneMapped={false}
            transparent
            opacity={intensity}
          />
        </Sphere>
      </Environment>
    </>
  );
};

export default Env;
