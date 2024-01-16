import { createCube, createSphere, createBoolean } from './ObjectFactory';
import { random_int, random_num } from '../common/utils';

export const generateGrid = (colors) => {
  const columns = random_int(4, 5);
  const total = Math.pow(columns, 2);
  const grid = [];

  for (let i = 0; i < total; i++) {
    const x = Math.floor(i / columns);
    const y = i % columns;
    const seed = random_num(0, 1);

    if (seed < 0.13) {
      grid.push(createCube(x, y, colors));
    } else if (seed < 0.4) {
      grid.push(createSphere(x, y, colors));
    } else {
      grid.push(createBoolean(x, y, grid, columns, colors));
    }
  }

  return grid;
};
