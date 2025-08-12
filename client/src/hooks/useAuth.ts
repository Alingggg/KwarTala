import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { useNavigate } from "react-router";

function useRegister() {
  return useMutation({
    mutationFn: async (data: {
      userName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      await api.post("/auth/register", data);
    },
    onError: (error: any) => {
      console.error("Registration failed:", error?.response?.data?.message);
    },
  });
}

function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      await api.post("/auth/login", credentials);
      const userResponse = await api.get("/auth/me");
      return userResponse.data;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["me"], userData);
      navigate("/home");
    },
    onError: (error: any) => {
      console.error("Login failed:", error?.response?.data?.message);
    },
  });
}

function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
    },
    onError: (error: any) => {
      console.error("Logout failed:", error?.response?.data?.message);
    },
  });
}

function useUser() {
  const {
    data: user,
    isError,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data;
    },
    staleTime: 1000 * 60 * 15,
  });

  if (isError) {
    console.error(
      "Failed to fetch user data:",
      (error as any)?.response?.data?.message
    );
  }

  return {
    id: user?.id,
    userName: user?.userName,
    email: user?.email,
    isAuthenticated: !!user,
  };
}

function useGetVerificationEmail() {
  return useMutation({
    mutationFn: async ({
      email,
      type,
      newEmail,
    }: {
      email: string;
      type: "register" | "change-email" | "reset-password";
      newEmail?: string;
    }) => {
      await api.post("/auth/verification-email", { email, type, newEmail });
    },
    onError: (error: any) => {
      console.error(
        "Failed to send verification email:",
        error?.response?.data?.message
      );
    },
  });
}

function useVerifyEmail() {
  return useMutation({
    mutationFn: async ({
      token,
      newEmail,
    }: {
      token: string;
      newEmail?: string;
    }) => {
      await api.post("/auth/verify-email", { token, newEmail });
    },
    onError: (error: any) => {
      console.error(
        "Email verification failed:",
        error?.response?.data?.message
      );
    },
  });
}

function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      await api.post("/auth/reset-password", data);
    },
    onError: (error: any) => {
      console.error("Password reset failed:", error?.response?.data?.message);
    },
  });
}

function useEditUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userName: string) => {
      await api.post("/auth/change-username", { userName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      console.error("Username change failed:", error?.response?.data?.message);
    },
  });
}

export {
  useRegister,
  useLogin,
  useLogout,
  useUser,
  useGetVerificationEmail,
  useVerifyEmail,
  useResetPassword,
  useEditUsername,
};
