import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.trim() !== "") {
      setSearchTerm(value);
      onSearch(value);
    } else {
      setSearchTerm("");
    }
  };

  return (
    <>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearch}
        variant="outlined"
      />
    </>
  );
};

export default Search;
