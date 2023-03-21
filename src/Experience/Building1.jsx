import {
  Sphere,
  MeshTransmissionMaterial,
  useGLTF,
  Lightformer,
  Float,
  GradientTexture,
} from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import buildingGlb from "../assets/models/building2.glb";
import { DoubleSide } from "three";
import { useEffect, useRef, useState } from "react";
import { animated, easings, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { Depth, Fresnel, LayerMaterial, Noise } from "lamina";
import { useControls } from "leva";
import * as THREE from "three";
import { useFeatures } from "../common/FeaturesProvider";

const AnimatedFloat = animated(Float);

export default function Building1({ setPlaying, ...props }) {
  const poleRef = useRef();
  const [isInside, setInside] = useState(false);
  const { nodes, materials } = useGLTF(buildingGlb);

  const { base } = useFeatures();

  // const poleTexture = materials.Wood.map;
  // poleTexture.repeat.set(2, 20);
  // poleTexture.wrapS = THREE.RepeatWrapping;
  // poleTexture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    setPlaying(isInside);
  }, [isInside]);

  const { orbPosY } = useSpring({
    orbPosY: isInside ? 1.5 : 5.5,
    config: {
      duration: 5000,
      easing: easings.easeInOutCubic,
    },
  });

  return (
    <group {...props} dispose={null}>
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.House.geometry}
        material={materials.Floor}
        rotation={[0, Math.PI / 8, 0]}
      /> */}
      {/* <mesh scale={[0.2, 12, 0.2]} position-y={-6}>
        <cylinderGeometry />
        <meshPhysicalMaterial
          bumpMap={poleTexture}
          bumpScale={0.15}
          map={poleTexture}
          color={`hsl(${base},100%,90%)`}
          emissive={`hsl(${base},100%,30%)`}
          emissiveIntensity={0.15}
          ref={poleRef}
        />
      </mesh> */}
      <group rotation={[0, Math.PI / 8, 0]}>
        <mesh castShadow receiveShadow geometry={nodes.Circle.geometry}>
          <meshStandardMaterial
            attach="material"
            {...materials["Blue Interior - Textured"]}
            roughness={1}
            map={materials["Blue Interior - Textured"].map}
          />
        </mesh>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Circle_1.geometry}
            scale={1.01}
          >
            <meshStandardMaterial
              {...materials.Wood}
              bumpMap={materials.Wood.map}
              bumpScale={0.5}
            />
          </mesh>
        </RigidBody>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle_2.geometry}
          material={materials.Glass}
        />
        <mesh castShadow receiveShadow geometry={nodes.Circle_3.geometry}>
          <meshBasicMaterial attach="material" {...materials.Floor} />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Circle_4.geometry}>
          <LayerMaterial color="#1d3fbb">
            {/* <Depth colorA="#04103b" colorB="#254cdb" /> */}
            <Noise
              colorA="#143092"
              colorB="#4d70e9"
              colorC="#143092"
              colorD="#4d70e9"
              alpha={0.1}
              scale={50}
            />
            <Fresnel alpha={0.05} />
          </LayerMaterial>
        </mesh>
        <RigidBody type="fixed">
          <CuboidCollider
            position={[0, -1, 0]}
            rotation={[0, -Math.PI / 8, 0]}
            args={[10, 4, 10]}
            sensor
            onIntersectionEnter={() => {
              setInside(true);
            }}
            onIntersectionExit={() => {
              setInside(false);
            }}
          />
        </RigidBody>
        <animated.group position-y={orbPosY}>
          <Float>
            <Sphere args={[0.5, 16, 16]}>
              <MeshTransmissionMaterial
                roughness={0}
                thickness={0.65}
                distortion={0.3}
                distortionScale={5}
              />
            </Sphere>
            <Sphere args={[0.1, 16, 16]}>
              <meshStandardMaterial
                color="#4d70e9"
                emissive="#4d70e9"
                emissiveIntensity={2.5}
              />
            </Sphere>
          </Float>
        </animated.group>
      </group>
    </group>
  );
}
