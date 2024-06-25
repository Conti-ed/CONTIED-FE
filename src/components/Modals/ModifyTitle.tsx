import { styled } from "styled-components";
import { ModalTitle } from "../../styles/Modal.styles";
import { ContiDetailState } from "../../hooks/useContiDetailState";
import { useRecoilState } from "recoil";
import { modalAtom } from "../../atoms";
import { SERVER_URL } from "../../api";

const TitleEditInput = styled.input`
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;
  color: black;
  font-weight: bold;
  font-size: 14px;
`;

const TitleEditButton = styled.button`
  margin-top: 20px;
  padding: 8px 12px;
  background-color: #388ee9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const TitleEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type props = {
  id: { cid: string | undefined; uid: string | undefined };
  state: ContiDetailState;
  updateState: (updates: Partial<ContiDetailState>) => void;
};

function ModifyTitle({ id, state, updateState }: props) {
  const { cid } = id;
  const [modal, setModal] = useRecoilState(modalAtom);
  const closeModal = () => {
    setModal({ isShow: false, modalType: null, id: null });
  };

  const onModifyTitle = async () => {
    setModal({ isShow: false, modalType: null, id: null });

    if (modal.modalType === "ModifyTitle") {
      const formData = new FormData();
      formData.append("title", state.editTitleValue);
      const token = localStorage["accessToken"];

      const response = await fetch(`${SERVER_URL}/api/conti/${cid}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        updateState({
          contiData: { ...state.contiData!, title: state.editTitleValue },
        });
        closeModal();
      }
    }
  };

  return (
    <>
      <ModalTitle>어떤 타이틀을 원하시나요?</ModalTitle>
      <TitleEditContainer>
        <TitleEditInput
          value={state.editTitleValue}
          onChange={(e) => updateState({ editTitleValue: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onModifyTitle();
            }
          }}
          autoFocus
        />
        <TitleEditButton onClick={onModifyTitle}>수정하기</TitleEditButton>
      </TitleEditContainer>
    </>
  );
}

export default ModifyTitle;
