import { createContext, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { random_choice, random_int } from "./utils";

const themes = {
  // primary: {
  //   background: "#fffaf0",
  //   colors: ["#d46118", "#fbba45", "#15736a", "#035a90", "#2a2a2a"],
  // },
  darkPalette: {
    background: "#2c3e50",
    colors: ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#e67e22"],
  },
  floralDelicacy: {
    background: "#413732",
    colors: ["#f38169", "#74c5bf", "#d3aa87", "#ffa952", "#9b5672"],
  },
  strawberryTheif: {
    background: "#292323",
    colors: ["#db994d", "#fc6141", "#9ca4bd", "#fcceaa", "#8db579"],
  },
  // oceanBreeze: {
  //   background: "#97cbe0",
  //   colors: ["#5b3c72", "#009496", "#1f3175", "#1E90FF", "#215521"],
  // },
  // sunsetSerenity: {
  //   background: "#fcf4d6",
  //   colors: ["#FF6B6B", "#d3b301", "#FFA07A", "#FF8C00", "#DC143C"],
  // },
  // mysticForest: {
  //   background: "#354F52",
  //   colors: ["#5D737E", "#6A9171", "#ABCEA3", "#5d74dc", "#FFD151"],
  // },
  // desertMirage: {
  //   background: "#FFE4C4",
  //   colors: ["#91744e", "#CD853F", "#F0E68C", "#FF6347", "#A0522D"],
  // },
};

export const constants = () => {
  const choice = random_choice(Object.keys(themes));
  return {
    theme: themes[choice],
    name: choice,
    num_shapes: random_int(8, 14),
  };
};

const FeaturesContext = createContext();

export default function FeaturesProvider({ children }) {
  const constantsData = constants();
  registerFeatures({
    theme: Object.keys(constantsData.theme)[0],
  });

  return (
    <FeaturesContext.Provider value={constantsData}>
      {children}
    </FeaturesContext.Provider>
  );
}

export const useFeatures = () => {
  const features = useContext(FeaturesContext);
  return features;
};
