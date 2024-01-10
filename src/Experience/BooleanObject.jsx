import {
  Addition,
  Base,
  Difference,
  Geometry,
  Intersection,
  Subtraction,
} from "@react-three/csg";
import concrete from "../assets/textures/TCom_GenericBrickSurface_New_4K_roughness.webp";
import { Cylinder, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import {
  mapValue,
  random_bool,
  random_choice,
  random_int,
  random_num,
} from "../common/utils";
import { useFeatures } from "../common/FeaturesProvider";

const generateShapeConfig = (colors) => {
  const cuts = [];
  const pieces = [];
  const generateCuts = () => {
    [0, 1, 2, 3].forEach((i) => {
      cuts.push(random_bool(0.5));
    });
  };
  const generatePieces = () => {
    pieces.push(cuts.filter((cut) => !cut));
    pieces.forEach((piece) => {
      piece.color = random_choice(colors);
    });
  };
  generateCuts();
  generatePieces();
  return { cuts: cuts, pieces: pieces };
};

const EmptyBase = () => {
  return (
    <Base scale={[0.000001, 0.000001, 1]}>
      <boxGeometry />
    </Base>
  );
};

const Cut = ({ cutTopLeft, cutTopRight, cutBottomLeft, cutBottomRight }) => {
  return (
    <Geometry>
      <EmptyBase />
      {cutTopLeft && (
        <Addition scale={[0.5, 0.5, 1]} position={[-0.25, 0.25, 0]}>
          <boxGeometry />
        </Addition>
      )}
      {cutTopRight && (
        <Addition scale={[0.5, 0.5, 1]} position={[0.25, 0.25, 0]}>
          <boxGeometry />
        </Addition>
      )}
      {cutBottomLeft && (
        <Addition scale={[0.5, 0.5, 1]} position={[-0.25, -0.25, 0]}>
          <boxGeometry />
        </Addition>
      )}
      {cutBottomRight && (
        <Addition scale={[0.5, 0.5, 1]} position={[0.25, -0.25, 0]}>
          <boxGeometry />
        </Addition>
      )}
    </Geometry>
  );
};

const BooleanObject = ({ color }) => {
  const { theme } = useFeatures();
  const roughnessMap = useTexture(concrete);
  const { cuts, pieces } = generateShapeConfig(theme.colors);

  const {
    cutTopLeft,
    cutTopRight,
    cutBottomLeft,
    cutBottomRight,
    rings,
    tube,
  } = useControls({
    cutTopLeft: { value: cuts[0] },
    cutTopRight: { value: cuts[1] },
    cutBottomLeft: { value: cuts[2] },
    cutBottomRight: { value: cuts[3] },
    rings: { value: random_int(1, 6) },
    tube: { value: random_num(0.005, 0.02) },
  });

  const hasCuts = [cutTopLeft, cutTopRight, cutBottomLeft, cutBottomRight].some(
    (cut) => cut
  );

  return (
    <group scale={3}>
      {/* Rings */}
      <group>
        {[...Array(rings)].map((_, i) => {
          const radius = mapValue(i + 1, 0, rings + 1, 0.05, 0.48);
          return (
            <mesh key={i}>
              <torusGeometry args={[radius, tube, 16, 100]} />
              <meshPhysicalMaterial
                color={random_choice(theme.colors)}
                envMapIntensity={0.9}
                metalness={1}
                bumpMap={roughnessMap}
                bumpScale={0.9}
                roughnessMap={roughnessMap}
                roughness={0.6}
              />
            </mesh>
          );
        })}
        <mesh>
          <meshPhysicalMaterial
            envMapIntensity={0.9}
            metalness={1}
            bumpMap={roughnessMap}
            bumpScale={0.9}
            roughnessMap={roughnessMap}
            roughness={0.6}
          />
          <Geometry>
            <EmptyBase />
            <Addition position-x={-0.45}>
              <cylinderGeometry args={[tube, tube, 1, 16, 1]} />
            </Addition>
            <Addition position-x={0.45}>
              <cylinderGeometry args={[tube, tube, 1, 16, 1]} />
            </Addition>
            {hasCuts && (
              <Intersection>
                <Cut
                  cutTopLeft={cutTopLeft}
                  cutTopRight={cutTopRight}
                  cutBottomLeft={cutBottomLeft}
                  cutBottomRight={cutBottomRight}
                />
              </Intersection>
            )}
          </Geometry>
        </mesh>
      </group>
      {/* Sphere */}
      <mesh>
        <Geometry>
          <Base>
            <sphereGeometry args={[0.5, 256, 256]} />
          </Base>
          {hasCuts && (
            <Subtraction>
              <Cut
                cutTopLeft={cutTopLeft}
                cutTopRight={cutTopRight}
                cutBottomLeft={cutBottomLeft}
                cutBottomRight={cutBottomRight}
              />
            </Subtraction>
          )}
        </Geometry>
        <meshPhysicalMaterial
          color={color}
          envMapIntensity={0.9}
          metalness={0.7}
          bumpMap={roughnessMap}
          bumpScale={0.9}
          roughnessMap={roughnessMap}
        />
      </mesh>
    </group>
  );
};
export default BooleanObject;
