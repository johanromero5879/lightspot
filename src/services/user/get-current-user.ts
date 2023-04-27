import apiClient from "@/plugins/api-client";

import { getAxiosError } from "@/services/error-handler"

export const getCurrentUser = async () => {
  try {
    const { data } = await apiClient.get("/users/me");
    return data;
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al cargar el usuario logueado");
    const {status, detail} = error
    
    if (detail) throw new Error(detail);
  }
};