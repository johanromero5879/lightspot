import { Module } from "vuex";

import { RootState } from "@/store/types";

import { Token } from "@/models/token";
import { Auth } from "@/models/auth";

import { authenticateUser, logout, refreshToken } from "@/services/auth";
import { getToken, saveToken, clearToken } from "@/services/token";

export interface State {
  token: Token | null;
}

export const auth: Module<State, RootState> = {
  namespaced: true,
  state: {
    token: getToken(),
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    token: (state) => state.token,
  },
  mutations: {
    setToken(state, token: Token | null) {
      state.token = token;
    },
  },
  actions: {
    async login({ commit, dispatch }, user: Auth) {
      const token = await authenticateUser(user);

      saveToken(token);
      commit("setToken", token);
      dispatch("startTokenTimer");
    },

    async logout({ commit }) {
      await logout();

      // dispatch("clearTokenTimer");

      clearToken();
      commit("setToken", null);

      commit("user/setCurrentUser", null, { root: true });
    },

    async fetchToken({ commit, dispatch }) {
      try {
        const token = await refreshToken();

        saveToken(token);
        commit("setToken", token);

        dispatch("startTokenTimer")
      } catch (err: any) {
        dispatch("logout");
      }
    },

    startTokenTimer({ dispatch }) {
      const expireIn = 15 * 60 * 1000; // 15 minutes
      setTimeout(() => {
        dispatch("fetchToken");
      }, expireIn - 5000);
    },

    // setTokenTimer({ commit }, timer) {
    //   commit("setTokenTimer", timer);
    // },

    // clearTokenTimer({ state, commit }) {
    //   if (state.tokenTimer) clearInterval(state.tokenTimer);

    //   commit("setTokenTimer", null);
    // },
  },
};
