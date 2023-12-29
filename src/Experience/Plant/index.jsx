import PothosLeaf from "./PothosLeaf";
import { useControls } from "leva";

export default function Plant() {
  const extrusionConfig = useControls({
    steps: { value: 2.0, min: 0, max: 10 },
    depth: { value: 0.01, min: 0, max: 10 },
    bevelEnabled: false,
    // bevelThickness: { value: 0.01, min: 0, max: 10 },
    // bevelSize: { value: 0.01, min: 0, max: 10 },
    // bevelOffset: { value: 0, min: 0, max: 10 },
    // bevelSegments: { value: 2, min: 0, max: 10 },
  });

  return <PothosLeaf extrusion={extrusionConfig} />;
}
