import HopLeaf from "./HopLeaf";
import { random_num } from "../../common/utils";

export default function Plant({ texture }) {
  const hopLeaves = [];

  {
    [...Array(90)].map(() => {
      const leaf = {
        position: [random_num(-6, 6), random_num(-10, 10), random_num(-6, 6)],
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
        return <HopLeaf key={i} texture={texture} {...leaf} />;
      })}
    </>
  );
}
