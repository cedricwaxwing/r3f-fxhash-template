import { fxrand } from "../fxhash";

export const mapValue = (n, start1, stop1, start2, stop2) => {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

// The following methods are included in artblocks creator 101 and created by Chris Doty-Humphry - Thanks Chris!
// https://docs.artblocks.io/creator-docs/creator-onboarding/readme/#safely-deriving-randomness-from-the-token-hash

// random number between a (inclusive) and b (exclusive)
export const random_num = (a, b) => {
  return a + (b - a) * fxrand();
};
// random integer between a (inclusive) and b (inclusive)
// requires a < b for proper probability distribution
export const random_int = (a, b) => {
  return Math.floor(random_num(a, b + 1));
};
// random boolean with p as percent liklihood of true
export const random_bool = (p) => {
  return fxrand() < p;
};
// random value in an array of items
export const random_choice = (list) => {
  return list[random_int(0, list.length - 1)];
};

// shuffle an array - mattedesl (https://github.com/mattdesl/tiny-artblocks/blob/main/src/util/random.js)
export const shuffleArray = (arr, seed) => {
  var rand;
  var tmp;
  var len = arr.length;
  var ret = [...arr];
  while (len) {
    rand = ~~(seed * len--);
    tmp = ret[len];
    ret[len] = ret[rand];
    ret[rand] = tmp;
  }
  return ret;
};
