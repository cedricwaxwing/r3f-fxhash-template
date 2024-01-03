import { Html, useProgress } from "@react-three/drei";
import { useFeatures } from "../common/FeaturesProvider";
import { useEffect, useState } from "react";

const Loader = () => {
  const { theme } = useFeatures();
  const { progress } = useProgress();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (progress > 90 && !loaded) {
      setLoaded(true);
    }
  }, [progress, loaded]);

  return (
    <Html center>
      <div className="loader">
        <div className="counter" style={{ color: theme.primary }}>
          {loaded ? 100 : progress.toFixed(0)}%
        </div>
        <div className="progressbar">
          <span
            className="progress"
            style={{
              background: theme.primary,
              width: `${loaded ? 100 : progress}%`,
            }}
          ></span>
        </div>
      </div>
    </Html>
  );
};

export default Loader;
