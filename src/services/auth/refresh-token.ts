import { AxiosError } from "axios"
import apiClient from "@/plugins/api-client"

import { getAxiosError } from "@/services/error-handler";

export const refreshToken = async () => {
    try {
        const { data } = await apiClient.post("/auth/token/refresh")

        return data
      } catch (error: any) {
        error = getAxiosError(error)
        if (!error) throw new Error("Error al autenticar usuario");

        const {status, detail} = error

        if (detail) throw new Error(detail);
      }
}