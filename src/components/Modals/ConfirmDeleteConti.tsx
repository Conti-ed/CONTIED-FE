import React from "react";
import { ModalButton, ModalTitle } from "../../styles/Modal.styles";
import { useRecoilState } from "recoil";
import { modalAtom } from "../../atoms";
import { SERVER_URL } from "../../api";
import { useNavigate } from "react-router-dom";

type props = {
  id: { cid: string | undefined; uid: string | undefined };
};

function ConfirmDeleteConti({ id }: props) {
  const navigate = useNavigate();
  const { cid } = id;
  const [modal, setModal] = useRecoilState(modalAtom);

  const closeModal = () => {
    setModal({ isShow: false, modalType: null, id: null });
  };

  const handleConfirmDelete = async () => {
    if (modal.modalType === "ConfirmDeleteConti" && modal.id !== null) {
      const token = localStorage["accessToken"];
      const res = await fetch(`${SERVER_URL}/api/conti/${cid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        navigate("/");
        closeModal();
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
export default ConfirmDeleteConti;
