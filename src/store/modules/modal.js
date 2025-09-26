// store/modal.js
const state = () => ({
  visible: false,
  component: null,
  props: {},
});

const mutations = {
  SHOW_MODAL(state, { component, props }) {
    state.visible = true;
    state.component = component;
    state.props = props || {};
  },
  HIDE_MODAL(state) {
    state.visible = false;
    state.component = null;
    state.props = {};
  },
};

const actions = {
  openModal({ commit }, payload) {
    commit("SHOW_MODAL", payload);
  },
  closeModal({ commit }) {
    commit("HIDE_MODAL");
  },
};

const getters = {
  isVisible: (state) => state.visible,
  modalComponent: (state) => state.component,
  modalProps: (state) => state.props,
};

export default { namespaced: true, state, mutations, actions, getters };
