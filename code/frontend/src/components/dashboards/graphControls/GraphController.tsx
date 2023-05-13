import { Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import DepthSlider from "./DepthSlider";
import KeywordSearch from "./KeywordSearch";
import Button from "@mui/material/Button";
import axios from "axios";
import ViewSwitch from "./ViewSwitch";
import Search from "./Search";
import ColorPickerComponent from "./ColorPicker";
import { IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchNavigation from "./SearchNavigation";

interface GraphControllerProps {
  onDataChange: (newState: any) => void;
  onSceneChange: (newState: any) => void;
  onColorChange: (newState: any) => any;
  onHighlightChange: (newState: any) => any;
  getSelectedNode: () => any;
}

const GraphController: React.FC<GraphControllerProps> = ({
  onDataChange,
  onSceneChange,
  getSelectedNode,
  onColorChange,
  onHighlightChange,
}) => {
  let selectedDepth = 1;
  const [data, setData] = useState<any>([]);
  const [view, setView] = useState<"classic" | "explorer" | "searcher">(
    "classic"
  );

  const [keywords, setKeywords] = useState<{ key: string; value: string }[]>(
    []
  );
  const [rootUuId, setRootUuId] = useState<number>(0);
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
    selectedDepth = depth;
    handleClassicFetch();
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
        to: selectedDepth,
      },
    };

    axios
      .post("http://localhost:14444/graph/get", payLoad)
      .then((res: any) => {
        console.log(res);
        onDataChange(res.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleSearchFetch = () => {
    const payLoad = {
      nodeType: "Directory",
      relationship: "true",
      limit: 50,
      range: {
        to: 3,
      },
      filter: {
        keywords: keywords,
      },
    };
    axios
      .post("http://localhost:14444/graph/get", payLoad)
      .then((res: any) => {
        console.log(res);
        onDataChange(res.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const handleExploreFetch = (rootUuId: number) => {
    const payLoad = {
      nodeType: "Directory",
      relationship: "true",
      limit: 50,
      range: {
        to: selectedDepth,
      },
      id: rootUuId,
    };

    axios
      .post("http://localhost:14444/graph/get", payLoad)
      .then((res: any) => {
        console.log(res);

        onDataChange(res.data);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const onBackwardClick = () => {};

  const onForwardClick = () => {
    const selectedNode = getSelectedNode();
    console.log(selectedNode);

    if (selectedNode) {
      handleExploreFetch(selectedNode.uuId);
    }
  };

  const sendToParent = (keywords: { key: string; value: string }[]) => {
    setKeywords(keywords);
  };

  const handleHighlight = () => {};

  useEffect(() => {
    onColorChange(colors);
  }, [colors]);

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
            <KeywordSearch sendToParent={sendToParent} />
            <Button onClick={handleSearchFetch} variant="contained">
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
            <Button
              onClick={() => onHighlightChange(searchTerm)}
              variant="contained"
            >
              Highlight
            </Button>
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
            <SearchNavigation
              onBackwardClick={onBackwardClick}
              onForwardClick={onForwardClick}
            />
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
