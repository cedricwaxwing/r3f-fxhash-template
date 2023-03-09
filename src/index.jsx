import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as Tone from "tone";
import ToneProvider from "./Experience/Music/ToneProvider";
import FeaturesProvider, { constants } from "./common/FeaturesProvider";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <FeaturesProvider features={constants}>
      <ToneProvider Tone={Tone}>
        <App />
      </ToneProvider>
    </FeaturesProvider>
  </React.StrictMode>
);
