import { Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import DepthSlider from "./DepthSlider";
import KeywordSearch from "./KeywordSearch";

const GraphController: React.FC = () => {
  const [selectedDepth, setSelectedDepth] = useState<number>(0);

  const handleDepthChange = (depth: number) => {
    setSelectedDepth(depth);
  };

  return (
    <>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DepthSlider onChange={handleDepthChange} depthOptions={[1, 7]} />
          <p>Selected depth: {selectedDepth}</p>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <KeywordSearch />
        </Paper>
      </Grid>
    </>
  );
};

export default GraphController;
