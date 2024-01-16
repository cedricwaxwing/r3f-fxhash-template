import { Center, Instance, Instances, Resize } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { memo, useEffect, useRef, useState } from "react";
import BooleanObject from "./BooleanObject";
import { useThree } from "@react-three/fiber";
import { PhysicalMaterial } from "./Materials";

const Grid = () => {
  const { grid } = useFeatures();
  const { width, height } = useThree((state) => state.viewport);
  const [vMin, setVmin] = useState(Math.min(width, height));

  useEffect(() => {
    setVmin(Math.min(height, width));
    const handleResize = () => {
      setVmin(Math.min(height, width));
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [width, height]);

  const cubes = grid.filter((object) => object.type === "cube");
  const spheres = grid.filter((object) => object.type === "sphere");
  const booleans = grid.filter((object) => object.type === "boolean");

  return (
    <>
      <Resize precise scale={vMin * 0.8}>
        <Center position={0}>
          <group>
            <Instances limit={cubes.length}>
              <PhysicalMaterial />
              <boxGeometry />
              {cubes.map((cube, i) => (
                <Cube key={i} {...cube} />
              ))}
            </Instances>

            <Instances limit={spheres.length}>
              <PhysicalMaterial />
              <sphereGeometry args={[0.5, 64, 64]} />
              {spheres.map((sphere, i) => (
                <Sphere key={i} {...sphere} />
              ))}
            </Instances>

            {booleans.map((boolean, i) => (
              <BooleanObject
                key={i}
                {...boolean}
                material={<PhysicalMaterial />}
              />
            ))}
          </group>
        </Center>
      </Resize>
    </>
  );
};

const Cube = ({ color, position, rotation, scale }) => {
  const cubeRef = useRef(null);

  useEffect(() => {
    cubeRef.current.color.set(color);
  });

  return (
    <Instance
      ref={cubeRef}
      castShadow
      receiveShadow
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
};

const Sphere = ({ color, position, rotation, scale }) => {
  const sphereRef = useRef(null);

  useEffect(() => {
    sphereRef.current.color.set(color);
  });

  return (
    <Instance
      ref={sphereRef}
      castShadow
      receiveShadow
      position={position}
      scale={scale}
      rotation-y={rotation}
    />
  );
};

export default memo(Grid);
