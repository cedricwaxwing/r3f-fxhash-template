import { createContext, useContext, useMemo } from "react";
import { registerFeatures } from "../fxhash";
import { random_choice } from "./utils";
import { generateGrid } from "../Experience/GridFactory";

export const FeaturesContext = createContext(null);

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

const FeaturesProvider = ({ children }) => {
  const choice = useMemo(() => random_choice(Object.keys(themes)), []);
  const activeTime = useMemo(() => random_choice(timeOfDay), []);
  const grid = useMemo(() => generateGrid(themes[choice].colors), [choice]);

  const constantsData = useMemo(() => {
    const lighting = random_choice(themes[choice].lighting);
    return {
      name: choice,
      theme: themes[choice],
      lighting: lighting,
      grid: grid,
      envRotation: activeTime.rotation,
      envIntensity: activeTime.intensity,
      time: activeTime.time,
      timeOfDay: activeTime,
    };
  }, [grid, choice, activeTime]);

  registerFeatures({
    theme: choice,
    time: constantsData.time,
  });

  return (
    <FeaturesContext.Provider value={constantsData}>
      {children}
    </FeaturesContext.Provider>
  );
};

export const useFeatures = () => useContext(FeaturesContext);

export default FeaturesProvider;
