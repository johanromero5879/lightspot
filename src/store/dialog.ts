import { Module } from "vuex";
import { RootState } from "@/store/types";

interface State {
  show: boolean;
  title: string;
  message: string;
  type: string;
  confirm: Function | null;
}

export const dialog: Module<State, RootState> = {
  namespaced: true,
  state: {
    show: false,
    title: "",
    message: "",
    type: "info",
    confirm: null,
  },
  getters: {
    show: (state) => state.show,
    title: (state) => state.title,
    message: (state) => state.message,
    type: (state) => state.type,
    isConfirm: (state) => !!state.confirm
  },
  mutations: {
    setShow(state, show: boolean) {
      state.show = show;
    },
    setTitle(state, title: string) {
      state.title = title;
    },
    setMessage(state, message: string) {
      state.message = message;
    },
    setType(state, type: string) {
      state.type = type;
    },
    setConfirm(state, confirm: Function | null) {
      state.confirm = confirm;
    },
  },
  actions: {
    openDialog({ commit }, { title, message, confirm, type }) {
      commit("setTitle", title);
      commit("setMessage", message);
      if (!!type) {
        commit("setType", type);
      }
      commit("setConfirm", confirm);
      
      commit("setShow", true);
    },

    close({ commit }) {
      commit("setShow", false);

      commit("setTitle", "");
      commit("setMessage", "");
      commit("setType", "info");
      commit("setConfirm", null);
    },
    
    confirm({ state, dispatch }) {
      if (typeof state.confirm === "function") {
        state.confirm();
      }
      dispatch("close");
    },
  },
};
