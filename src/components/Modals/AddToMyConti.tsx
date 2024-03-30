import styled from "styled-components";
import { ModalButton, ModalTitle } from "../../styles/Modal.styles";
import { setFontStyle } from "../../styles/UploadDrawer.styles";
import { useQuery } from "react-query";
import { SERVER_URL, getMyConties } from "../../api";
import { ContiType } from "../../types";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalAtom } from "../../atoms";
import { useNavigate } from "react-router-dom";

const ContiList = styled.ul`
  display: flex;
  overflow: auto;
  flex-direction: column;
  color: black;
  min-width: 200px;
  max-height: 200px;
  gap: 10px;
  margin-bottom: 20px;
`;

const ContiItem = styled.li<{ selected: boolean }>`
  ${setFontStyle}
  padding: 10px 20px;
  border-radius: 10px;
  transition: 0.2s background-color;
  font-size: 15px;
  text-align: left;
  background-color: ${({ selected }) => (selected ? "#e9f5ff" : "transparent")};
  cursor: pointer;
  &:hover {
    background-color: lightgray;
  }
`;

function AddToMyConti() {
  const navigate = useNavigate();
  const [contiToAdd, setContiToAdd] = useState<ContiType>(null);
  const [modal, setModal] = useRecoilState(modalAtom);
  const { data, isLoading } = useQuery<ContiType[]>(["myConti"], {
    queryFn: getMyConties,
  });

  const closeModal = () => {
    setModal({ isShow: false, modalType: null, id: null });
  };

  const addToConti = async () => {
    if (contiToAdd !== null) {
      const { id: cid } = contiToAdd;
      const token = localStorage["accessToken"];
      const res = await fetch(
        `${SERVER_URL}/api/conti-song?cid=${cid}&sid=${modal.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setModal({ isShow: false, modalType: null, id: null });
        navigate(`/conti/${cid}`);
      }
    }
  };

  return (
    <>
      <ModalTitle>내 콘티</ModalTitle>
      <hr></hr>
      {isLoading ? (
        "로딩중..."
      ) : (
        <ContiList>
          {data?.map((conti, i) => (
            <ContiItem
              key={i}
              onClick={() => setContiToAdd(conti)}
              selected={contiToAdd?.id === conti!.id}
            >
              {conti?.title}
            </ContiItem>
          ))}
        </ContiList>
      )}
      <div>
        <ModalButton onClick={addToConti}>추가하기</ModalButton>
        <ModalButton onClick={closeModal}>취소</ModalButton>
      </div>
    </>
  );
}

export default AddToMyConti;
