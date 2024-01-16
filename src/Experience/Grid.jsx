import {
  Center,
  ContactShadows,
  Cylinder,
  Instance,
  Instances,
  Resize,
} from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { random_choice, random_int, random_num } from "../common/utils";
import { memo, useEffect, useRef, useState } from "react";
import BooleanObject from "./BooleanObject";
import { useThree } from "@react-three/fiber";
import { PhysicalMaterial } from "./Materials";

let columns;

export const generateGrid = (colors) => {
  const cubes = [];
  const spheres = [];
  const booleans = [];
  columns = random_int(3, 4);

  const seeds = Array.from({ length: Math.pow(columns, 2) }, () =>
    random_num(0, 1)
  );

  for (let x = 0; x < columns; x += 1) {
    for (let y = 0; y < columns; y += 1) {
      const index = x * columns + y;
      const seed = seeds[index];
      if (seed < 0.13) {
        cubes.push({
          position: [x, y, random_num(-0.0015, 0.0015)],
          scale: 0.99,
          color: random_choice(colors),
          rotation: [
            random_num(-0.015, 0.015),
            random_num(-0.015, 0.015),
            random_num(-0.015, 0.015),
          ],
        });
      } else if (seed < 0.4) {
        spheres.push({
          position: [x, y, random_num(-0.015, 0.015)],
          scale: 0.99,
          color: random_choice(colors),
          rotation: random_num(0, Math.PI * 2),
        });
      } else {
        booleans.push({
          position: [x, y, random_num(-0.015, 0.015)],
          scale: 1,
          rotation: 0, //random_num(0, Math.PI * 2),
        });
      }
    }
  }
  return { cubes: cubes, spheres: spheres, booleans: booleans };
};

const Grid = () => {
  const { cubes, spheres, booleans } = useFeatures();
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

  booleans.forEach((boolean) => {
    boolean.sphereAbove = false;
    boolean.sphereBelow = false;
    boolean.cubeAbove = false;
    boolean.cubeBelow = false;
    boolean.booleanAbove = false;
    boolean.booleanBelow = false;
  });

  let currentBoolean;
  booleans.forEach((boolean) => {
    const setRelativePositionFlags = (objList, objType) => {
      objList.forEach((obj) => {
        if (obj.position[0] === boolean.position[0]) {
          const yDiff = obj.position[1] - boolean.position[1];

          if (yDiff === 1) boolean[`${objType}Above`] = true;
          if (
            yDiff === -1 &&
            !(
              objType === "boolean" &&
              currentBoolean.position[1] - boolean.position[1] <= 1
            )
          )
            boolean[`${objType}Below`] = true;
          currentBoolean = boolean;
        }
      });
    };

    setRelativePositionFlags(spheres, "sphere");
    setRelativePositionFlags(cubes, "cube");
    setRelativePositionFlags(
      booleans.filter((b) => b !== boolean),
      "boolean"
    );
  });

  return (
    <>
      <Resize precise scale={vMin * 0.8}>
        <Center position={0}>
          <group>
            <Instances limit={cubes.length}>
              <PhysicalMaterial />
              <boxGeometry />
              {cubes.map(({ color, ...cube }, i) => {
                return <Cube key={i} color={color} {...cube} />;
              })}
            </Instances>
            <Instances limit={spheres.length}>
              <PhysicalMaterial />
              <sphereGeometry args={[0.5, 64, 64]} />
              {spheres.map(({ color, ...sphere }, i) => {
                return <Sphere key={i} color={color} {...sphere} />;
              })}
            </Instances>
            {booleans &&
              booleans.map(
                (
                  {
                    scale,
                    position,
                    rotation,
                    sphereAbove,
                    sphereBelow,
                    cubeAbove,
                    cubeBelow,
                    booleanAbove,
                    booleanBelow,
                  },
                  i
                ) => {
                  return (
                    <BooleanObject
                      key={i}
                      position={position}
                      scale={scale}
                      rotation={rotation}
                      sphereAbove={sphereAbove}
                      sphereBelow={sphereBelow}
                      cubeAbove={cubeAbove}
                      cubeBelow={cubeBelow}
                      booleanAbove={booleanAbove}
                      booleanBelow={booleanBelow}
                      material={<PhysicalMaterial />}
                    />
                  );
                }
              )}
            {/* <group position={[columns / 2 - 0.5, -0.62, 0]}>
              <Cylinder
                receiveShadow
                args={[
                  (columns / 2) * 1.05,
                  (columns / 2) * 1.05,
                  0.25,
                  128,
                  1,
                ]}
              >
                <meshPhysicalMaterial color="#999" roughness={0.5} />
              </Cylinder>
            </group> */}
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
