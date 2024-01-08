import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { fxpreview } from "../fxhash";
import { useFeatures } from "../common/FeaturesProvider";

export default function CameraAnimation({ canvasRef }) {
  const [heightScale, setHeightScale] = useState(1);
  const { recording, zoomRatio, fullscreen } = useFeatures();
  const { size, gl, camera } = useThree();
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const finalZoom = 40 * zoomRatio;
  const initialRadius = 27;
  const finalRadius = 32;
  const animationTime = 7;
  const finalAngle = Math.PI / 4;
  const baseHeight = 1733 / 2;

  const currentZoom = useRef(finalZoom);

  const checkAnimationCompletion = (time, animationTime) => {
    if (time >= animationTime && !animationCompleted) {
      const previewFunc = fxpreview();
      previewFunc(); // Now calling the returned function
      setAnimationCompleted(true);
    }
  };

  useEffect(() => {
    setHeightScale(size.height / baseHeight);
    const handleResize = () => {
      currentZoom.current = finalZoom * heightScale;
      // Obtain new width and height
      const width = document.querySelector("canvas").clientWidth;
      const height =
        document.querySelector("canvas").clientHeight * heightScale;

      // Update camera properties
      camera.aspect = 5 / 7;
      camera.updateProjectionMatrix();

      // Update renderer size
      gl.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [camera, gl]);

  useFrame(({ camera, clock }) => {
    currentZoom.current = finalZoom * heightScale;

    if (animationCompleted) {
      // camera.zoom = currentZoom.current;
      // camera.updateProjectionMatrix();
      return;
    }

    const time = clock.getElapsedTime();
    let t = Math.min(time / animationTime, 1);
    const easeOut = 1 - Math.pow(1 - t, 5);
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
