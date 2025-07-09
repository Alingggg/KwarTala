import { useModalContext } from "@/hooks";
import {
  AddExpenseModal,
  DeleteExpenseModal,
  EditBudgetModal,
  EditExpenseModal,
} from "@/components";

export default function ModalContainer() {
  const { modalType, modalProps, closeModal } = useModalContext();

  if (!modalType) return null;

  const modalMap = {
    ADD_EXPENSE: <AddExpenseModal {...modalProps} onClose={closeModal} />,
    EDIT_EXPENSE: <EditExpenseModal {...modalProps} onClose={closeModal} />,
    DELETE_EXPENSE: <DeleteExpenseModal {...modalProps} onClose={closeModal} />,
    EDIT_BUDGET: <EditBudgetModal {...modalProps} onClose={closeModal} />,
  };

  return modalMap[modalType] || null;
}
