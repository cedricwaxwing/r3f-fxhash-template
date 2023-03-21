import { Instance, MeshTransmissionMaterial, Sampler } from "@react-three/drei";
import { random_choice, random_num } from "../common/utils";
import Ground from "./Ground";
import { InstancedRigidBodies, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Color } from "three";

const Tree = ({ ...props }) => {
  const treeRef = useRef();

  useEffect(() => {
    if (treeRef.current.instanceMatrix) {
      treeRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [treeRef.current]);

  const speed = 10;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    // calculate the new color based on time or other factors
    const newColor = new Color(`hsl(${(30 + t) % 360},60%,40%)`);

    treeRef.current.material.color = newColor;
  });

  return (
    <>
      <instancedMesh {...props} ref={treeRef} castShadow receiveShadow>
        <boxGeometry />
        {/* <MeshTransmissionMaterial
          emissive="hsl(30, 100%, 50%)"
          emissiveIntensity={0.3}
          thickness={2}
          distortion={5}
          distortionScale={5}
          backside
          backsideThickness={2}
          chromaticAberration={3}
        /> */}
        <meshStandardMaterial />
      </instancedMesh>
    </>
  );
};

export default function Forest() {
  const boundary = 100;
  const clearance = 0.3;

  const transformForest = ({ dummy, position }) => {
    const thickness = random_num(0.01, 0.7);
    const scaling = [thickness, random_num(70, 120), thickness];
    for (const [key, value] of Object.entries(position)) {
      if (key !== "y") {
        position[key] = value * boundary;
      } else {
        position[key] = scaling[1] * 0.3;
      }
    }
    dummy.position.copy(position);
    if (
      position.x > -clearance * (boundary / 2) &&
      position.x < clearance * (boundary / 2) &&
      position.z > -clearance * (boundary / 2) &&
      position.z < clearance * (boundary / 2)
    ) {
      dummy.position.x = random_choice([-boundary / 2, boundary / 2]);
      dummy.position.z = random_choice([-boundary / 2, boundary / 2]);
    }

    dummy.scale.setScalar(Math.random() * 0.1);
    dummy.rotation.x += Math.PI * random_num(-0.002, 0.002);
    dummy.rotation.y += Math.PI * random_num(1, 2);
    dummy.rotation.z += Math.PI * random_num(-0.002, 0.002);
    dummy.scale.x += scaling[0] * random_num(0.8, 1.2);
    dummy.scale.y += scaling[1] * random_num(0.8, 1.2);
    dummy.scale.z += scaling[2] * random_num(0.8, 1.2);
  };

  const numTrees = 1000;

  return (
    <Sampler count={numTrees} transform={transformForest}>
      <Ground castShadow receiveShadow />
      {/* <Instance>
        <boxGeometry />
        <meshStandardMaterial color={color} />
      </Instance> */}
      <Tree args={[null, null, numTrees]} />
    </Sampler>
  );
}
