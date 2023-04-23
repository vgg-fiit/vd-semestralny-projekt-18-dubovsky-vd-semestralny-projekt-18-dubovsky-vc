import * as React from "react";
import ReactWordcloud from "react-wordcloud";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export interface WordGraphsProps {
  wordData: any;
}

const WordGraphs: React.FC<WordGraphsProps> = ({ wordData }) => {
  return (
    <Grid item xs={12} md={4} lg={3}>
      <Paper>
        <ReactWordcloud words={wordData} />
      </Paper>
    </Grid>
  );
};

export default WordGraphs;
