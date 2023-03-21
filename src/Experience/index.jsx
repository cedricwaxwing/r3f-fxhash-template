import { memo, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  KeyboardControls,
  OrbitControls,
  PointerLockControls,
  SoftShadows,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Debug, Physics } from "@react-three/rapier";
import { Player } from "./Player";
import Forest from "./Forest";
import Post from "./Post";
import Building1 from "./Building1";
import Orbs from "./Orbs";
import Stairs from "./Stairs";
import Lighting from "./Lighting";
import Music from "./Music";

const Experience = () => {
  const [isPlaying, setPlaying] = useState(false);
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas
          id="fxhash-canvas"
          shadows
          camera={{ position: [2, 0.5, 2], fov: 50 }}
          performace={{
            min: 0.2,
          }}
          dpr={[1, 2]}
          gl={{
            preserveDrawingBuffer: true,
          }}
        >
          <Physics gravity={[0, -15, 0]}>
            <Debug />
            <Suspense fallback={null}>
              <Lighting />

              <Forest />
              <Orbs />
              {/* <Building1 position={[12, 19.5, 10]} rotation-y={Math.PI * 0.5} /> */}
              <Building1
                setPlaying={setPlaying}
                position={[8.1, 16.2, 1.1]}
                scale={1.4}
                rotation-y={Math.PI * 0.5}
              />
              <Stairs position={[0, -0.5, 0]} />
              {/* <OrbitControls /> */}
              <Player />
              <PointerLockControls />
            </Suspense>
          </Physics>
          <SoftShadows />
          <Perf position="top-left" />
          <Post />
          <Music isPlaying={isPlaying} />
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default memo(Experience);
