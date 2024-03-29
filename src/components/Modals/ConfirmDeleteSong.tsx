import React from "react";
import { ModalButton, ModalTitle } from "../../styles/Modal.styles";
import { useRecoilState } from "recoil";
import { modalAtom } from "../../atoms";
import { SERVER_URL } from "../../api";
import { ContiDetailState } from "../../Routes/ContiDetail";

type props = {
  id: { cid: string | undefined; uid: string | undefined };
  setState: React.Dispatch<React.SetStateAction<ContiDetailState>>;
};

function ConfirmDeleteSong({ id, setState }: props) {
  const { cid, uid } = id;
  const [modal, setModal] = useRecoilState(modalAtom);

  const closeModal = () => {
    setModal({ isShow: false, modalType: null, id: null });
  };

  // Confirm Delete Song
  const handleConfirmDelete = async () => {
    if (modal.modalType === "ConfirmDeleteSong" && modal.id !== null) {
      const token = localStorage["accessToken"];
      const res = await fetch(
        `${SERVER_URL}/api/song/${modal.id}?cid=${cid}&uid=${uid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setState((prevState) => ({
          ...prevState,
          songs: prevState.songs.filter((song) => song.id !== modal.id),
          contiData: data,
        }));
      }
    }
  };

  return (
    <>
      <ModalTitle>삭제하시겠습니까?</ModalTitle>
      <div>
        <ModalButton onClick={handleConfirmDelete}>네</ModalButton>
        <ModalButton onClick={closeModal}>아니오</ModalButton>
      </div>
    </>
  );
}
export default ConfirmDeleteSong;
