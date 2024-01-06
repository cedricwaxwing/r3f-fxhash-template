import { createContext, memo, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { mapValue, random_choice, random_num, brightness } from "./utils";
import CubeData from "./CubeData";

const themes = {
  Tropicana: {
    background: ["#cefbe9", "#9cece4"],
    primary: "#6a1c6a",
    lighting: ["#f9ac90", "#fb8545"],
    colors: ["#d55222", "#fbba45", "#20c8b7", "#2aa0e9", "#a435a4"],
  },
  "Cherry Blossom": {
    background: ["#f2caca", "#a9656a"],
    primary: "#a90d2c",
    lighting: ["#e39494", "#977185"],
    colors: ["#FF6B6B", "#ffd900", "#FFA07A", "#d45fbb", "#DC143C"],
  },
  "Mystic Forest": {
    background: ["#401a37", "#1c121a"],
    primary: "#93e4a2",
    lighting: ["#cd65c2", "#d7b149"],
    colors: ["#3c5e4d", "#71bb7f", "#cd65c2", "#4054ad", "#d7b149"],
  },
  "Autumn Hike": {
    background: ["#dcaf77", "#d29163"],
    primary: "#8f4421",
    lighting: ["#FF6347", "#A0522D"],
    colors: ["#906731", "#eec53e", "#c8debd", "#FF6347", "#A0522D"],
  },
  "Celestial Spectrum": {
    background: ["#2c3e50", "#202a34"],
    primary: "#3498db",
    lighting: ["#f1c40f", "#e67e22"],
    colors: ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#e67e22"],
  },
  "Floral Delicacy": {
    background: ["#413732", "#352d29"],
    primary: "#9b5672",
    lighting: ["#d3aa87", "#ffa952", "#f38169"],
    colors: ["#f38169", "#74c5bf", "#d3aa87", "#ffa952", "#9b5672"],
  },
  "Strawberry Theif": {
    background: ["#363131", "#1b1717"],
    primary: "#db994d",
    lighting: ["#db994d", "#fc6141", "#fcceaa"],
    colors: ["#db994d", "#fc6141", "#9ca4bd", "#fcceaa", "#8db579"],
  },
};

let setup;
const choice = random_choice(Object.keys(themes));

export const constants = () => {
  setup = CubeData(themes[choice].colors);
  const lighting = random_choice(themes[choice].lighting);
  return {
    theme: themes[choice],
    lighting: lighting,
    lightingBrightness: brightness(lighting),
    name: choice,
    cubes: setup.cubes,
    lines: setup.lines,
    zoomRatio: random_num(1, 3.5),
    config: {
      exponent: setup.exponent,
      boxBevel: random_num(0.05, 0.15),
    },
    recording: false,
  };
};

const constantsData = constants();
const spacingSizes = ["tight", "normal", "loose"];
const densities = ["loose", "normal", "packed"];
const numGeos =
  setup.cubes.reduce((total, cube) => total + cube.length, 0) +
  setup.lines.length;
const FeaturesContext = createContext();

function FeaturesProvider({ children }) {
  registerFeatures({
    theme: choice,
    zoom: constantsData.zoomRatio,
    spacing:
      spacingSizes[
        Math.round(
          mapValue(
            constantsData.config.exponent,
            1.4,
            2.4,
            0,
            spacingSizes.length
          )
        )
      ],
    "Geometry Density":
      densities[Math.round(mapValue(numGeos, 400, 1024, 0, densities.length))],
  });

  return (
    <FeaturesContext.Provider value={constantsData}>
      {children}
    </FeaturesContext.Provider>
  );
}

export default memo(FeaturesProvider);

export const useFeatures = () => {
  const features = useContext(FeaturesContext);
  return features;
};
