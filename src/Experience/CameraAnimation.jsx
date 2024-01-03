import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { fxpreview } from "../fxhash";

const finalZoom = 40;
const initialRadius = 28;
const finalRadius = 32;
const animationTime = 7;
const finalAngle = Math.PI / 4;
const baseHeight = 1733 / 2;

export default function CameraAnimation() {
  const { size } = useThree();
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const currentZoom = useRef(finalZoom);

  const checkAnimationCompletion = (time, animationTime) => {
    if (time >= animationTime && !animationCompleted) {
      setAnimationCompleted(true);
      fxpreview();
    }
  };

  useFrame(({ camera, clock }) => {
    const heightScale = size.height / baseHeight;
    currentZoom.current = finalZoom * heightScale;

    if (animationCompleted) {
      camera.zoom = currentZoom.current;
      camera.updateProjectionMatrix();
      return;
    }

    const time = clock.getElapsedTime();
    let t = Math.min(time / animationTime, 1);
    const easeOut = 1 - Math.pow(1 - t, 3);
    const easedZoom =
      initialRadius + (currentZoom.current - initialRadius) * easeOut;
    const totalRotation = easeOut * finalAngle;

    camera.zoom = easedZoom;
    camera.position.x = Math.sin(totalRotation) * finalRadius;
    camera.position.z = Math.cos(totalRotation) * finalRadius;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    checkAnimationCompletion(time, animationTime);
  });

  return <OrbitControls enabled={animationCompleted} />;
}
