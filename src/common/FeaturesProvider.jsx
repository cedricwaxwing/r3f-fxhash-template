import { createContext, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { random_choice } from "./utils";

const themes = {
  primary: {
    background: "#fffaf0",
    colors: ["#d46118", "#fbba45", "#15736a", "#035a90", "#2a2a2a"],
  },
};

export const constants = () => {
  const choice = random_choice(Object.keys(themes));
  return {
    theme: themes[choice],
    name: choice,
  };
};

const FeaturesContext = createContext();

export default function FeaturesProvider({ children }) {
  const constantsData = constants();
  registerFeatures({
    theme: Object.keys(constantsData.theme)[0],
    shapes: random_int(15, 30),
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
