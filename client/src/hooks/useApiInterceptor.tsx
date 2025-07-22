import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "@/api";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

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

function useApiInterceptor(queryClient: QueryClient) {
  useEffect(() => {
    // Set up the response interceptor with access to queryClient
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest?._retry) {
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
            await axios.post(
              `${BASE_URL}/auth/refresh-tokens`,
              {},
              { withCredentials: true }
            );

            processQueue(null);
            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError as AxiosError);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup function to remove interceptor when component unmounts
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [queryClient]);
}

export default useApiInterceptor;
