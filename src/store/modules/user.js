import request from "@/http/request";

const state = () => ({
  all: [],
  one: {},
  uploadedFile: null,
});

const getters = {
  all: (state) => state.all,
  one: (state) => state.one,
  uploadedFile: (state) => state.uploadedFile,
};

const mutations = {
  SET_ALL: (state, obj) => {
    state.all = obj;
  },
  SET_ONE: (state, obj) => {
    state.one = obj;
  },
  SET_UPLOADED_FILE: (state, obj) => {
    state.uploadedFile = obj;
  },
  UPDATE_ONE: (state, updatedItem) => {
    const index = state.all.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      state.all.splice(index, 1, updatedItem);
    }
    // Optionnel : tu peux aussi mettre à jour `state.one`
    state.one = updatedItem;
  },
  DELETE_ONE: (state, id) => {
    state.all = state.all.filter((item) => item.id !== id);
  },
};

const actions = {
  async getAll(cxt, payload) {
    let { data } = await request.get("auth/getUsers");
    cxt.commit("SET_ALL", data);
    return data;
  },
  async getOne(cxt, id) {
    let { data } = await request.get("auth/getUsers/" + id);
    cxt.commit("SET_ONE", data);
    console.log("data reçu à getOne :", data);
    return data;
  },
  async create(cxt, payload) {
    let { data } = await request.post("auth/addUser", payload);
    cxt.commit("SET_ONE", data);
    return data;
  },
  // async update(cxt, payload) {
  //   let { data } = await request.put("auth/updateUser/" + payload);
  //   cxt.commit("UPDATE_ONE", data);
  //   return data;
  // },
  async update({ commit }, payload) {
    try {
      console.log("Payload envoyé à updateUser :", payload);
      const response = await request.put(
        `auth/updateUser/${payload.id}`,
        payload
      );
      commit("UPDATE_ONE", response.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  },
  // async update(cxt, payload) {
  //   const { id, data, photoFile, additionalFiles } = payload;

  //   const formData = new FormData();
  // Ajouter les informations de l'utilisateur
  // for (const key in data) {
  //   formData.append(key, data[key]);
  // }

  // // Ajouter la photo de profil si présente
  // if (photoFile) {
  //   formData.append("photo", photoFile);
  // }

  // // Ajouter des fichiers supplémentaires (si nécessaires)
  // if (additionalFiles && additionalFiles.length) {
  //   additionalFiles.forEach((file) => {
  //     formData.append("fichiers", file);
  //   });
  // }

  // const config = {
  //   headers: {
  //     "Content-Type": "image/jpeg",
  //   },
  // };

  //   const response = await request.put(
  //     `auth/updateUser/${id}`,
  //     formData
  //     // config
  //   );
  //   cxt.commit("UPDATE_ONE", response.data);
  //   return response.data;
  // },
  async assignRole(cxt, { email, roleName }) {
    try {
      const { data } = await request.post(
        "auth/assign-role",
        null, // pas de body, juste des query params
        {
          params: { email, roleName },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      console.error("Erreur lors de l’attribution du rôle :", error);
      throw error;
    }
  },

  async delete(cxt, id) {
    await request.delete("auth/deleteUser/" + id);
    cxt.commit("DELETE_ONE", id);
  },
  async downloadFichier({ commit }, { fichierId }) {
    try {
      const response = await client.get(`fichier/download/${fichierId}`, {
        responseType: "blob",
      });

      const fileUrl = URL.createObjectURL(response.data);
      commit("SET_UPLOADED_FILE", fileUrl);

      return fileUrl;
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      throw error;
    }
  },

  async getAllSousService(cxt, id) {
    let { data } = await request.get("/typeCategorie/categorie/" + id);
    cxt.commit("SET_ALL", data);
    return data;
  },
  // Vérification si un utilisateur existe déjà
  async checkIfUserExists(cxt, email) {
    try {
      const response = await request.get(`auth/checkUser?email=${email}`);
      return response.data.exists; // On s'attend à une réponse avec un champ `exists` qui sera true/false
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur :", error);
      throw error;
    }
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
