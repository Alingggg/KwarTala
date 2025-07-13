import { ModalContainer } from "@/components";
import { createContext, useState } from "react";

type ModalType =
  | "ADD_EXPENSE"
  | "EDIT_EXPENSE"
  | "DELETE_EXPENSE"
  | "EDIT_BUDGET"
  | "ADD_GOAL"
  | "EDIT_GOAL"
  | null;

interface ModalContextType {
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
  modalType: ModalType;
  modalProps: any;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export function ModalProvider({ children }: { children: any }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<any>(null);

  const openModal = (type: ModalType, props?: any) => {
    setModalType(type);
    setModalProps(props || {});
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalProps, openModal, closeModal }}
    >
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  );
}
