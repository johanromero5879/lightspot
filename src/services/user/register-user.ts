import apiClient from "@/plugins/api-client";

import { getAxiosError } from "@/services/error-handler"
import { UserIn } from "@/models/user";

export const registerUser = async (user: UserIn) => {
  try {
    await apiClient.post("/users", user);
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al registrar usuario");
    const {status, detail} = error
    
    if (status === 409) throw new Error("El correo ya se encuentra en uso")
    if (status === 400) throw new Error("El rol no existe")
    if (detail) throw new Error(detail);
  }
};