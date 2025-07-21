import { useModalContext } from "@/hooks";
import {
  UpsertExpenseModal,
  AddGoalModal,
  DeleteExpenseModal,
  EditBudgetModal,
  EditGoalModal,
} from "@/components";

export default function ModalContainer() {
  const { modalType, modalProps, closeModal } = useModalContext();

  if (!modalType) return null;

  const modalMap = {
    UPSERT_EXPENSE: <UpsertExpenseModal {...modalProps} onClose={closeModal} />,
    DELETE_EXPENSE: <DeleteExpenseModal {...modalProps} onClose={closeModal} />,
    EDIT_BUDGET: <EditBudgetModal {...modalProps} onClose={closeModal} />,
    ADD_GOAL: <AddGoalModal {...modalProps} onClose={closeModal} />,
    EDIT_GOAL: <EditGoalModal {...modalProps} onClose={closeModal} />,
  };

  return modalMap[modalType] || null;
}
