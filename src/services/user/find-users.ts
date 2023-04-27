import apiClient from "@/plugins/api-client";

import { getAxiosError } from "@/services/error-handler"
import { User } from "@/models/user";

interface UserList {
  total: number,
  users: User[]
}

export const findUsers = async (limit: number, page: number) => {
  try {
    const { data } = await apiClient.get("/users", {
      params: {limit, page}
    });
    return data;
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al cargar usuarios");
    const {status, detail} = error
    
    if (status === 401 || status === 403) throw new Error("No tiene permisos para ver usuarios");
    if (detail) throw new Error(detail);

  }
};