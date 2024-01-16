import { Addition, Base, Geometry, Intersection } from "@react-three/csg";
import { mapValue, random_choice } from "../common/utils";
import { useFeatures } from "../common/FeaturesProvider";
import { Cone } from "@react-three/drei";
import {
  MetalMaterial,
  PhysicalMaterial,
  TransmissiveMaterial,
  TubeMaterial,
} from "./Materials";

const EmptyBase = () => {
  return (
    <Base scale={[0.000001, 0.000001, 1]} castShadow receiveShadow>
      <boxGeometry />
    </Base>
  );
};

const Cut = ({ cuts }) => {
  return (
    <Geometry>
      <EmptyBase />
      {Object.entries(cuts).map(
        ([position, { cut, position: cutPosition }]) =>
          cut && (
            <Addition
              key={position}
              castShadow
              receiveShadow
              scale={[0.5, 0.5, 1]}
              position={cutPosition}
            >
              <boxGeometry />
            </Addition>
          )
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
  cuts = {},
  pieces,
  rings,
  tube,
  hasCuts,
  topEmpty,
  bottomEmpty,
  showCone,
}) => {
  const { theme } = useFeatures();

  return (
    <group position={position} scale={scale}>
      {/* Platform */}
      {(sphereAbove || booleanAbove) && !topEmpty && (
        <mesh castShadow receiveShadow position-y={0.5}>
          <cylinderGeometry args={[0.5, 0.5, 0.025, 64, 1]} />
          <PhysicalMaterial color={random_choice(theme.colors)} />
        </mesh>
      )}
      {(sphereBelow || booleanBelow) && !bottomEmpty && (
        <mesh castShadow receiveShadow position-y={-0.5}>
          <cylinderGeometry args={[0.5, 0.5, 0.025, 64, 1]} />
          <PhysicalMaterial color={random_choice(theme.colors)} />
        </mesh>
      )}
      <group>
        {showCone ? (
          <>
            <Cone
              args={[0.5, 0.5, 64]}
              position-y={topEmpty ? 0.25 : -0.25}
              rotation-x={bottomEmpty && Math.PI}
              castShadow
              receiveShadow
            >
              <PhysicalMaterial color={random_choice(theme.colors)} />
            </Cone>
          </>
        ) : (
          <>
            {[...Array(rings)].map((_, i) => {
              const radius = mapValue(i + 1, 0, rings + 1, 0.05, 0.48);
              return (
                <mesh castShadow receiveShadow key={i}>
                  <torusGeometry args={[radius, tube, 16, 100]} />
                  <TubeMaterial color={random_choice(theme.colors)} />
                </mesh>
              );
            })}
          </>
        )}
        {!showCone && (
          <mesh castShadow receiveShadow>
            <TubeMaterial color="white" />
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
                  <Cut cuts={cuts} />
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
                <Intersection position={piece.position}>
                  <boxGeometry args={[piece.scale / 2, piece.scale / 2, 1]} />
                </Intersection>
              </Geometry>
              {piece.seed < 0.2 ? (
                <TransmissiveMaterial />
              ) : piece.seed < 0.21 ? (
                <MetalMaterial color={piece.color} />
              ) : (
                <PhysicalMaterial color={piece.color} />
              )}
            </mesh>
          );
        })}
    </group>
  );
};
export default BooleanObject;
