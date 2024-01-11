import * as React from "react";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";

import { ChangeEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { fileUploadAtom } from "../atoms";
import { styled as muistyled } from "@mui/joy";
import styled from "styled-components";

const VisuallyHiddenInput = muistyled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const DeleteButton = styled.button`
  background-color: #007bff;
  border: none;
  padding: 0 4px;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 5px;
  justify-content: center;
`;

export default function InputFileUpload() {
  const setFile = useSetRecoilState(fileUploadAtom);
  const [fileName, setFileName] = useState("악보가 있으면 더 좋아요!");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Please select a PDF file.");
      e.target.value = "";
      setFileName("악보가 있으면 더 좋아요!");
    }
  };

  const handleDeleteFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    setFileName("악보가 있으면 더 좋아요!");
  };

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 전파 중지
  };

  return (
    <Button
      component="label"
      role={undefined}
      tabIndex={-1}
      variant="outlined"
      sx={{
        fontFamily: "Nunito Sans",
        color: "text.disabled",
        bgcolor: "white",
      }}
      startDecorator={
        <SvgIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </SvgIcon>
      }
    >
      {fileName !== "악보가 있으면 더 좋아요!" ? (
        <>
          {fileName}
          <DeleteButton onClick={handleDeleteFile}>X</DeleteButton>
        </>
      ) : (
        <>
          {fileName}
          <VisuallyHiddenInput
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </>
      )}
    </Button>
  );
}
