<template>
  <div>
    <!-- Barre de navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-secondary fixed-top shadow">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i class="bi bi-kanban me-2"></i> GESTION DE TÂCHES
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">

            <!--  si l'utilisateur est connecté -->
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/dashboard">
                <i class="bi bi-speedometer2"></i> Tableau de Bord
              </router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/tasks">
                <i class="bi bi-card-checklist"></i> Tâches
              </router-link>
            </li>
          </ul>

          <!-- Boutons de connexion et déconnexion -->
          <button class="btn btn-outline-light" v-if="isAuthenticated" @click="logout">
            <i class="bi bi-box-arrow-right"></i> Déconnexion
          </button>
          <router-link v-else to="/login" class="btn btn-light">
            <i class="bi bi-box-arrow-in-right"></i> Connexion
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "./stores/auth";
import { computed } from "vue";

export default {
  setup() {
    const authStore = useAuthStore();

    // Vérifie si l'utilisateur est connecté
    const isAuthenticated = computed(() => authStore.isAuthenticated());

    const logout = () => {
      authStore.logout();
    };

    return { isAuthenticated, logout };
  },
};
</script>

<style scoped>
/* Ombre sous la barre de navigation */
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Meilleure apparence des boutons */
.btn-outline-light:hover {
  background-color: #fff;
  color: #333;
}

/* Alignement du texte dans la navbar */
.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
