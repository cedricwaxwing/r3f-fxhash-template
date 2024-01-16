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

export const brightness = (hexColor) => {
  const color = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return brightness;
};

export const screenRecord = (canvasRef, name) => {
  if (!canvasRef.current) {
    console.error("Canvas reference is not available");
    return;
  }

  const link = document.createElement("a");
  link.setAttribute(
    "download",
    `avante-garden-${name.toLowerCase().replaceAll(" ", "-")}-${
      window.$fx.hash
    }.png`
  );
  link.setAttribute(
    "href",
    document
      .querySelector("canvas")
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
  );
  link.click();
};

export const getNoiseColors = (colors) => {
  const shuffledColors = shuffleArray(colors, fxrand());
  return {
    colorA: shuffledColors[0],
    colorB: shuffledColors[1],
    colorC: shuffledColors[2],
    colorD: shuffledColors[3],
  };
};

export function blendColors(color1, color2, blendFactor = 0.5) {
  const color1RGB = hexToRGB(color1);
  const color2RGB = hexToRGB(color2);

  const blendedRGB = {
    r: Math.round(mix(color1RGB.r, color2RGB.r, blendFactor)),
    g: Math.round(mix(color1RGB.g, color2RGB.g, blendFactor)),
    b: Math.round(mix(color1RGB.b, color2RGB.b, blendFactor)),
  };

  return rgbToHex(blendedRGB.r, blendedRGB.g, blendedRGB.b);
}

function hexToRGB(hex) {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  return { r, g, b };
}

function mix(value1, value2, factor) {
  return value1 * (1 - factor) + value2 * factor;
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
