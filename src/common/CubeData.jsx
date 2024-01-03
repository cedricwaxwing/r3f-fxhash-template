import { random_bool, random_choice, random_num } from "./utils";

export default function CubeData(colors) {
  const height = 8;
  const depth = 4;
  const exponent = random_num(1.4, 2.4);
  const cubesVisible = random_num(0.45, 0.7);
  const cubes = [[], [], [], []];
  const lines = [];

  const precomputedX = Array.from(
    { length: depth * 2 },
    (_, i) => Math.sign(i - depth) * Math.pow(Math.abs(i - depth), exponent)
  );
  const precomputedY = Array.from(
    { length: height * 2 },
    (_, i) => Math.sign(i - height) * Math.pow(Math.abs(i - height), exponent)
  );
  const precomputedZ = Array.from(
    { length: depth * 2 },
    (_, i) => Math.sign(i - depth) * Math.pow(Math.abs(i - depth), exponent)
  );

  for (let x = -depth; x < depth; x++) {
    for (let y = -height; y < height; y++) {
      for (let z = -depth; z < depth; z++) {
        const seed = random_num(0, 1);
        const scale = random_num(0.25, 0.999);
        const adjustedX = precomputedX[x + depth];
        const adjustedY = precomputedY[y + height];
        const adjustedZ = precomputedZ[z + depth];
        const cube = {
          key: `cube-${x}-${y}-${z}`,
          color: random_choice(colors),
          position: [adjustedX, adjustedY, adjustedZ],
          scale: scale,
        };
        if (seed < (cubesVisible / 4) * 1) {
          cubes[0].push(cube);
        } else if (seed < (cubesVisible / 4) * 2) {
          cubes[1].push(cube);
        } else if (seed < (cubesVisible / 4) * 3) {
          cubes[2].push(cube);
        } else if (seed < (cubesVisible / 4) * 4) {
          cubes[3].push(cube);
        }

        if (random_bool(0.09)) {
          const lineDepth = random_num(0.01, 0.08);
          const lineScale = [lineDepth, lineDepth, random_num(0.01, height)];
          const line = {
            key: `line-${x}-${y}-${z}`,
            color: random_choice(colors),
            position: [adjustedX, adjustedY, adjustedZ],
            scale: lineScale,
            rotation: [
              random_choice([0, Math.PI / 2]),
              random_choice([0, Math.PI / 2]),
              random_choice([0, Math.PI / 2]),
            ],
          };
          lines.push(line);
        }
      }
    }
  }
  return { cubes, lines, exponent };
}
