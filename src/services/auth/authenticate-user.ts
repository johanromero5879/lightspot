import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

import { Auth } from "@/models/auth";
import { Token } from "@/models/token";

export const authenticateUser = async (user: Auth): Promise<Token> => {
  try {
    const { data } = await apiClient.post("/auth/token", user);
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const {data, status} = err.response!

      if (status === 401) throw new Error("Las credenciales no son validas")
      if(data?.detail) throw new Error(data.detail)
    }

    throw new Error("Error al autenticar usuario");
  }
};
