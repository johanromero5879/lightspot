import apiClient from "@/plugins/api-client";
import { getQuery } from "@/services/flash"

import { getAxiosError } from "@/services/error-handler"

export const findFlashes = async (filters: any) => {
  try {
    const query = getQuery(filters)

    const { data } = await apiClient.get("/flashes", {
      params: query,
    });
    return data;
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al buscar registros de flashes");
    const {status, detail} = error
    
    if (detail) throw new Error(detail);
  }
};
