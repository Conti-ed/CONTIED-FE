import React from "react";
import { ModalContainer, OverlayModal } from "../styles/Modal.styles";
import { useRecoilState } from "recoil";
import { modalAtom } from "../atoms";
import { useParams } from "react-router-dom";
import ConfirmDeleteSong from "./Modals/ConfirmDeleteSong";
import { ContiDetailState } from "../Routes/ContiDetail";
import ConfirmDeleteConti from "./Modals/ConfirmDeleteConti";
import ModifyKeywords from "./Modals/ModifyKeywords";
import { SERVER_URL } from "../api";
import AddToMyConti from "./Modals/AddToMyConti";

interface IModal {
  state: ContiDetailState;
  setState: React.Dispatch<React.SetStateAction<ContiDetailState>>;
}

function Modal({ state, setState }: IModal) {
  const { id: cid } = useParams();
  const uid = JSON.parse(localStorage["user_info"]).id;
  const [modal, setModal] = useRecoilState(modalAtom);

  const closeModal = async () => {
    setModal({ isShow: false, modalType: null, id: null });

    if (modal.modalType === "ModifyKeywords") {
      const formData = new FormData();
      formData.append("keywords", JSON.stringify(state.contiData?.keywords));
      const token = localStorage["accessToken"];

      try {
        const response = await fetch(`${SERVER_URL}/api/conti/${cid}`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          console.log("Keywords updated successfully", data);
        } else {
          console.error("Failed to update keywords", data);
        }
      } catch (error) {
        console.error("Error updating keywords", error);
      }
    }
  };

  const handleContainerClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <OverlayModal onClick={closeModal}>
      <ModalContainer
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={handleContainerClick}
      >
        {modal.modalType === "ConfirmDeleteSong" ? (
          <ConfirmDeleteSong id={{ uid, cid }} setState={setState} />
        ) : modal.modalType === "ConfirmDeleteConti" ? (
          <ConfirmDeleteConti id={{ cid, uid }} />
        ) : modal.modalType === "ModifyKeywords" ? (
          <ModifyKeywords state={state} setState={setState} />
        ) : modal.modalType === "AddToMyConti" ? (
          <AddToMyConti />
        ) : null}
      </ModalContainer>
    </OverlayModal>
  );
}

export default Modal;
