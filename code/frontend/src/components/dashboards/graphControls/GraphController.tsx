import { Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import DepthSlider from "./DepthSlider";
import KeywordSearch from "./KeywordSearch";
import Button from "@mui/material/Button";
import axios from "axios";
import ViewSwitch from "./ViewSwitch";

interface GraphControllerProps {
  onDataChange: (newState: any) => void;
  onSceneChange: (newState: any) => void;
}

const GraphController: React.FC<GraphControllerProps> = ({
  onDataChange,
  onSceneChange,
}) => {
  const [selectedDepth, setSelectedDepth] = useState<number>(0);
  const [data, setData] = useState<any>([]);
  const [view, setView] = useState<"classic" | "explorer" | "searcher">(
    "classic"
  );

  const handleDepthChange = (depth: number) => {
    postOptions.range.to = depth;
    handleFetch();
    setSelectedDepth(depth);
  };

  const handleViewChange = (viewType: "classic" | "explorer" | "searcher") => {
    setView(viewType);
    onSceneChange(viewType);
  };

  const postOptions = {
    nodeType: "Directory",
    relationship: "true",
    limit: 50,
    range: {
      to: 3,
    },
  };

  const handleFetch = () => {
    axios
      .post("http://localhost:14444/graph/get", postOptions)
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
          <ViewSwitch onViewTypeChange={handleViewChange} />
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
          <Button onClick={handleFetch} variant="contained">
            Fetch data from backend
          </Button>
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
    </>
  );
};

export default GraphController;
