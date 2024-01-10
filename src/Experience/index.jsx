import { Canvas } from "@react-three/fiber";

// import { Perf } from "r3f-perf";
import Scene from "./Scene";
import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";

function Experience() {
  const canvasRef = useRef(null);
  return (
    <div className="wrapper/">
      <Canvas
        ref={canvasRef}
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          position: [0, 0, 10],
          fov: 40,
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
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Experience;
