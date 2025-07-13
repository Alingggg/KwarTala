import { useModalContext } from "@/hooks";
import {
  AddExpenseModal,
  AddGoalModal,
  DeleteExpenseModal,
  EditBudgetModal,
  EditExpenseModal,
  EditGoalModal,
} from "@/components";

export default function ModalContainer() {
  const { modalType, modalProps, closeModal } = useModalContext();

  if (!modalType) return null;

  const modalMap = {
    ADD_EXPENSE: <AddExpenseModal {...modalProps} onClose={closeModal} />,
    EDIT_EXPENSE: <EditExpenseModal {...modalProps} onClose={closeModal} />,
    DELETE_EXPENSE: <DeleteExpenseModal {...modalProps} onClose={closeModal} />,
    EDIT_BUDGET: <EditBudgetModal {...modalProps} onClose={closeModal} />,
    ADD_GOAL: <AddGoalModal {...modalProps} onClose={closeModal} />,
    EDIT_GOAL: <EditGoalModal {...modalProps} onClose={closeModal} />,
  };

  return modalMap[modalType] || null;
}
