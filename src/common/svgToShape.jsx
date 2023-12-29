import { Shape, ExtrudeGeometry } from "three";
import * as THREE from "three";
import { random_num } from "./utils";

// Function to flip the y-coordinate for three.js
const flipY = (y, height) => height - y;

// Function to extract the path data from an SVG string
const getPathDataFromSVG = (svgString) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const pathElement = svgDoc.querySelector("path");
  return pathElement ? pathElement.getAttribute("d") : null;
};

const getViewBoxHeightFromSVG = (svgString) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");
  if (!svgElement) {
    throw new Error("No svg element found");
  }
  const viewBox = svgElement.getAttribute("viewBox");
  if (!viewBox) {
    throw new Error("No viewBox attribute found");
  }
  const viewBoxValues = viewBox.split(" ");
  return viewBoxValues.length === 4 ? parseFloat(viewBoxValues[3]) : null;
};

// Function to convert SVG path to three.js Shape with scaling
const convertPathToShape = (svgPath, viewBoxHeight) => {
  const commands = svgPath.match(/[a-df-z][^a-df-z]*/gi);
  const shape = new Shape();

  if (!commands) {
    throw new Error("Invalid SVG path");
  }

  commands.forEach((command) => {
    const type = command[0];
    const args = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number);

    switch (type) {
      case "M":
        shape.moveTo(args[0], flipY(args[1], viewBoxHeight));
        break;
      case "C":
        shape.bezierCurveTo(
          args[0],
          flipY(args[1], viewBoxHeight),
          args[2],
          flipY(args[3], viewBoxHeight),
          args[4],
          flipY(args[5], viewBoxHeight)
        );
        break;
      case "L":
        shape.lineTo(args[0], flipY(args[1], viewBoxHeight));
        break;
      case "Z":
      case "z":
        shape.closePath();
        break;
      default:
        console.warn(`Command ${type} not supported`);
    }
  });

  // Calculate the bounding box of the shape
  const points = shape.getPoints();
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  const width = maxX - minX;
  const height = maxY - minY;

  // Determine the scale factor to fit the shape within a 1x1 unit box
  const maxDimension = Math.max(width, height);
  const scaleFactor = 1 / maxDimension;

  // Create a new scaled shape
  const scaledShape = new Shape();
  points.forEach((point, index) => {
    const scaledX = (point.x - minX) * scaleFactor;
    const scaledY = (point.y - minY) * scaleFactor;
    if (index === 0) {
      scaledShape.moveTo(scaledX, scaledY);
    } else {
      scaledShape.lineTo(scaledX, scaledY);
    }
  });

  return scaledShape;
};

const createExtrudedGeometry = (
  shape,
  depth,
  bevelEnabled,
  bevelThickness,
  bevelSize,
  bevelOffset,
  bevelSegments
) => {
  const extrudeSettings = {
    steps: 2,
    depth: depth,
    bevelEnabled: bevelEnabled,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelOffset: bevelOffset,
    bevelSegments: bevelSegments,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

// Utility function to load an SVG from source and create a Shape
const svgToShape = async (
  svgUrl,
  setGeometryCallback,
  extrusionOptions = null
) => {
  try {
    const response = await fetch(svgUrl);
    const svgText = await response.text();
    const viewBoxHeight = getViewBoxHeightFromSVG(svgText);

    if (viewBoxHeight === null) {
      throw new Error("Unable to extract viewBox height");
    }

    const svgPath = getPathDataFromSVG(svgText);
    if (svgPath) {
      const shape = convertPathToShape(svgPath, viewBoxHeight);
      let geometry;
      if (extrusionOptions) {
        geometry = createExtrudedGeometry(
          shape,
          extrusionOptions.depth,
          extrusionOptions.bevelEnabled,
          extrusionOptions.bevelThickness,
          extrusionOptions.bevelSize,
          extrusionOptions.bevelOffset,
          extrusionOptions.bevelSegments
        );
      } else {
        geometry = new THREE.BufferGeometry(shape);
      }

      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      setGeometryCallback(geometry);
    } else {
      throw new Error("No path found in SVG");
    }
  } catch (error) {
    console.error("Error loading SVG:", error);
  }
};

export default svgToShape;
