import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

import { getQuery } from "@/services/flash";

export const getInsights = async (filters: any) => {
  try {
    const query = getQuery(filters)
    
    const { data } = await apiClient.get("/flashes/insights", {
      params: query,
    });

    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const data = err.response?.data;
      if (data?.detail) throw new Error(data.detail);
    }

    throw new Error("Error al buscar registros de flashes");
  }
};
