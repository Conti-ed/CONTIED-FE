import React from "react";
import { ModalContentContainer, ModalTitle } from "../../styles/Modal.styles";
import { ContiDetailState } from "../../Routes/ContiDetail";
import { styled } from "styled-components";
import { setFontStyle } from "../../styles/UploadDrawer.styles";

const KeywordEditorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 13px;
`;

const KeywordDisplay = styled.span`
  font-size: 16px;
  color: black;
  font-weight: bold;
`;

const KeyEditButton = styled.button`
  ${setFontStyle}
  background-color: #10769b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: 10px;
`;

const KeyEditInput = styled.input`
  ${setFontStyle}
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  width: 90%;
  box-sizing: border-box;
  color: black;
  font-weight: bold;
  font-size: 14px;
`;

type props = {
  state: ContiDetailState;
  setState: React.Dispatch<React.SetStateAction<ContiDetailState>>;
};

function ModifyKeywords({ state, setState }: props) {
  // Setting Keyword Default Values ​​in Edit Modal
  const startKeywordEditing = (index: number, keyword: string) => {
    setState((prevState) => ({
      ...prevState,
      ...{
        editKeywordIndex: index,
        editValue: keyword,
      },
    }));
  };

  // Edit Keywords in Edit Modal
  const changeKeywordEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      ...{
        editValue: event.target.value,
      },
    }));
  };

  // Press Enter in the Edit Modal
  const submitKeywordEdit = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter" && state.contiData) {
      const newKeywords = [...state.contiData.keywords];
      newKeywords[index] = state.editValue;
      setState((prevState) => ({
        ...prevState,
        ...{
          contiData: { ...state.contiData!, keywords: newKeywords },
          editKeywordIndex: null,
          editValue: "",
        },
      }));
    }
  };

  // Delete Keyword from Edit Modal
  const removeKeyword = (index: number) => {
    if (state.contiData) {
      const newKeywords = state.contiData.keywords.filter(
        (_, idx) => idx !== index
      );
      setState((prevState) => ({
        ...prevState,
        ...{
          contiData: { ...state.contiData!, keywords: newKeywords },
        },
      }));
    }
  };

  // Add Keyword from Edit Modal
  const addNewKeyword = (keyword: string) => {
    if (
      keyword.trim() !== "" &&
      state.contiData &&
      state.contiData.keywords.length < 3
    ) {
      const newKeywords = [...state.contiData.keywords, keyword];
      setState((prevState) => ({
        ...prevState,
        ...{
          contiData: { ...state.contiData!, keywords: newKeywords },
          editKeywordIndex: null,
        },
      }));
    }
  };

  return (
    <>
      <ModalTitle>선택해서 수정해주세요!</ModalTitle>
      <ModalContentContainer>
        {state.contiData?.keywords?.map((keyword, index) => (
          <KeywordEditorContainer key={index}>
            {index === state.editKeywordIndex ? (
              <KeyEditInput
                value={state.editValue}
                onChange={changeKeywordEditing}
                onKeyDown={(event) => submitKeywordEdit(event, index)}
                autoFocus
              />
            ) : (
              <>
                <KeywordDisplay>{keyword}</KeywordDisplay>
                <KeyEditButton
                  onClick={() => startKeywordEditing(index, keyword)}
                >
                  수정
                </KeyEditButton>
                <KeyEditButton
                  onClick={() => removeKeyword(index)}
                  style={{ marginLeft: "10px" }}
                >
                  X
                </KeyEditButton>
              </>
            )}
          </KeywordEditorContainer>
        ))}
        {state.contiData && state.contiData.keywords.length < 3 && (
          <KeywordEditorContainer>
            {state.showNewKeywordInput ? (
              <KeyEditInput
                value={state.editValue}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    ...{ editValue: e.target.value },
                  }))
                }
                onKeyDown={(event: { key: string }) => {
                  if (event.key === "Enter" && state.editValue.trim() !== "") {
                    addNewKeyword(state.editValue);
                    setState((prevState) => ({
                      ...prevState,
                      ...{
                        editValue: "",
                        showNewKeywordInput: false,
                      },
                    }));
                  }
                }}
                autoFocus
              />
            ) : (
              <KeyEditButton
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    ...{ showNewKeywordInput: true },
                  }))
                }
              >
                +
              </KeyEditButton>
            )}
          </KeywordEditorContainer>
        )}
      </ModalContentContainer>
    </>
  );
}
export default ModifyKeywords;
