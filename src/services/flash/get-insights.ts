import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

import { FlashQuery } from "@/services/flash";

export const getInsights = async ({
  start_date,
  end_date,
  state,
  city,
  utc_offset,
}: FlashQuery) => {
  try {
    const query = {
      start_date,
      end_date,
      country: "CO",
      utc_offset,
    } as FlashQuery;

    if (!!state) {
      query["state"] = state;
    }

    if (!!city) {
      query["city"] = city;
    }

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
