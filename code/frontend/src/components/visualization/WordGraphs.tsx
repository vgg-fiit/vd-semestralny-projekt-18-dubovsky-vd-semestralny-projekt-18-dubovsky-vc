import * as React from "react";
import ReactWordcloud from "react-wordcloud";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export interface WordGraphsProps {
  wordData: any;
  selectedWord: (word: string) => void;
}

const WordGraphs: React.FC<WordGraphsProps> = ({ wordData, selectedWord }) => {
  return (
    <Grid item xs={12} md={4} lg={3}>
      <Paper>
        <ReactWordcloud words={wordData} callbacks={{onWordClick: w => selectedWord(w.text)}}/>
      </Paper>
    </Grid>
  );
};

export default WordGraphs;
