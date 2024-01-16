import { random_bool, random_choice, random_int, random_num } from '../common/utils';

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
  let cuts = {};
  let pieces = [];

  const generatePieces = () => {
    ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach((position) => {
      const isCut = random_bool(0.5);
      if (isCut) {
        cuts[position] = {
          cut: true,
          position: positionMapping(position)
        };
      } else {
        pieces.push({
          position: positionMapping(position),
          color: random_choice(colors),
          seed: random_num(0, 1),
        });
      }
    });
  };

  do {
    generatePieces();
  } while (Object.values(cuts).filter(cutInfo => cutInfo.cut).length === 4);

  return { cuts, pieces };
};


export const createCube = (x, y, colors) => {
  return {
    type: 'cube',
    position: [x, y, random_num(-0.0015, 0.0015)],
    scale: 0.99,
    color: random_choice(colors),
    rotation: [
      random_num(-0.015, 0.015),
      random_num(-0.015, 0.015),
      random_num(-0.015, 0.015),
    ],
  };
};

export const createSphere = (x, y, colors) => {
  return {
    type: 'sphere',
    position: [x, y, random_num(-0.015, 0.015)],
    scale: 0.99,
    color: random_choice(colors),
    rotation: random_num(0, Math.PI * 2),
  };
};

export const createBoolean = (x, y, grid, columns, themeColors) => {
  const index = x * columns + y;
  const { cuts, pieces } = generateShapeConfig(themeColors);

  const rings = random_int(1, 6);
  const tube = random_num(0.005, 0.015);

  const hasCuts = Object.values(cuts).some(cutInfo => cutInfo.cut);

  const topEmpty = cuts[0] && cuts[1] && !cuts[2] && !cuts[3];
  const bottomEmpty = !cuts[0] && !cuts[1] && cuts[2] && cuts[3];

  const showCone = topEmpty || bottomEmpty;

  const booleanObject = {
    type: 'boolean',
    position: [x, y, random_num(-0.015, 0.015)],
    scale: 1,
    rotation: 0,
    cuts: cuts,
    pieces: pieces,
    rings: rings,
    tube: tube,
    hasCuts: hasCuts,
    topEmpty: topEmpty,
    bottomEmpty: bottomEmpty,
    showCone: showCone,
  };

  booleanObject.sphereAbove = grid.some(o => o.type === 'sphere' && o.index === index - columns);
  booleanObject.cubeAbove = grid.some(o => o.type === 'cube' && o.index === index - columns);
  booleanObject.sphereBelow = grid.some(o => o.type === 'sphere' && o.index === index + columns);
  booleanObject.cubeBelow = grid.some(o => o.type === 'cube' && o.index === index + columns);

  return booleanObject;
};
