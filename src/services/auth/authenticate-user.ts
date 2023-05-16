import { getAxiosError } from "@/services/error-handler";
import apiClient from "@/plugins/api-client";

import { Auth } from "@/models/auth";

export const authenticateUser = async (user: Auth) => {
  try {
    const { data } = await apiClient.post("/auth/token", user);
    return data;
  } catch (error: any) {
    error = getAxiosError(error)
    if (!error) throw new Error("Error al autenticar usuario");

    const {status, detail} = error
    
    if (status === 401) throw new Error("Las credenciales no son validas")
    if (detail) throw new Error(detail);
  }
};
