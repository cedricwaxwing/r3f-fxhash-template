import HopLeaf from "./HopLeaf";
import { random_num } from "../../common/utils";

export default function Plant() {
  const hopLeaves = [];

  {
    [...Array(60)].map((_, i) => {
      const leaf = {
        position: [random_num(-7, 7), random_num(-3, 3), random_num(-7, 3)],
        scale: random_num(0.1, 0.5),
        rotation: [
          random_num(-Math.PI * 2, Math.PI * 2),
          random_num(-Math.PI * 2, Math.PI * 2),
          random_num(-Math.PI * 2, Math.PI * 2),
        ],
      };
      hopLeaves.push(leaf);
    });
  }

  return (
    <>
      {hopLeaves.map((leaf, i) => {
        return <HopLeaf key={i} {...leaf} />;
      })}
    </>
  );
}
