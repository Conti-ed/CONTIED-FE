import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "react-query";
import { ContiType } from "../types";
import { getContiesByKeyword } from "../api";
import ContiPlaceholder from "../components/ContiPlaceholder";
import Conti from "../components/Conti";

function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const { data, isLoading } = useQuery<ContiType[]>(["conties", query], {
    queryFn: () => getContiesByKeyword(query!),
  });

  console.log(data);

  return (
    <div>
      검색어: {query}
      <div>
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <ContiPlaceholder key={index} size={115} />
            ))
          : data!
              .slice(0, 20)
              .map((conti, index) => <Conti key={index} contiData={conti} />)}
      </div>
    </div>
  );
}

export default Search;
