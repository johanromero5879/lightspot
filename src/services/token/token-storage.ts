import { Token } from "@/models/token"

const TOKEN_KEY = "token"

export const getToken = (): Token | null => {
    let token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
        return null
    }

    return JSON.parse(token) 
}

export const saveToken = (token: Token) => {
    localStorage.setItem(
        TOKEN_KEY, 
        JSON.stringify(token)
    )
}

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY)
}