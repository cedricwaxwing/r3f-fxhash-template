import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { fxpreview } from "../fxhash";
import { useFeatures } from "../common/FeaturesProvider";
import { screenRecord } from "../common/utils";

export default function CameraAnimation({ canvasRef }) {
  const { zoomRatio } = useFeatures();
  const { gl, camera } = useThree();
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const finalZoom = 48 * zoomRatio;
  const initialRadius = 28;
  const finalRadius = 32;
  const animationTime = 5;
  const finalAngle = Math.PI / 4;

  const currentZoom = useRef(finalZoom);

  const checkAnimationCompletion = (time, animationTime) => {
    if (time >= animationTime && !animationCompleted) {
      const previewFunc = fxpreview();
      previewFunc();
      // screenRecord(canvasRef);
      setAnimationCompleted(true);
    }
  };

  function cubicBezier(t) {
    let y1 = 0.1,
      y2 = 0.99;
    return (
      (1 - t) ** 3 * 0 +
      3 * (1 - t) ** 2 * t * y1 +
      3 * (1 - t) * t ** 2 * y2 +
      t ** 3 * 1
    );
  }

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      const heightScale = width / height;

      currentZoom.current = finalZoom * heightScale;
      camera.zoom = currentZoom.current;
      gl.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame(({ camera, clock }) => {
    if (animationCompleted) {
      return;
    }

    const time = clock.getElapsedTime();
    let t = Math.min(time / animationTime, 1);
    const easeOut = cubicBezier(t);
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
