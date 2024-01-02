import React from "react";
import { Html, useProgress } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";

const Loader = () => {
  const { theme } = useFeatures();
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="loader">
        <div class="counter" style={{ color: theme.primary }}>
          {progress.toFixed(0)}%
        </div>
        <div class="progressbar">
          <span
            class="progress"
            style={{ background: theme.primary, width: `${progress}%` }}
          ></span>
        </div>
      </div>
    </Html>
  );
};

export default Loader;
