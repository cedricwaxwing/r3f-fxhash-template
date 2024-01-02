import { useState, useEffect, memo, useRef, forwardRef } from "react";
import { useThree } from "@react-three/fiber";
import { useFeatures } from "../common/FeaturesProvider";
import ConeGLB from "../assets/shapes/cone/cone.glb";
import * as THREE from "three";
import { random_choice, random_num } from "../common/utils";
import {
  Float,
  MeshTransmissionMaterial,
  RoundedBox,
  Sphere,
  useGLTF,
} from "@react-three/drei";

const Material = ({ color, texture, seed }) => {
  return seed < 0.8 ? (
    <meshStandardMaterial
      envMap={texture}
      envMapIntensity={0.8}
      color={color}
    />
  ) : (
    <MeshTransmissionMaterial
      envMap={texture}
      envMapIntensity={0.8}
      color="#fff"
      ior={1.33}
      thickness={2}
      backside
      backsideThickness={0.3}
      distortion={0.1}
      distortionScale={0.3}
      chromaticAberration={30}
    />
  );
};

const ShapeComponent = forwardRef(({ shape, texture, onRendered }, ref) => {
  const { nodes } = useGLTF(ConeGLB);

  let Shape;
  let extraProps = {};

  switch (shape.geometryType) {
    case "box":
      Shape = RoundedBox;
      extraProps = { args: shape.scale };
      break;
    case "sphere":
      Shape = Sphere;
      extraProps = { scale: shape.scale };
      break;
    default: // For 'cone' or other types
      Shape = "mesh";
      extraProps = { geometry: nodes.Cone.geometry, scale: shape.scale };
      break;
  }

  useEffect(() => {
    if (ref.current) {
      const boundingBox = new THREE.Box3().setFromObject(ref.current);
      onRendered(shape, boundingBox);
    }
  }, [ref, shape, onRendered]);

  return (
    <Shape
      ref={ref}
      castShadow
      receiveShadow
      position={shape.position}
      rotation={shape.rotation}
      {...extraProps}
    >
      <Material color={shape.color} texture={texture} seed={shape.seed} />
    </Shape>
  );
});

const Shapes = ({ texture }) => {
  const { viewport } = useThree();
  const { theme, num_shapes } = useFeatures();
  const [shapes, setShapes] = useState([]);
  const [renderedShapes, setRenderedShapes] = useState([]);

  const handleShapeRendered = (shape, boundingBox) => {
    console.log(shape, boundingBox);
    setRenderedShapes((prevShapes) => {
      return [...prevShapes, { ...shape, boundingBox }];
    });
  };

  const isColliding = (shape1, shape2) => {
    console.log(shape1, shape2);
    return (
      shape1.boundingBox &&
      shape2.boundingBox &&
      shape1.boundingBox.intersectsBox(shape2.boundingBox)
    );
  };

  const generateShape = (viewport, theme) => {
    const geometryType = random_choice(["box", "cone", "sphere"]);
    const seed = random_num(0, 1);
    const color = random_choice(theme.colors);
    const position = [
      random_num(-viewport.width / 1.8, viewport.width / 1.8),
      random_num(-viewport.height / 1.8, viewport.height / 1.8),
      random_num(-0.15, 0.15),
    ];
    const scaleBase = random_num(0.25, 0.75);
    const scale =
      geometryType === "box"
        ? [
            seed > 0.5 ? scaleBase : scaleBase * random_num(1, 8),
            seed <= 0.5 ? scaleBase : scaleBase * random_num(1, 8),
            scaleBase,
          ]
        : scaleBase;
    const rotation = [
      random_num(-Math.PI * 2, Math.PI * 2),
      random_num(-Math.PI * 2, Math.PI * 2),
      random_num(-Math.PI * 2, Math.PI * 2),
    ];
    return {
      geometryType,
      seed,
      color,
      position,
      scale,
      rotation,
    };
  };

  useEffect(() => {
    const initialShapes = [];
    for (let i = 0; i < num_shapes; i++) {
      initialShapes.push(generateShape(viewport, theme));
    }
    setShapes(initialShapes);
  }, [viewport, theme, num_shapes]);

  useEffect(() => {
    if (renderedShapes.length === num_shapes) {
      let needsRegeneration = false;
      let regeneratedShapes = renderedShapes.map((shape, index) => {
        for (let i = 0; i < renderedShapes.length; i++) {
          if (i !== index && isColliding(shape, renderedShapes[i])) {
            needsRegeneration = true;
            return generateShape(viewport, theme);
          }
        }
        return shape;
      });

      if (needsRegeneration) {
        setRenderedShapes([]); // Reset for re-rendering
        setShapes(regeneratedShapes); // Set new shapes without collisions
      }
    }
  }, [renderedShapes, viewport, theme, num_shapes]);

  return (
    <>
      {shapes.map((shape, index) => {
        return (
          <Float
            key={index}
            floatIntensity={shape.intensity}
            speed={shape.speed}
            rotationIntensity={0}
          >
            <ShapeComponent
              ref={(ref) => (shape.ref = ref)}
              shape={shape}
              texture={texture}
              onRendered={handleShapeRendered}
            />
          </Float>
        );
      })}
    </>
  );
};

export default memo(Shapes);
