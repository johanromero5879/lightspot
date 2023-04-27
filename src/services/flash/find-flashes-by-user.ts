import apiClient from "@/plugins/api-client";

import { getAxiosError } from "@/services/error-handler"

enum TimePeriod {
    WEEK = "week",
    DAY = "day",
    HOUR = "hour"
}

export const findFlashesByUser = async (timePeriod: TimePeriod) => {
  try {
    const { data } = await apiClient.get(`/flashes/${timePeriod}`);
    return data;
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al buscar registros de flashes");
    const {status, detail} = error
    
    if (detail) throw new Error(detail);
  }
};
