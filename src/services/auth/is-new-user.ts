import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

export const isNewUser = async (registration_token: string): Promise<boolean> => {
  try {
    const { data: isNew } = await apiClient.get("/auth/registration", {
        headers: {
            "Authorization": `Bearer ${registration_token}`
        }
    });
    
    return isNew;
  } catch (err: unknown) {
    return false;
  }
};
