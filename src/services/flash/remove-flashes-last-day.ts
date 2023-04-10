import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";


export const removeFlashesLastDay = async () => {
  try {
    await apiClient.delete(`/flashes/last-day`);
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const data = err.response?.data;
      if(data?.detail) throw new Error(data.detail)
    }

    throw new Error("No se encontraron flashes");
  }
};
