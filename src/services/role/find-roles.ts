import apiClient from "@/plugins/api-client"
import { Role } from "@/models/role"

export const findRoles = async (): Promise<Role[]> => {
    try {
        const { data: roles } = await apiClient.get("/roles")
        return roles;
    } catch (err: unknown) {
        throw Error("Error al cargar los roles")
    }
}