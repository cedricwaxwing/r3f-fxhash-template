import { createContext, memo, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { random_choice, brightness } from "./utils";
import { generateGrid } from "../Experience/Grid";

const themes = {
  Minimal: {
    lighting: ["#eaecd2", "#fbf7e0"],
    colors: ["#f6f5f5", "#c8cbea", "#edd8f1"],
  },
};
const timeOfDay = [
  {
    time: "morning",
    rotation: -0.1,
    background: "#af66ad",
    fog: "#bba8d4",
    hills: "#63606a",
    intensity: 0.6,
  },
  {
    time: "day",
    rotation: -2.4,
    background: "#6684a7",
    fog: "#a3a9da",
    hills: "#686f87",
    intensity: 0.95,
  },
  {
    time: "evening",
    rotation: 2,
    background: "#8149b2",
    fog: "#8d7ba6",
    hills: "#67586f",
    intensity: 0.6,
  },
];

const choice = random_choice(Object.keys(themes));
const activeTime = random_choice(timeOfDay);

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
    envRotation: activeTime.rotation,
    envIntensity: activeTime.intensity,
    time: activeTime.time,
    timeOfDay: activeTime,
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
