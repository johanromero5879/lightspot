import apiClient from "@/plugins/api-client";

import { getAxiosError } from "@/services/error-handler"

import { getQuery } from "@/services/flash";

export const getInsights = async (filters: any) => {
  try {
    const query = getQuery(filters)
    
    const { data } = await apiClient.get("/flashes/insights", {
      params: query,
    });

    return data;
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al buscar registros de flashes");

    const {status, detail} = error

    if (status === 404) throw new Error("No se encontraron registros de flashes");

    if (detail) throw new Error(detail);
  }
};
