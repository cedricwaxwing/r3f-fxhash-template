import { Canvas } from "@react-three/fiber";

import { Perf } from "r3f-perf";
import Scene from "./Scene";
import { useRef } from "react";

function Experience() {
  const canvasRef = useRef(null);
  return (
    <div className="wrapper/">
      <Canvas
        ref={canvasRef}
        shadows
        orthographic
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          position: [32, 32, 32],
          left: -100,
          right: 100,
          top: 100,
          bottom: -100,
          near: 0.1,
          far: 100,
          zoom: 48,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Scene canvasRef={canvasRef} />
        {/* {process.env.NODE_ENV === "development" && <Perf />} */}
      </Canvas>
    </div>
  );
}

export default Experience;
