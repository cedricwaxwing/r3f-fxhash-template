import { createContext, useContext } from "react";
import { registerFeatures } from "../fxhash";
import { random_num } from "./utils";

// DEFINE BASE CONSTANTS
const BASE_HUE = random_num(180, 400) % 360;

const PALETTE = {
  base: BASE_HUE,
  bg: `hsl(${BASE_HUE}, 50%, 20%)`,
  primary: `hsl(${BASE_HUE}, 80%, 50%)`,
};

export const constants = {
  palette: PALETTE,
};

const FeaturesContext = createContext();

export default function FeaturesProvider({ children }) {
  // REGISTER TOKEN FEATURES
  registerFeatures({
    primary: PALETTE.primary.name,
  });

  return (
    <FeaturesContext.Provider value={constants}>
      {children}
    </FeaturesContext.Provider>
  );
}

export const useFeatures = () => {
  const features = useContext(FeaturesContext);
  return features;
};
