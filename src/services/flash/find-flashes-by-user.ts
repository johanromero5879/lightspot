import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

enum TimePeriod {
    WEEK = "week",
    DAY = "day",
    HOUR = "hour"
}

export const findFlashesByUser = async (timePeriod: TimePeriod) => {
  try {
    const { data } = await apiClient.get(`/flashes/${timePeriod}`);
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const data = err.response?.data;
      if(data?.detail) throw new Error(data.detail)
    }

    throw new Error("No se encontraron flashes");
  }
};
