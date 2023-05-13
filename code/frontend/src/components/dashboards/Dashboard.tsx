import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Canvas } from "@react-three/fiber";
import GraphController from "./graphControls/GraphController";
import { useState } from "react";
import GraphScene from "../visualization/GraphScene";
import Stack from "@mui/material/Stack";
import ExplorerScene from "../visualization/ExplorerScene";
import WordGraphs from "../visualization/WordGraphs";
import TreeMap from "../visualization/TreeMap";
import TreeGraph from "../visualization/TreeGraph";
import ChordDiagram from "../visualization/Chords";
import { Alert, Snackbar } from "@mui/material";

const drawerWidth: number = 300;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Bucket {
  id: number;
  range: string;
  nodes: File[];
}

interface File {
  id: number;
  size: number;
  name: string;
  index: number;
  keywords: string[];
}

interface Tree {
  name: string;
  uuId: number;
  children: Tree[];
}

interface HistogramItem {
  text: string;
  value: number;
}

interface Edge {
  fromIndex: number;
  toIndex: number;
  fromId: number;
  toId: number;
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

enum NodeType {
  Directory = "Directory",
  File = "File",
  Word = "Word",
  Size = "Size",
}

export interface Node {
  uuId: number;
  size: number;
  position: Vector3;
  displacement: Vector3;
  name: string;
  type: NodeType;
  fixed: boolean;
  keywords: string[];
}

interface Graph {
  buckets?: Bucket[];
  bucketsByYear?: Bucket[];
  histogram?: HistogramItem[];
  tree?: Tree;
  nodes: Node[];
  edges: Edge[];
  mapping: { [id: number]: number };
  nodesCount: number;
  filesCount?: number;
  edgesCount: number;
  filesCountByYear?: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const [graphColors, setGraphColors] = useState<any>({
    nodeColor: "#000000",
    edgeColor: "#000000",
    selectedNodeColor: "#000000",
  }); // Stores the colors of the nodes in the graph
  const [selectedNodes, setSelectedNodes] = useState<any>([]); // Stores the selected nodes in the graph
  const [selectedNode, setSelectedNode] = useState<number>(-1); // Stores the selected node in the graph
  const [wordsSelected, setSelectedWords] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>([]);
  const [selectedScene, setSelectedScene] = useState<
    "classic" | "explorer" | "searcher"
  >("classic");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const getSelectedNode = () => {
    if (selectedNode === -1) {
      return null;
    }
    return selectedNode;
  };

  // Handles change of the data in GraphController component and updates the graph data in the state
  const handleGraphDataChange = (data: any) => {
    const graph: Graph = data.data;
    const request: any = data.request;
    setGraphData({
      nodes: graph.nodes,
      edges: graph.edges,
      histogram: graph.histogram,
      tree: graph.tree,
      buckets: graph.buckets,
      bucketsByYear: graph.bucketsByYear,
      filesCount: graph.filesCount,
      filesCountByYear: graph.filesCountByYear,
      request: request,
    });
    (
      document.getElementById("graphState") as HTMLElement
    ).innerHTML = `Graph successfully loaded!`;
  };

  const handleSceneChange = (data: any) => {
    setSelectedScene(data);
  };

  const handleColorChange = (data: any) => {
    setGraphColors(data);
  };

  const handleNodesSelection = (nodesUuIds: number[]) => {
    if (graphData && graphData.nodes) {
      // filter the nodes by the uuids

      const filteredList = graphData.nodes.filter(
        (node: any) => !!nodesUuIds.find((nodeUuId) => node.uuId === nodeUuId)
      );
      setSelectedNodes(filteredList);
    }
  };

  const handleHoveredNode = (node: Node) => {
    if (node != null)
      (
        document.getElementById("graphState") as HTMLElement
      ).innerHTML = `Hovered node ${node.name} of type ${node.type}`;
  };

  const handleNodeSelection = (nodeUuId: number) => {
    setSelectedNode(nodeUuId);
  };

  const handleWordClick = (word: string) => {
    if (graphData && graphData.nodes) {
      console.log(word);
      const newSelectionState = (graphData.nodes as Node[]).filter((n) =>
        n.name.toLowerCase().includes(word.toLowerCase())
      );
      if (newSelectionState.length != 0) {
        console.log(newSelectionState);
        setSelectedWords(newSelectionState);
      }
    }
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box component="div" sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Visualization
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Stack
            spacing={2}
            sx={{ p: 2, ...(!open && { display: "none" }) }}
            direction="column"
          >
            <GraphController
              onDataChange={handleGraphDataChange}
              onSceneChange={handleSceneChange}
              getSelectedNode={getSelectedNode}
              onColorChange={handleColorChange}
              onHighlightChange={handleWordClick}
            />
          </Stack>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper>
                  <Canvas
                    id="canvas"
                    style={{ width: "100%", aspectRatio: "16 / 9" }}
                  >
                    {selectedScene === "classic" && (
                      <GraphScene
                        data={graphData}
                        handleNodeSelection={handleNodesSelection}
                        handleHoveredNode={handleHoveredNode}
                      />
                    )}
                    {selectedScene === "explorer" && (
                      <ExplorerScene
                        data={graphData}
                        handleNodeSelection={handleNodeSelection}
                        colors={graphColors}
                      />
                    )}
                    {selectedScene === "searcher" && (
                      <GraphScene
                        data={graphData}
                        handleNodeSelection={handleNodesSelection}
                        handleHoveredNode={handleHoveredNode}
                      />
                    )}
                  </Canvas>
                  <Alert severity="info">
                    <span id="graphState">Graph not loaded.</span>
                  </Alert>
                </Paper>
              </Grid>

              {graphData.histogram ? (
                <WordGraphs
                  wordData={graphData.histogram}
                  selectedWord={handleWordClick}
                />
              ) : null}
              {graphData.histogram ? (
                <TreeMap wordData={graphData.histogram} />
              ) : null}
              {graphData.tree ? <TreeGraph tree={graphData.tree} /> : null}
              {graphData.buckets ? (
                <ChordDiagram
                  buckets={graphData.buckets}
                  filesCount={graphData.filesCount}
                />
              ) : null}
              {graphData.bucketsByYear ? (
                <ChordDiagram
                  buckets={graphData.bucketsByYear}
                  filesCount={graphData.filesCountByYear}
                />
              ) : null}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
