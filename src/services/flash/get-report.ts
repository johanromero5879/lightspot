import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

import { getQuery } from "@/services/flash";

export const getReport = async (filters: any) => {
    try {
      const query = getQuery(filters)
  
      const { data } = await apiClient.get("/flashes/reports", {
        params: query
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