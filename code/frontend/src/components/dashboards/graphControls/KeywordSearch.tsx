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

const GraphController: React.FC = () => {
  // Add useState for list of strings keywords (use empty array as initial value)
  const [names, setNames] = useState<string[]>([]);
  const [textValue, setTextValue] = useState<string>("");

  const onTextChange = (e: any) => setTextValue(e.target.value);

  const handleClick = () => {
    if (textValue === "") return;

    if (names.includes(textValue)) {
      return;
    }

    if (names.length >= 5) {
      return;
    }

    if (textValue.length > 20) {
      return;
    }

    setNames([...names, textValue]);
    setTextValue("");
    console.log(names);
  };

  const handleDelete = (index: number) => {
    const newNames = [...names];
    newNames.splice(index, 1);
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
      <Button variant="contained" onClick={handleClick}>
        Add Keyword
      </Button>

      {names.map((name, index) => (
        <ListItem>
          <Chip
            key={index}
            icon={<TagFacesIcon />}
            label={name}
            onDelete={handleDelete}
          />
        </ListItem>
      ))}
    </>
  );
};
``;

export default GraphController;
