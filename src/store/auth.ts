import { Module } from "vuex";

import { RootState } from "@/store/types"

import { Token } from "@/models/token"
import { Auth } from "@/models/auth"

import { authenticateUser, logout } from "@/services/auth"
import { getToken, saveToken, clearToken } from "@/services/token"

export interface State {
    isAuthenticated: boolean
    token: Token | null
}

export const authModule: Module<State, RootState> = {
    namespaced: true,
    state: {
        isAuthenticated: !!getToken(),
        token: getToken()
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        token: (state) => state.token
    },
    mutations: {
        setAuthenticated(state, isAuthenticated: boolean) {
            state.isAuthenticated = isAuthenticated
        },
        setToken(state, token: Token | null) {
            state.token = token
        }
    },
    actions: {
        async login({ commit }, user: Auth) {
            const token = await authenticateUser(user)
            
            saveToken(token)
            commit("setAuthenticated", true)
            commit("setToken", token)
        },
        async logout({ commit }) {
            await logout()

            clearToken()
            commit("setAuthenticated", false)
            commit("setToken", null)
        }
    }
}