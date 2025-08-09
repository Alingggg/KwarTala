import { useModalContext } from "@/hooks";
import {
  UpsertExpenseModal,
  AddGoalModal,
  DeleteExpenseModal,
  EditBudgetModal,
  EditGoalModal,
  RequestResetPasswordModal,
  EditUsernameModal,
  RequestEditEmailModal,
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
    REQUEST_RESET_PASSWORD: (
      <RequestResetPasswordModal {...modalProps} onClose={closeModal} />
    ),
    EDIT_USERNAME: <EditUsernameModal {...modalProps} onClose={closeModal} />,
    REQUEST_EDIT_EMAIL: (
      <RequestEditEmailModal {...modalProps} onClose={closeModal} />
    ),
  };

  return modalMap[modalType] || null;
}
