import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";


export const removeFlashesLastDay = async (file: string | null = null) => {
  try {
    let params = {}

    if (!!file) {
      params = {file}
    }

    await apiClient.delete(`/flashes/last-day`, { params });
    
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const data = err.response?.data;
      if(data?.detail) throw new Error(data.detail)
    }

    throw new Error("No se encontraron flashes");
  }
};
