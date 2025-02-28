<template>
    <div class="container mt-4">

        <h2 class="text-center mb-4">Tableau de Bord</h2>

        <!-- Gestion du chargement -->
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
        </div>

        <!-- Affichage des erreurs -->
        <div v-if="error" class="alert alert-danger text-center">
            {{ error }}
        </div>

        <!-- Statistiques des tâches -->
        <div v-else class="row">
            <div class="col-md-4">
                <div class="card text-white bg-success mb-3 shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title">Tâches Terminées</h5>
                            <p class="card-text fs-3 fw-bold">{{ stats.completed }}</p>
                        </div>
                        <i class="bi bi-check-circle-fill fs-1"></i>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-warning mb-3 shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title">Tâches en Cours</h5>
                            <p class="card-text fs-3 fw-bold">{{ stats.inProgress }}</p>
                        </div>
                        <i class="bi bi-hourglass-split fs-1"></i>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-danger mb-3 shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title">Tâches en Attente</h5>
                            <p class="card-text fs-3 fw-bold">{{ stats.pending }}</p>
                        </div>
                        <i class="bi bi-exclamation-circle-fill fs-1"></i>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import api from "../utils/axios";
import { ref, onMounted } from "vue";

export default {
    setup() {
        const stats = ref({ completed: 0, inProgress: 0, pending: 0 });

        const loading = ref(true);
        const error = ref(null);

        //Fonction de filtrage
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/tasks"); // Utilisation de la route avec le token dynamiquement !
                const tasks = response.data;
                stats.value.completed = tasks.filter((t) => t.status === "terminé").length;
                stats.value.inProgress = tasks.filter((t) => t.status === "en cours").length;
                stats.value.pending = tasks.filter((t) => t.status === "en attente").length;
            } catch (err) {
                error.value = "Impossible de récupérer les données. Veuillez réessayer.";
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchDashboardData);

        return { stats, loading, error };
    },

};
</script>

<style scoped>
/* Styles des cartes */
.card {
    border-radius: 10px;
}

/* Icônes Bootstrap 5 dans les cartes */
.card-body i {
    opacity: 0.8;
}

/* Ombre légère sur les cartes */
.shadow-sm {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}
</style>
