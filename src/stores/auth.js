import { defineStore } from "pinia";
import api from "../utils/axios"; //Import de  l'instance Axios

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await api.post("/login", { email, password });
        this.token = response.data.token;
        this.user = response.data.user;

        // Stocker les informations utilisateur
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        // Ajouter le token aux requêtes Axios
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } catch (error) {
        console.error("Erreur de connexion :", error.response?.data?.message || error.message);
        throw new Error("Échec de connexion. Vérifiez vos identifiants.");
      }
    },

    logout() {
      this.token = null;
      this.user = null;

      // Supprimer les données stockées
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Supprimer le token des requêtes Axios
      delete api.defaults.headers.common["Authorization"];

      // Redirection après déconnexion
      window.location.href = "/";
    },

    isAuthenticated() {
      return !!this.token; // Retourne true si un token est stocké
    },
    
  },
});
