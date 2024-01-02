import { createContext, useContext } from "react";
import * as Tone from "tone";

const ToneContext = createContext();

export default function ToneProvider({ children }) {
  Tone.start();
  return <ToneContext.Provider value={Tone}>{children}</ToneContext.Provider>;
}

export const useTone = () => {
  const Tone = useContext(ToneContext);
  return Tone;
};
