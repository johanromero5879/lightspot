import { Module } from "vuex";

import { RootState } from "@/store/types";

import { Token } from "@/models/token";
import { Auth } from "@/models/auth";

import { authenticateUser, logout, refreshToken } from "@/services/auth";
import { getToken, saveToken, clearToken } from "@/services/token";

export interface State {
  token: Token | null;
  tokenTimer: number | null;
}

export const auth: Module<State, RootState> = {
  namespaced: true,
  state: {
    token: getToken(),
    tokenTimer: null
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    token: (state) => state.token,
  },
  mutations: {
    setToken(state, token: Token | null) {
      state.token = token;
    },

    setTokenTimer(state, timer: number) {
        state.tokenTimer = timer;
    },
  },
  actions: {
    async login({ commit, dispatch }, user: Auth) {
      const token = await authenticateUser(user);

      saveToken(token);
      commit("setToken", token);
      dispatch("startTokenTimer")
    },

    async logout({ commit, dispatch }) {
      await logout();

      clearToken();
      commit("setToken", null);
      dispatch("clearTokenTimer")
    },

    async fetchToken({ commit, dispatch }) {
      try {
        const token = await refreshToken();

        saveToken(token);
        commit("setToken", token);
      } catch (err) {
        dispatch("logout");
      }
    },

    startTokenTimer({ dispatch }) {
        const expireIn = 15 * 60 * 1000 // 15 minutes
        const timer = setInterval(() => {
            dispatch("fetchToken")
        }, expireIn - 5000)
        dispatch("setTokenTimer", timer)
    },

    setTokenTimer({ commit }, timer) {
        commit("setTokenTimer", timer)
    },

    clearTokenTimer({ state, commit }) {
        if (state.tokenTimer) clearInterval(state.tokenTimer)

        commit("setTokenTimer", null)
    }
  },
};
