import { useMemo } from "react";
import CustomShape from "./CustomShape";
import { useThree } from "@react-three/fiber";
import { random_num } from "../common/utils";

const snapAngle = (value, snapTo) => Math.round(value / snapTo) * snapTo;

const CustomShapes = () => {
  const { viewport } = useThree();

  const data = useMemo(() => {
    return [...Array(20)].map(() => {
      return {
        position: [
          random_num(-viewport.width / 2, viewport.width / 2),
          random_num(-viewport.height / 2, viewport.height / 2),
          random_num(-0.5, 0.5),
        ],
        scale: random_num(0.5, 1.5),
        rotation: [
          snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
          snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
          snapAngle(random_num(-Math.PI * 2, Math.PI * 2), Math.PI / 4),
        ],
      };
    });
  }, [viewport.width, viewport.height]);

  return (
    <>
      {data.map((shapeData, index) => (
        <CustomShape key={index} data={shapeData} />
      ))}
    </>
  );
};

export default CustomShapes;
