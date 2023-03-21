import { AxiosError } from "axios"
import axios from "@/plugins/axios"

import { Auth } from "@/models/auth"
import { Token } from "@/models/token"

export const authenticateUser = async (user: Auth): Promise<Token> => {
    try {
        const { data } = await axios.post("/auth/token", user)
        return data
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
            const { detail } = err.response?.data
            throw new Error(detail)
        }
        
        throw new Error("Failed to authenticate user")
      }
}