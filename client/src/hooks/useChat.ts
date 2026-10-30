import { api, queryKeys } from "@/api";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useMutation, useQueryClient } from "@tanstack/react-query";

class ChatError extends Error {
  status?: number;

  constructor(message?: string, status?: number) {
    super(message ?? "Something went wrong. Please try again.");
    this.status = status;
  }
}

function useSendMessage() {
  const queryClient = useQueryClient();

  const refreshDashboard = () => {
    [
      queryKeys.dashboard.all,
      queryKeys.expenses.all,
      queryKeys.budget.all,
    ].forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
  };

  return useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async ({
      message,
      currency,
      onDelta,
    }: {
      message: string;
      currency: string;
      onDelta: (text: string) => void;
    }): Promise<{ dataChanged: boolean }> => {
      const stream = () =>
        new Promise<{ dataChanged: boolean }>((resolve, reject) => {
          fetchEventSource(`${api.defaults.baseURL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, currency }),
            credentials: "include",
            openWhenHidden: true,
            async onopen(response) {
              if (response.ok) return;
              const body = await response.json().catch(() => null);
              throw new ChatError(body?.message, response.status);
            },
            onmessage(event) {
              const data = JSON.parse(event.data);
              if (event.event === "delta") onDelta(data.text);
              else if (event.event === "done") resolve(data);
              else if (event.event === "error") reject(new ChatError(data.message));
            },
            onclose() {
              throw new ChatError();
            },
            onerror(error) {
              reject(error);
              throw error;
            },
          });
        });

      try {
        return await stream();
      } catch (error) {
        if (!(error instanceof ChatError) || error.status !== 401) throw error;
        await api.post("/auth/refresh-token");
        return stream();
      }
    },
    onSuccess: (data) => {
      if (data.dataChanged) refreshDashboard();
    },
    onError: () => {
      refreshDashboard();
    },
  });
}

function useClearChat() {
  return useMutation({
    mutationKey: ["clearChat"],
    mutationFn: async () => {
      await api.delete("/chat");
    },
  });
}

export { useSendMessage, useClearChat };
