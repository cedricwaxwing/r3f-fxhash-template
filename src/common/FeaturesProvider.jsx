import { createContext, memo, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { random_choice, random_num, brightness } from "./utils";
import { generateGrid } from "../Experience/Grid";

const themes = {
  Minimal: {
    background: "#828ae3",
    lighting: ["#eaecd2", "#fbf7e0"],
    hills: "#646679",
    colors: ["#f6f5f5", "#c8cbea", "#edd8f1"],
  },
};

const choice = random_choice(Object.keys(themes));
const envRotation = random_choice([-0.1, -2.4, 2.0]);
const intensity = random_num(0.5, 1);

export const constants = () => {
  const { cubes, spheres, booleans } = generateGrid(themes[choice].colors);
  const lighting = random_choice(themes[choice].lighting);
  return {
    theme: themes[choice],
    lighting: lighting,
    lightingBrightness: brightness(lighting),
    name: choice,
    cubes: cubes,
    spheres: spheres,
    booleans: booleans,
    envRotation: envRotation,
    envIntensity: intensity,
  };
};

const constantsData = constants();
const FeaturesContext = createContext();

function FeaturesProvider({ children }) {
  registerFeatures({
    theme: choice,
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
