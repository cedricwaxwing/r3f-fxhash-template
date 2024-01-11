import { createContext, memo, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { random_choice, brightness } from "./utils";
import { generateGrid } from "../Experience/Grid";

const themes = {
  "Celestial Spectrum": {
    background: ["#d2dfec", "#b8d2ed"],
    primary: "#3498db",
    lighting: ["#eaecd2", "#fbf7e0"],
    colors: ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#e67e22"],
  },
};

const choice = random_choice(Object.keys(themes));

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
