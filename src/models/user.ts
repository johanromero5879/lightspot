import { Role } from "@/models/role"

export interface User {
    _id: string
    fullname: string
    email: string
    role: Role | string
}

export type UserIn = Omit<User, "_id">
