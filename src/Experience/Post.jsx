import { memo } from "react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  SSAO,
} from "@react-three/postprocessing";

const Post = () => {
  return (
    <>
      <EffectComposer>
        <Noise opacity={0.09} />
        <DepthOfField focalLength={0.02} focusDistance={0} bokehScale={1} />
        {/* <SSAO
          samples={31}
          radius={0.1}
          intensity={30}
          luminanceInfluence={0.1}
          color="blue"
        /> */}
        {/* <Bloom intensity={0.9} luminanceThreshold={0.5} /> */}
      </EffectComposer>
    </>
  );
};

export default memo(Post);
