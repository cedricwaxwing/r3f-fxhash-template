import * as THREE from "three";
import { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
import { Water } from "three-stdlib";
import waterNormalsTexture from "../assets/textures/waternormals.jpg";

extend({ Water });

function Ocean({
  position,
  sunColor = 0xffffff,
  waterColor = 0x001e0f,
  fog = false,
  distortionScale = 3.7,
}) {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, waterNormalsTexture);
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.CircleGeometry(30, 30), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: sunColor,
      waterColor: waterColor,
      distortionScale: distortionScale,
      fog: fog,
      format: gl.encoding,
    }),
    [waterNormals, gl, sunColor, waterColor, fog, distortionScale]
  );
  useFrame(
    (state, delta) => (ref.current.material.uniforms.time.value += delta * 0.2)
  );
  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={position}
    />
  );
}

export default Ocean;
