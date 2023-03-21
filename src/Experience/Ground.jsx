import { useMemo, useRef } from "react";
import { SimplexNoise } from "three-stdlib";
import { RigidBody } from "@react-three/rapier";
import { useTexture } from "@react-three/drei";
import groundColorFile from "../assets/textures/ground/ground-color.jpg";
import groundNormalFile from "../assets/textures/ground/ground-normal.jpg";
import groundRoughnessFile from "../assets/textures/ground/ground-roughness.jpg";
import groundHeightFile from "../assets/textures/ground/ground-height.jpg";
import * as THREE from "three";
import { Float32BufferAttribute, PlaneGeometry } from "three";
import { useFrame } from "@react-three/fiber";

export default function Ground({
  width = 100,
  height = 0.4,
  depth = 100,
  ...props
}) {
  const groundRef = useRef();
  const groundColor = useTexture(groundColorFile);
  const groundRoughness = useTexture(groundRoughnessFile);
  const groundNormal = useTexture(groundNormalFile);
  const groundHeight = useTexture(groundHeightFile);

  // const { palette } = useFeatures();

  groundColor.repeat.set(20, 20);
  groundColor.wrapS = THREE.RepeatWrapping;
  groundColor.wrapT = THREE.RepeatWrapping;
  groundRoughness.repeat.set(20, 20);
  groundRoughness.wrapS = THREE.RepeatWrapping;
  groundRoughness.wrapT = THREE.RepeatWrapping;
  groundNormal.repeat.set(20, 20);
  groundNormal.wrapS = THREE.RepeatWrapping;
  groundNormal.wrapT = THREE.RepeatWrapping;
  groundHeight.repeat.set(20, 20);
  groundHeight.wrapS = THREE.RepeatWrapping;
  groundHeight.wrapT = THREE.RepeatWrapping;

  const simplex = new SimplexNoise();
  const factor = 0.008;
  const plateauSize = 0.3;

  // generate a grid of vertices
  const positions = useMemo(() => {
    const positions = [];
    for (let z = -depth / 2; z <= depth / 2; z++) {
      for (let x = -width / 2; x <= width / 2; x++) {
        const noise1 = simplex.noise3d(x * factor, z * factor, 0) * 10;
        const noise2 = simplex.noise3d(x * factor * 5, z * factor * 5, 1) * 2;
        const noise3 =
          simplex.noise3d(x * factor * 20, z * factor * 20, 0) * 1.2;
        // let y;
        // if (
        //   x > width * -plateauSize &&
        //   x < width * plateauSize &&
        //   z > depth * -plateauSize &&
        //   z < depth * plateauSize
        // ) {
        //   y = height;
        // } else {
        //   y = (noise1 + noise2 + noise3) * height;
        // }
        const y = (noise1 + noise2 + noise3) * height;
        positions.push(x, y, z);
      }
    }
    return positions;
  }, [width, height, depth]);

  // create a plane buffer geometry
  const geometry = useMemo(() => {
    const geometry = new PlaneGeometry(width, depth, width, depth);
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [width, height, depth, positions]);

  return (
    <>
      <RigidBody {...props} type="fixed" colliders="trimesh">
        <mesh geometry={geometry} castShadow receiveShadow ref={groundRef}>
          {/* <meshStandardMaterial
            map={groundColor}
            roughnessMap={groundRoughness}
            normalMap={groundNormal}
            displacementMap={groundHeight}
            displacementScale={0.15}
          /> */}
          <meshPhongMaterial color="white" />
        </mesh>
      </RigidBody>
      {/* <RigidBody type="fixed">
        <mesh scale={[50, 0.1, 50]} castShadow receiveShadow position-y={0.45}>
          <boxGeometry />
          <meshStandardMaterial
            map={groundColor}
            roughnessMap={groundRoughness}
            normalMap={groundNormal}
            displacementMap={groundHeight}
            displacementScale={0.15}
          />
        </mesh>
      </RigidBody> */}
    </>
  );
}
