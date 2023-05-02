import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";

import { GithubPicker, ColorResult } from "react-color";

interface ColorPickerProps {
  handleColorChange: (color: string, type: string) => void;
}

const ColorPickerComponent: React.FC<ColorPickerProps> = ({
  handleColorChange,
}) => {
  const [nodeColor, setNodeColor] = useState("#000");
  const [marchColor, setMarchColor] = useState("#000");
  const [edgeColor, setEdgeColor] = useState("#000");

  const handleNodeColorChange = (color: ColorResult) => {
    setNodeColor(color.hex);
    handleColorChange(color.hex, "node");
  };

  const handleMarchColorChange = (color: ColorResult) => {
    setMarchColor(color.hex);
    handleColorChange(color.hex, "selectedNode");
  };

  const handleEdgeColorChange = (color: ColorResult) => {
    setEdgeColor(color.hex);
    handleColorChange(color.hex, "edge");
  };

  return (
    <Stack direction="column" textAlign="left">
      <Typography variant="h6">Node Color</Typography>
      <Paper sx={{ backgroundColor: nodeColor, p: 2 }} />

      <GithubPicker color={nodeColor} onChange={handleNodeColorChange} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        March Color
      </Typography>
      <Paper sx={{ backgroundColor: marchColor, p: 2 }} />

      <GithubPicker color={marchColor} onChange={handleMarchColorChange} />

      <Typography variant="h6" sx={{ mt: 2 }}>
        Edge Color
      </Typography>
      <Paper sx={{ backgroundColor: edgeColor, p: 2 }} />

      <GithubPicker color={edgeColor} onChange={handleEdgeColorChange} />
      <Button variant="contained" color="primary" onClick={() => {}}>
        Apply Graph Colors
      </Button>
    </Stack>
  );
};

export default ColorPickerComponent;
