import { UserContext } from "@/context";
import { useContext } from "react";

function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
}

export default useUserContext;
