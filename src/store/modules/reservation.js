import request from "@/http/request";

const state = () => ({
  all: [],
  one: {},
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
};

const mutations = {
  SET_ALL: (state, obj) => {
    state.all = obj;
  },
  SET_ONE: (state, obj) => {
    state.one = obj;
  },
  UPDATE_ONE: (state, obj) => {
    const index = state.all.findIndex((item) => item.id === obj.id);
    if (index !== -1) {
      state.all[index] = obj;
    }
  },
  DELETE_ONE: (state, id) => {
    state.all = state.all.filter((item) => item.id !== id);
  },
};

const actions = {
  async getAll(cxt, payload) {
    let { data } = await request.get("reservation/all");
    cxt.commit("SET_ALL", data);
    return data;
  },

  async getOne(cxt, id) {
    let { data } = await request.get("reservation/get/" + id);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async create(cxt, payload) {
    let { data } = await request.post("reservation/add", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  async getReservationsByUser(cxt, userId) {
    let { data } = await request.get("reservation/user/get/" + userId);
    cxt.commit("SET_ONE", data);
    return data;
  },
  // Action pour mettre à jour les statuts localement (sans interagir avec le backend)
  updatePaymentStatus(cxt, { reservationId, paymentStatus, status }) {
    // Trouver la réservation à partir de l'id et mettre à jour ses statuts
    const reservation = cxt.state.all.find((r) => r.id === reservationId);
    if (reservation) {
      reservation.paymentStatus = paymentStatus;
      reservation.status = status;
      // Mettre à jour la réservation dans le store
      cxt.commit("SET_ONE", reservation);
    }
  },
  async delete(cxt, id) {
    await request.delete("reservation/delete/" + id);
    cxt.commit("DELETE_ONE", id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
