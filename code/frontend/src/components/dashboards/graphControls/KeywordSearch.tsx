import { Button } from "@material-ui/core";
import {
  Chip,
  FormControl,
  FormGroup,
  Grid,
  ListItem,
  makeStyles,
  Paper,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { wrap } from "module";

type Inputs = {
  keyword: string;
};

interface KeywordSearchProps {
  sendToParent: (newState: {key: string, value: string}[]) => void;
}

const GraphController: React.FC<KeywordSearchProps> = ({sendToParent}) => {
  // Add useState for list of strings keywords (use empty array as initial value)
  const [names, setNames] = useState<{key: string, value: string}[]>([]);
  const [textValue, setTextValue] = useState<string>("");

  const onTextChange = (e: any) => setTextValue(e.target.value);

  const handleClick = (text: string) => {
    if (text === "") return;

    if (names.find((name) => name.value === text)) {
      return;
    }

    if (names.length >= 5) {
      return;
    }

    if (textValue.length > 20) {
      return;
    }

    sendToParent([...names, {key: "name", value: text}]);
    setNames([...names, {key: "name", value: text}]);
    setTextValue("");
  };

  const handleDelete = (index: number) => {
    const newNames = [...names];
    newNames.splice(index, 1);
    sendToParent(newNames);
    setNames(newNames);
  };
  return (
    <>
      <TextField
        label="Keyword"
        variant="filled"
        placeholder="Keyword"
        value={textValue}
        onChange={onTextChange}
      />
      <Button variant="contained" onClick={_ => {handleClick(textValue)}}>
        Add Keyword
      </Button>

      {names.map((name, index) => (
        <ListItem>
          <Chip
            key={index}
            icon={<TagFacesIcon />}
            label={name.value}
            onDelete={handleDelete}
          />
        </ListItem>
      ))}
    </>
  );
};
``;

export default GraphController;
