import React, { useEffect, useRef, useState } from "react";
import track from "../../assets/hibernation-know-v.a.mp3";
import { PositionalAudio } from "@react-three/drei";
import { useTone } from "./ToneProvider";

function Track({ isPlaying }) {
  const [ready, setReady] = useState(false);
  const positionalAudioRef = useRef();
  const synth = useRef();
  const Tone = useTone();

  useEffect(() => {
    if (isPlaying && !ready) {
      setReady(true);
    }
  }, [isPlaying]);

  // useEffect(() => {
  //   // initialize synth
  //   synth.current = new Tone.Synth().toDestination();
  //   synth.current.triggerAttack("+0.25");
  //   if (positionalAudioRef.current) {
  //     synth.current.context = positionalAudioRef.current.context;
  //     positionalAudioRef.current.setNodeSource(synth.current);
  //   }
  // }, [synth.current, positionalAudioRef.current]);

  return (
    <group position={[8.1, 16.2, 1.1]}>
      {/* <PositionalAudio
        ref={positionalAudioRef}
        url={track}
        autoplay
        loop
        distance={1}
      /> */}
      {ready && (
        <>
          <PositionalAudio
            autoplay
            loop
            url={track}
            distance={1}
            detune={-300}
            setRolloffFactor={1}
          />
        </>
      )}
    </group>
  );
}

export default React.memo(Track);
