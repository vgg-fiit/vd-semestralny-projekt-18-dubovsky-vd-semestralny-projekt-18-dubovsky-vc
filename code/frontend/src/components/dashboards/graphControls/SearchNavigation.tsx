import React from "react";
import { IconButton, Grid, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface SearchNavigationProps {
  onBackwardClick: () => void;
  onForwardClick: () => void;
}

const SearchNavigation: React.FC<SearchNavigationProps> = ({
  onBackwardClick,
  onForwardClick,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton onClick={onBackwardClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography>Go Back</Typography>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton onClick={onForwardClick}>
            <ArrowForwardIcon />
          </IconButton>
          <Typography>Lookup Selected</Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SearchNavigation;
