import styled from "styled-components";
// import { ModalButton, ModalTitle } from "../../styles/Modal.styles";
import { useQuery } from "react-query";
import { SERVER_URL, getConti, getMyConties } from "../../api";
import { ContiType, SongType } from "../../types";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalAtom } from "../../atoms";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../styles/LoadingSpinner";
import React from "react";

const ContiList = styled.ul`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  color: black;
  min-width: 200px;
  max-height: 180px;
  gap: 10px;
  margin-bottom: 20px;
`;

const ContiItem = styled.li<{ selected: boolean; $exists: boolean }>`
  padding: 10px 10px;
  border-radius: 10px;
  transition: background-color 0.2s, font-weight 0.2s;
  font-size: 15px;
  text-align: left;
  background-color: ${({ selected, $exists }) =>
    $exists ? "lightcoral" : selected ? "#e9f5ff" : "transparent"};
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  cursor: pointer;
  &:hover {
    background-color: ${({ $exists }) =>
      $exists ? "lightcoral" : "lightgray"};
    font-weight: bold;
  }
`;

const ErrorMessage = styled.div`
  padding: 0px 10px;
  color: red;
  font-size: 12px;
  font-weight: bold;
  text-align: left;
`;

function AddToMyConti() {
  const navigate = useNavigate();
  const [contiToAdd, setContiToAdd] = useState<ContiType>(null);
  const [existingSongContiId, setExistingSongContiId] = useState<number | null>(
    null
  );
  const [modal, setModal] = useRecoilState(modalAtom);
  const { data, isLoading } = useQuery<ContiType[]>(["myConti"], {
    queryFn: getMyConties,
  });

  const closeModal = () => {
    setModal({ isShow: false, modalType: null, id: null });
  };

  const isSongAlreadyInConti = async (
    contiId: number,
    songId: number
  ): Promise<boolean> => {
    if (!data) return false;
    try {
      const contiDetailsPromises = data.map(() => getConti(contiId));
      const details = await Promise.all(contiDetailsPromises);
      return details.some((detail) =>
        detail.songs.some((song: SongType) => song.id === songId)
      );
    } catch (error) {
      console.error("Error fetching conti details:", error);
      return false;
    }
  };

  const addToConti = async () => {
    if (contiToAdd !== null) {
      const { id: cid } = contiToAdd;
      const alreadyExists = await isSongAlreadyInConti(cid, Number(modal.id));
      if (alreadyExists) {
        setExistingSongContiId(cid);
        return;
      }
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
      {/* <ModalTitle>어떤 콘티에 추가할까요?</ModalTitle> */}
      <hr></hr>
      {isLoading ? (
        <LoadingSpinner color="#E61414" />
      ) : (
        <ContiList>
          {data
            ?.slice()
            .reverse()
            .map((conti, i) => (
              <React.Fragment key={i}>
                <ContiItem
                  key={i}
                  onClick={() => {
                    setContiToAdd(conti);
                    setExistingSongContiId(null);
                  }}
                  selected={contiToAdd?.id === conti!.id}
                  $exists={existingSongContiId === conti!.id}
                >
                  {conti?.title}
                </ContiItem>
                {existingSongContiId === conti!.id && (
                  <ErrorMessage>이미 콘티에 있는 곡이에요.</ErrorMessage>
                )}
              </React.Fragment>
            ))}
        </ContiList>
      )}
      <div>
        {/* <ModalButton onClick={addToConti}>추가하기</ModalButton>
        <ModalButton onClick={closeModal}>취소</ModalButton> */}
      </div>
    </>
  );
}

export default AddToMyConti;
