<template>
  <div>
    <!-- Barre de navigation -->

    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-secondary shadow">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">

              <!--  si l'utilisateur est connecté -->
              <li class="nav-item" v-if="isAuthenticated">
                <router-link class="nav-link" :to="{ name :'dashboard' }">
                  <i class="bi bi-speedometer2"></i> Tableau de Bord
                </router-link>
              </li>
              <li class="nav-item" v-if="isAuthenticated">
                <router-link class="nav-link" :to="{ name:'tasks'}">
                  <i class="bi bi-card-checklist"></i> Tâches
                </router-link>
              </li>
            </ul>

            <!-- Boutons de connexion et déconnexion -->
            <button class="btn btn-outline-light" v-if="isAuthenticated" @click="logout">
              <i class="bi bi-box-arrow-right"></i> Déconnexion
            </button>

          </div>
        </div>
      </nav>
    </header>


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

header {
  line-height : 1.5;
  max-height : 100vh;
}

/* Ombre sous la barre de navigation */
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Meilleure apparence des boutons */
/* .btn-outline-light:hover {
  background-color: #fff;
  color: #333;
} */

/* Alignement du texte dans la navbar */
/* .nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
} */
</style>
