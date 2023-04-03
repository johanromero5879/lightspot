import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

import { FlashQuery } from "@/services/flash";
import { getCurrentUTCOffset } from "@/utils/utc-checker"

export const getInsights = async (query: FlashQuery) => {
  try {
    const { data } = await apiClient.get("/flashes/insights", {
      params: {
        ...query,
        country: "CO",
        utc_offset: getCurrentUTCOffset(),
      },
    });

    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const { detail } = err.response?.data;
      throw new Error(detail);
    }

    throw new Error("Failed to get flashes");
  }
};
