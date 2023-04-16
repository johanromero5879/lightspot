import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

import { User } from "@/models/user";

interface UserList {
  total: number,
  users: User[]
}

export const findUsers = async (limit: number, page: number): Promise<UserList> => {
  try {
    const { data } = await apiClient.get("/users", {
      params: {limit, page}
    });
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const { data, status } = err.response!;

      if (status === 401 || status === 403) throw Error("No tiene permisos para ver usuarios")

      throw new Error(data.detail);
    }

    throw new Error("Error al cargar usuarios");
  }
};