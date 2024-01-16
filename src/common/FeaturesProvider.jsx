import { createContext, memo, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { random_choice, random_num, brightness } from "./utils";
import { generateGrid } from "../Experience/Grid";

const themes = {
  Minimal: {
    lighting: ["#eaecd2", "#fbf7e0"],
    colors: ["#f6f5f5", "#c8cbea", "#edd8f1"],
  },
};
const timeOfDay = {
  "-0.1": {
    time: "morning",
    background: "#af66ad",
    fog: "#bba8d4",
    hills: "#63606a",
    intensity: 0.6,
  },
  "-2.4": {
    time: "day",
    background: "#6684a7",
    fog: "#a3a9da",
    hills: "#686f87",
    intensity: 0.95,
  },
  2: {
    time: "evening",
    background: "#8149b2",
    fog: "#8d7ba6",
    hills: "#67586f",
    intensity: 0.6,
  },
};

const choice = random_choice(Object.keys(themes));
const envRotation = random_choice([-0.1, -2.4, 2.0]);

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
    envIntensity: timeOfDay[envRotation].intensity,
    time: timeOfDay[envRotation].time,
    timeOfDay: timeOfDay,
  };
};

const constantsData = constants();
const FeaturesContext = createContext();

function FeaturesProvider({ children }) {
  registerFeatures({
    theme: choice,
    time: constantsData.time,
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
