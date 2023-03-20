import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
// create function componentt

export default function FlightScene() {
  return (
    <>
      <OrbitControls />
      <Box />;
      <pointLight position={[10, 10, 10]} />
    </>
  );
}
