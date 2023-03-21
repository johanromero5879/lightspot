import axios from "@/plugins/axios"

export const logout = async () => {
    await axios.delete("/auth/token")
}