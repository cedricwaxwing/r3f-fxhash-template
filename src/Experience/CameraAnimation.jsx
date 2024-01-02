import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { fxpreview } from "../fxhash";

export default function CameraAnimation() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const checkAnimationCompletion = (time, animationTime, camera) => {
    if (time >= animationTime && !animationCompleted) {
      setAnimationCompleted(true);
      fxpreview();
    }
  };

  useFrame(({ camera, clock }) => {
    if (animationCompleted) return;

    const initialRadius = 28;
    const finalZoom = 40;
    const finalRadius = 32;
    const animationTime = 7;
    const time = clock.getElapsedTime();

    let t = time / animationTime;
    t = Math.min(t, 1);

    const easeOut = 1 - Math.pow(1 - t, 3);
    const easedZoom = initialRadius + (finalZoom - initialRadius) * easeOut;

    // Final angle (45 degrees in radians)
    const finalAngle = Math.PI / 4;
    const totalRotation = easeOut * finalAngle;

    if (t <= 1) {
      camera.zoom = easedZoom;
      camera.position.x = Math.sin(totalRotation) * finalRadius;
      camera.position.z = Math.cos(totalRotation) * finalRadius;

      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }

    checkAnimationCompletion(time, animationTime, camera);
  });

  return <OrbitControls enabled={animationCompleted} />;
}
