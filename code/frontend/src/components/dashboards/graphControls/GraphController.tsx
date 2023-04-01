import { Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import CategorySwitcher from "./CategorySwich";
import DepthSlider from "./DepthSlider";
import KeywordSearch from "./KeywordSearch";
import Button from "@mui/material/Button";
import axios from "axios";

interface GraphControllerProps {
  onDataChange: (newState: any) => void;
}

const GraphController: React.FC<GraphControllerProps> = ({ onDataChange }) => {
  const [selectedDepth, setSelectedDepth] = useState<number>(0);
  const [data, setData] = useState<any>([]);

  const handleDepthChange = (depth: number) => {
    setSelectedDepth(depth);
  };

  const categories = [
    {
      name: "Category 1",
      content: <div>Category 1 content goes here</div>,
    },
    {
      name: "Category 2",
      content: <div>Category 2 content goes here</div>,
    },
    {
      name: "Category 3",
      content: <div>Category 3 content goes here</div>,
    },
  ];

  const handleFetch = () => {
    axios
      .post("http://localhost:14444/graph/get", {
        nodeType: "Directory",
        relationship: "true",
        limit: 20,
        range: {
          to: 3,
        },
      })
      .then((res: any) => {
        console.log(res);
        onDataChange(res.data.data);
      })
      .catch((err: any) => {
        console.error(err);
      });

    // setData("test");
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
          <Button onClick={handleFetch} variant="contained">
            Fetch data from backend
          </Button>
          <Button variant="text">Text</Button>
        </Paper>
      </Grid>
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

      <Grid item xs={12} md={8} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CategorySwitcher categories={categories} />
        </Paper>
      </Grid>
    </>
  );
};

export default GraphController;
