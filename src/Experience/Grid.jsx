import {
  Center,
  Instance,
  Instances,
  Resize,
  useTexture,
} from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import {
  random_bool,
  random_choice,
  random_int,
  random_num,
} from "../common/utils";
import { useThree } from "@react-three/fiber";
import { memo, useEffect, useRef, useState } from "react";
import concrete from "../assets/textures/TCom_GenericBrickSurface_New_4K_roughness.webp";

export const generateGrid = (colors) => {
  const cubes = [];
  const spheres = [];
  const columns = random_int(2, 10);

  for (let x = 0; x < columns; x += 1) {
    for (let y = 0; y < columns; y += 1) {
      if (random_bool(0.5)) {
        cubes.push({
          position: [x, y, random_num(-0.015, 0.015)],
          scale: 0.99,
          color: random_choice(colors),
          rotation: [
            random_num(-0.015, 0.015),
            random_num(-0.015, 0.015),
            random_num(-0.015, 0.015),
          ],
        });
      } else {
        spheres.push({
          position: [x, y, random_num(-0.015, 0.015)],
          scale: 0.99,
          color: random_choice(colors),
          rotation: random_num(0, Math.PI * 2),
        });
      }
    }
  }
  return { cubes: cubes, spheres: spheres };
};

const Grid = () => {
  const { cubes, spheres } = useFeatures();
  const { width, height } = useThree((state) => state.viewport);
  const [vMin, setVmin] = useState(Math.min(width, height));
  const roughnessMap = useTexture(concrete);

  useEffect(() => {
    setVmin(Math.min(height, width));
    const handleResize = () => {
      setVmin(Math.min(height, width));
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [width, height]);

  // const cubeRoughnessMap = roughnessMap;
  // cubeRoughnessMap.repeat = { x: 0.2, y: 0.2 };

  return (
    <Resize precise scale={vMin * 0.8}>
      <Center position={0}>
        <Instances limit={cubes.length}>
          <meshPhysicalMaterial
            envMapIntensity={0.9}
            metalness={0.7}
            bumpMap={roughnessMap}
            bumpScale={0.001}
            roughnessMap={roughnessMap}
          />
          <boxGeometry />
          {cubes.map(({ color, ...cube }, i) => {
            return <Cube key={i} color={color} {...cube} />;
          })}
        </Instances>
        <Instances limit={spheres.length}>
          <meshPhysicalMaterial
            envMapIntensity={0.9}
            metalness={0.7}
            bumpMap={roughnessMap}
            bumpScale={0.001}
            roughnessMap={roughnessMap}
          />
          <sphereGeometry args={[0.5, 64, 64]} />
          {spheres.map(({ color, ...sphere }, i) => {
            return <Sphere key={i} color={color} {...sphere} />;
          })}
        </Instances>
      </Center>
    </Resize>
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
      rotation-z={rotation}
    />
  );
};

export default memo(Grid);
