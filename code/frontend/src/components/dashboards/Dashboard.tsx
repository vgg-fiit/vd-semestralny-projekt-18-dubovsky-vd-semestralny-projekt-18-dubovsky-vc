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
import { SelectedListItems } from "./SelectedListItems";
import ExplorerScene from "../visualization/ExplorerScene";
import WordGraphs from "../visualization/WordGraphs";
import TreeMap from "../visualization/TreeMap";
import TreeGraph from "../visualization/TreeGraph";
import ChordDiagram from "../visualization/Chords";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
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
  const [selectedNodes, setSelectedNodes] = useState<any>([]); // Stores the selected nodes in the graph
  const [graphData, setGraphData] = useState<any>([]);
  const [selectedScene, setSelectedScene] = useState<
    "classic" | "explorer" | "searcher"
  >("classic");
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Handles change of the data in GraphController component and updates the graph data in the state
  const handleGraphDataChange = (data: any) => {
    // console.log(data);
    // console.log(graphData);

    setGraphData({
      nodes: data.nodes,
      edges: data.edges,
      histogram: data.histogram,
      tree: data.tree,
      buckets: data.buckets,
      filesCount: data.filesCount
    });
  };

  const handleSceneChange = (data: any) => {
    setSelectedScene(data);
  };

  const handleNodeSelection = (nodesUuIds: number[]) => {
    if (graphData && graphData.nodes) {
      // filter the nodes by the uuids

      const filteredList = graphData.nodes.filter(
        (node: any) => !!nodesUuIds.find((nodeUuId) => node.uuId === nodeUuId)
      );
      setSelectedNodes(filteredList);
    }
    // console.log(graphData.nodes);
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
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
          <Divider />
          <List component="nav">
            {open && <SelectedListItems data={selectedNodes} />}
            {/* Add  */}
            {/* <Divider sx={{ my: 1 }} />
            {secondaryListItems} */}
          </List>
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
                        handleNodeSelection={handleNodeSelection}
                      />
                    )}
                    {selectedScene === "explorer" && (
                      <ExplorerScene
                        data={graphData}
                        handleNodeSelection={handleNodeSelection}
                      />
                    )}
                  </Canvas>
                </Paper>
              </Grid>

              {graphData.histogram ? (
                <WordGraphs wordData={graphData.histogram} />
              ) : null}
              {graphData.histogram ? (
                <TreeMap wordData={graphData.histogram} />
              ) : null}
              {graphData.tree ? (
                <TreeGraph tree={graphData.tree} />
              ) : null}
              {graphData.buckets ? (
                <ChordDiagram buckets={graphData.buckets} filesCount={graphData.filesCount} />
              ) : null}

              <GraphController
                onDataChange={handleGraphDataChange}
                onSceneChange={handleSceneChange}
              ></GraphController>
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
