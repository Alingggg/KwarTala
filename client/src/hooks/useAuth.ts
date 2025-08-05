import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { useNavigate } from "react-router";

function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: {
      userName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      await api.post("/auth/register", data);
    },
    onSuccess: () => {
      navigate("/login");
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

export { useRegister, useLogin, useLogout, useUser };
