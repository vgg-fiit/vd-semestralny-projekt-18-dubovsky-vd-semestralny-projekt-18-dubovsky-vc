import * as React from "react";
import ReactWordcloud from "react-wordcloud";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";

export interface WordGraphsProps {
  wordData: any;
  selectedWord: (word: string) => void;
}

const WordGraphs: React.FC<WordGraphsProps> = ({ wordData, selectedWord }) => {
  return (
    <Grid item xs={12}>
      <Paper>
        <ReactWordcloud size={undefined} words={wordData} callbacks={{onWordClick: w => selectedWord(w.text)}}/>
      </Paper>
    </Grid>
  );
};

export default WordGraphs;
