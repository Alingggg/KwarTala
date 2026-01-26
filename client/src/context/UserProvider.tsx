import { useUser } from "@/hooks";
import type { User } from "@/types";
import { createContext, type ReactNode } from "react";

interface UserContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser();

  return (
    <UserContext.Provider value={{ user, isAuthenticated: !!user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
