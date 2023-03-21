import { Sky, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useFeatures } from "../common/FeaturesProvider";

export default function Lighting() {
  const lightRef = useRef();

  const { palette } = useFeatures();

  // useFrame(({ clock }) => {
  //   const t = clock.elapsedTime * 0.001;

  //   lightRef.current.position.z = 100 + Math.sin(t) * 100;
  //   lightRef.current.position.y = 100 + Math.cos(t) * 100;

  //   console.log(lightRef.current.position);
  // });

  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 5, 50]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={lightRef}
        position={[100, 200, 110]}
        castShadow
        intensity={5.8}
        color={`hsl(30, 40%, 50%)`}
        shadow-mapSize={2048}
        shadow-bias={-0.001}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-75, 75, 45, -45, 0.5, 500]}
        />
      </directionalLight>
    </>
  );
}
