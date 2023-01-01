import request from "@/http/request";

const state = {
  resetToken: null,
  resetEmail: null,
  codeVerified: false,
};

const mutations = {
  SET_RESET_TOKEN(state, token) {
    state.resetToken = token;
  },
  SET_RESET_EMAIL(state, email) {
    state.resetEmail = email;
  },
  SET_CODE_VERIFIED(state, verified) {
    state.codeVerified = verified;
  },
  CLEAR_RESET_DATA(state) {
    state.resetToken = null;
    state.resetEmail = null;
    state.codeVerified = false;
  },
};

const actions = {
  async requestReset({ commit }, email) {
    try {
      const response = await request.post("/api/password-reset/request", {
        email,
      });

      if (response.data.success) {
        commit("SET_RESET_EMAIL", email);
        // 🔥 IMPORTANT : Stocker le token si retourné
        if (response.data.token) {
          commit("SET_RESET_TOKEN", response.data.token);
        }
      }
      return response.data;
    } catch (error) {
      console.error("Erreur demande reset:", error);
      throw error;
    }
  },

  async verifyCode({ commit, state }, { token, code }) {
    try {
      const response = await request.post("/api/password-reset/verify-code", {
        token: token || state.resetToken, // Utiliser le token passé ou celui du state
        code: code,
      });

      if (response.data.success) {
        commit("SET_CODE_VERIFIED", true);
        commit("SET_RESET_TOKEN", token); // Mettre à jour le token
      }
      return response.data;
    } catch (error) {
      console.error("Erreur vérification code:", error);
      throw error;
    }
  },

  async resetPassword({ state }, passwords) {
    const response = await request.post("/api/password-reset/reset", {
      token: state.resetToken,
      ...passwords,
    });
    return response.data;
  },
};

const getters = {
  isCodeVerified: (state) => state.codeVerified,
  resetEmail: (state) => state.resetEmail,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
