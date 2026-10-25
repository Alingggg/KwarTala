import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api, queryKeys } from "@/api";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";

interface QueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const EXCLUDED_REFRESH_PATHS = [
  "/auth/me",
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/verify-email",
  "/auth/change-username",
  "/auth/change-email",
  "/auth/reset-password",
];

function useApiInterceptor(queryClient: QueryClient) {
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        const shouldExcludeRefresh = EXCLUDED_REFRESH_PATHS.some((path) =>
          originalRequest?.url?.includes(path)
        );

        if (
          error.response?.status === 401 &&
          !originalRequest?._retry &&
          !shouldExcludeRefresh
        ) {
          if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => api(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            await api.post("/auth/refresh-token");

            processQueue(null);
            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError as AxiosError);

            queryClient.setQueryData(queryKeys.auth.me(), null);

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [queryClient]);
}

export default useApiInterceptor;
