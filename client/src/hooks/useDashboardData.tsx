import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

function useHomeData() {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      const response = await api("/dashboard/home");
      return response.data.data;
    },
  });
}

export { useHomeData };
