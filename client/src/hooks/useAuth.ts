import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys } from "@/api";
import { useNavigate } from "react-router";

function useRegister() {
  return useMutation({
    mutationFn: async (data: {
      userName: string;
      email: string;
      password: string;
    }) => {
      await api.post("/auth/register", data);
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
      return userResponse.data.data;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(queryKeys.auth.me(), userData);
      navigate("/home");
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
      queryClient.setQueryData(queryKeys.auth.me(), null);
    },
  });
}

function useUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
    retry: false,
  });
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
  });
}

function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      await api.post("/auth/reset-password", data);
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
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

function useCheckHasToReLogIn(isAuthenticated: boolean) {
  const { data, isLoading: isQueryLoading } = useQuery({
    queryKey: queryKeys.auth.hasToReLogIn(),
    queryFn: async () => {
      const response = await api.post("/auth/has-to-re-login");
      return response.data;
    },
    enabled: isAuthenticated,
  });

  return { hasToReLogIn: data?.hasToReLogIn, isLoading: isQueryLoading };
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
  useCheckHasToReLogIn,
};
