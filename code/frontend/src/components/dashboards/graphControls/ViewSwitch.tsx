import React, { useState } from "react";
import { ButtonGroup, Button } from "@mui/material";

interface ViewSwitcherProps {
  onViewTypeChange: (viewType: "classic" | "explorer" | "searcher") => void;
}

const ViewSwitch: React.FC<ViewSwitcherProps> = ({ onViewTypeChange }) => {
  const [selectedView, setSelectedView] = useState<
    "classic" | "explorer" | "searcher"
  >("classic");

  const handleViewChange = (viewType: "classic" | "explorer" | "searcher") => {
    setSelectedView(viewType);
    onViewTypeChange(viewType);
  };

  return (
    <ButtonGroup variant="contained">
      <Button
        color={selectedView === "classic" ? "primary" : "secondary"}
        onClick={() => handleViewChange("classic")}
      >
        Classic
      </Button>
      <Button
        color={selectedView === "explorer" ? "primary" : "secondary"}
        onClick={() => handleViewChange("explorer")}
      >
        Explorer
      </Button>
      <Button
        color={selectedView === "searcher" ? "primary" : "secondary"}
        onClick={() => handleViewChange("searcher")}
      >
        Searcher
      </Button>
    </ButtonGroup>
  );
};

export default ViewSwitch;
