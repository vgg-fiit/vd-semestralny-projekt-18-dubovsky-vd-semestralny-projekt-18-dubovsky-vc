import { Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import DepthSlider from "./DepthSlider";
import KeywordSearch from "./KeywordSearch";
import Button from "@mui/material/Button";
import axios from "axios";
import ViewSwitch from "./ViewSwitch";
import Search from "./Search";
import ColorPickerComponent from "./ColorPicker";

interface GraphControllerProps {
  onDataChange: (newState: any) => void;
  onSceneChange: (newState: any) => void;
  getSelectedNode: () => void;
}

const GraphController: React.FC<GraphControllerProps> = ({
  onDataChange,
  onSceneChange,
  getSelectedNode,
}) => {
  const [selectedDepth, setSelectedDepth] = useState<number>(0);
  const [data, setData] = useState<any>([]);
  const [view, setView] = useState<"classic" | "explorer" | "searcher">(
    "classic"
  );

  const [keywords, setKeywords] = useState<string[]>([]);
  const [rootUuId, setRootUuId] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [colors, setColors] = useState<any>({
    nodeColor: "#000000",
    edgeColor: "#000000",
    selectedNodeColor: "#000000",
  });

  const handleColorChange = (color: string, type: string) => {
    if (type === "node") {
      setColors({ ...colors, nodeColor: color });
    } else if (type === "edge") {
      setColors({ ...colors, edgeColor: color });
    } else if (type === "selectedNode") {
      setColors({ ...colors, selectedNodeColor: color });
    }
  };

  const handleRootChange = (rootUuId: number) => {
    handleClassicFetch();
    setRootUuId(rootUuId);
  };

  const handleDepthChange = (depth: number) => {
    handleClassicFetch();
    setSelectedDepth(depth);
  };

  const handleViewChange = (viewType: "classic" | "explorer" | "searcher") => {
    setView(viewType);
    onSceneChange(viewType);
  };

  const handleClassicFetch = () => {
    const payLoad = {
      nodeType: "Directory",
      relationship: "true",
      limit: 50,
      range: {
        to: depth === 0 ? 3 : depth,
      },
    };

    axios
      .post("http://localhost:14444/graph/get", payLoad)
      .then((res: any) => {
        console.log(res);
        onDataChange(res.data.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleSearchFetch = (keywords: string[]) => {
    const payLoad = {};
    axios
      .post("http://localhost:14444/graph/search", payLoad)
      .then((res: any) => {
        console.log(res);
        onDataChange(res.data.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleExploreFetch = (rootUuId: number) => {
    const payLoad = {};
    axios
      .post("http://localhost:14444/graph/explorer", payLoad)
      .then((res: any) => {
        console.log(res);
        onDataChange(res.data.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const printSelected = () => {
    console.log("SselectedUuId: " + getSelectedNode());
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

      {view === "classic" && (
        <>
          <DepthSlider onChange={handleDepthChange} depthOptions={[1, 7]} />
        </>
      )}

      {view === "searcher" && (
        <>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <KeywordSearch />
            <Button onClick={handleClassicFetch} variant="contained">
              Fetch data from backend
            </Button>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Search onSearch={setSearchTerm}></Search>
          </Paper>
        </>
      )}

      {view === "explorer" && (
        <>
          <DepthSlider onChange={handleDepthChange} depthOptions={[1, 7]} />
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              Current depth: {selectedDepth}
            </Paper>
          </Grid>
        </>
      )}

      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button onClick={handleClassicFetch} variant="contained">
            Fetch data from backend
          </Button>
        </Paper>
      </Grid>

      <ColorPickerComponent
        handleColorChange={handleColorChange}
      ></ColorPickerComponent>
      {/* <Grid item xs={12} md={8} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        ></Paper>
      </Grid> */}
    </>
  );
};

export default GraphController;
