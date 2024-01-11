import { Addition, Base, Geometry, Intersection } from "@react-three/csg";
import {
  mapValue,
  random_bool,
  random_choice,
  random_int,
  random_num,
} from "../common/utils";
import { useFeatures } from "../common/FeaturesProvider";
import { Material } from "./Grid";
import { Cone } from "@react-three/drei";

const positionMapping = (position) => {
  const positions = {
    "top-left": [-0.25, 0.25, 0],
    "top-right": [0.25, 0.25, 0],
    "bottom-left": [-0.25, -0.25, 0],
    "bottom-right": [0.25, -0.25, 0],
  };
  return positions[position];
};

const generateShapeConfig = (colors) => {
  let cuts = [];
  let pieces = [];

  const generatePieces = () => {
    cuts = [];
    pieces = [];

    [0, 1, 2, 3].forEach((i) => {
      const isCut = random_bool(0.5);
      if (isCut) {
        cuts.push(true);
      } else {
        cuts.push(false);
        pieces.push({
          position: ["top-left", "top-right", "bottom-left", "bottom-right"][i],
          color: random_choice(colors),
        });
      }
    });
  };

  do {
    generatePieces();
  } while (cuts.filter((cut) => cut).length === 4);

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
        <Addition scale={[0.5, 0.5, 1]} position={positionMapping("top-left")}>
          <boxGeometry />
        </Addition>
      )}
      {cutTopRight && (
        <Addition scale={[0.5, 0.5, 1]} position={positionMapping("top-right")}>
          <boxGeometry />
        </Addition>
      )}
      {cutBottomLeft && (
        <Addition
          scale={[0.5, 0.5, 1]}
          position={positionMapping("bottom-left")}
        >
          <boxGeometry />
        </Addition>
      )}
      {cutBottomRight && (
        <Addition
          scale={[0.5, 0.5, 1]}
          position={positionMapping("bottom-right")}
        >
          <boxGeometry />
        </Addition>
      )}
    </Geometry>
  );
};

const BooleanObject = ({
  scale,
  rotation,
  position,
  sphereAbove,
  sphereBelow,
  cubeAbove,
  cubeBelow,
  booleanAbove,
  booleanBelow,
}) => {
  const { theme } = useFeatures();
  const { cuts, pieces } = generateShapeConfig(theme.colors);

  const {
    cutTopLeft,
    cutTopRight,
    cutBottomLeft,
    cutBottomRight,
    rings,
    tube,
  } = {
    cutTopLeft: cuts[0],
    cutTopRight: cuts[1],
    cutBottomLeft: cuts[2],
    cutBottomRight: cuts[3],
    rings: random_int(1, 6),
    tube: random_num(0.005, 0.02),
  };

  const hasCuts = cuts.some((cut) => cut);

  const topEmpty = cuts[0] && cuts[1] && !cuts[2] && !cuts[3];
  const bottomEmpty = !cuts[0] && !cuts[1] && cuts[2] && cuts[3];

  return (
    <group position={position} scale={scale}>
      {/* Platform */}
      {(sphereAbove || booleanAbove) && !topEmpty && (
        <mesh castShadow receiveShadow position-y={0.5}>
          <cylinderGeometry args={[0.5, 0.5, 0.025, 64, 1]} />
          <Material color={random_choice(theme.colors)} />
        </mesh>
      )}
      {(sphereBelow || booleanBelow) && !bottomEmpty && (
        <mesh castShadow receiveShadow position-y={-0.5}>
          <cylinderGeometry args={[0.5, 0.5, 0.025, 64, 1]} />
          <Material color={random_choice(theme.colors)} />
        </mesh>
      )}
      <group>
        {topEmpty || bottomEmpty ? (
          <>
            <Cone
              args={[0.5, 0.5, 64]}
              position-y={topEmpty ? 0.25 : -0.25}
              rotation-x={bottomEmpty && Math.PI}
            >
              <Material color={random_choice(theme.colors)} />
            </Cone>
          </>
        ) : (
          <>
            {[...Array(rings)].map((_, i) => {
              const radius = mapValue(i + 1, 0, rings + 1, 0.05, 0.48);
              return (
                <mesh castShadow receiveShadow key={i}>
                  <torusGeometry args={[radius, tube, 16, 100]} />
                  <Material color={random_choice(theme.colors)} />
                </mesh>
              );
            })}
          </>
        )}
        {!(topEmpty || bottomEmpty) && (
          <mesh castShadow receiveShadow>
            <Material color="white" />
            <Geometry>
              <EmptyBase />
              <Addition position-x={-0.45}>
                <cylinderGeometry args={[0.01, 0.01, 1, 16, 1]} />
              </Addition>
              <Addition position-x={0.45}>
                <cylinderGeometry args={[0.01, 0.01, 1, 16, 1]} />
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
        )}
      </group>
      {/* Sphere */}
      {pieces &&
        pieces.map((piece, i) => {
          return (
            <mesh castShadow receiveShadow key={i}>
              <Geometry>
                <Base>
                  <sphereGeometry args={[0.5, 64, 64]} />
                </Base>
                <Intersection
                  scale={[0.5, 0.5, 1]}
                  position={positionMapping(piece.position)}
                >
                  <boxGeometry />
                </Intersection>
              </Geometry>
              <Material color={piece.color} />
            </mesh>
          );
        })}
    </group>
  );
};
export default BooleanObject;
