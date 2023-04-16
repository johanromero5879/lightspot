import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

import { UserIn } from "@/models/user";

export const registerUser = async (user: UserIn) => {
  try {
    await apiClient.post("/users", user);
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
        const { data, status } = err.response!

        if (status === 409) throw new Error("El correo ya se encuentra en uso")
        if (status === 400) throw new Error("El rol no existe"
        )
        throw new Error(data.detail);
    }

    throw new Error("Error al registrar usuario");
  }
};