import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  return <div>검색어: {query}</div>;
}

export default Search;
