import { Slider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete, AutocompleteRenderInputParams } from "@material-ui/lab";
import React, { useState } from "react";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

interface DepthSliderProps {
  onChange: (depth: number) => void;
  depthOptions: number[];
}

const DepthSlider: React.FC<DepthSliderProps> = ({
  onChange,
  depthOptions,
}) => {
  const classes = useStyles();
  const [selectedDepth, setSelectedDepth] = useState<number>(depthOptions[0]);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setSelectedDepth(newValue as number);
  };

  const handleBlur = () => {
    if (selectedDepth < depthOptions[0]) {
      setSelectedDepth(depthOptions[0]);
    } else if (selectedDepth > depthOptions[depthOptions.length - 1]) {
      setSelectedDepth(depthOptions[depthOptions.length - 1]);
    }
  };

  const handleOptionChange = (
    event: React.ChangeEvent<{}>,
    value: number | null
  ) => {
    if (value !== null) {
      setSelectedDepth(value);
    }
  };

  return (
    <Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
      <Slider
        value={selectedDepth}
        onChange={handleSliderChange}
        aria-labelledby="depth-slider"
        step={1}
        marks
        min={depthOptions[0]}
        max={depthOptions[depthOptions.length - 1]}
      />
      <p>Selected depth: {selectedDepth}</p>
      <Button variant="contained" onClick={() => onChange(selectedDepth)}>
        {"Set depth"}
      </Button>
    </Stack>
  );
};

export default DepthSlider;
