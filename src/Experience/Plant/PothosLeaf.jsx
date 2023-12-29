import React, { useEffect, useState } from "react";
import * as THREE from "three";
import svgToShape from "../../common/svgToShape";
import Leaf1 from "../../assets/plants/pothos/leaf_1.svg";
import { Color, Displace, Gradient, LayerMaterial, Noise } from "lamina";

const PothosLeaf = ({ extrusion }) => {
  const [leafGeometry, setLeafGeometry] = useState(null);

  useEffect(() => {
    svgToShape(Leaf1, setLeafGeometry, extrusion);
  }, [extrusion]);

  if (!leafGeometry) {
    return null;
  }

  return (
    <group>
      <mesh geometry={leafGeometry}>
        <LayerMaterial lighting="standard" roughness={0.9}>
          {/* <Displace strength={0.1} /> */}
          <Color color="#578732" />
          <Gradient
            colorA="#78A367"
            colorB="#1D5B00"
            alpha={0.7}
            mode="multiply"
          />
          <Noise
            colorA="#527242"
            colorB="#4fa527"
            colorC="#b1cea5"
            colorD="#adb6aa"
            type="cell"
            alpha={0.8}
            scale={5.5}
            mode="overlay"
          />
        </LayerMaterial>
      </mesh>
    </group>
  );
};

export default PothosLeaf;
