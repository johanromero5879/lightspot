import { AxiosError } from "axios";
import axios from "@/plugins/axios";

import { User } from "@/models/user";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await axios.get("/users/me");
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const { detail } = err.response?.data;
      throw new Error(detail);
    }

    throw new Error("Failed to find current user");
  }
};