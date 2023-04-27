import apiClient from "@/plugins/api-client";

import { getAxiosError } from "@/services/error-handler"

export const removeFlashesLastDay = async (file: string | null = null) => {
  try {
    let params = {}

    if (!!file) {
      params = {file}
    }

    await apiClient.delete(`/flashes/last-day`, { params });
    
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al buscar registros de flashes");
    const {status, detail} = error
    
    if (detail) throw new Error(detail);
  }
};
