import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true
})

export const registerPassword = async (password: string, registration_token: string) => {
  try {
    const body = { password }
    const headers = {
      "Authorization": `Bearer ${registration_token}`
    }

    await apiClient.post("/auth/password", body, {headers});
  } catch (err: unknown) {
    throw new Error("Error al registrar la contraseña");
  }
};
