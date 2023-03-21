import { useTone } from "./ToneProvider";
import Track from "./Track";

export default function Music({ isPlaying }) {
  const Tone = useTone();

  if (isPlaying) {
    Tone.start();
  } else {
    Tone.Transport.stop();
  }

  return (
    <>
      <Track isPlaying={isPlaying} />
    </>
  );
}
