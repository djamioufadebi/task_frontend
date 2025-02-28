<template>
    <div class="container mt-2">
        <h2>Mes Tâches</h2>
        <button class="btn btn-success mb-3" @click="fetchTasks">
            <i class="bi bi-arrow-clockwise"></i> Rafraîchir
        </button>

        <table class="table table-bordered shadow-sm">
            <thead class="table-light">
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks" :key="task.id">
                    <td>{{ task.title }}</td>
                    <td>{{ task.description }}</td>
                    <td>
                        <span :class="getStatusClass(task.status)">{{ task.status }}</span>
                    </td>
                    <td>
                        <button class="btn btn-warning btn-sm" @click="openEditModal(task)">
                            <i class="bi bi-pencil-square"></i> Modifier
                        </button>
                        <button class="btn btn-danger btn-sm ms-2" @click="confirmDelete(task.id)">
                            <i class="bi bi-trash"></i> Supprimer
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modale de modification -->
        <div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editTaskLabel">Modifier la tâche</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateTask">
                            <div class="mb-3">
                                <label for="title" class="form-label">Titre</label>
                                <input type="text" id="title" v-model="editedTask.title" class="form-control"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Description</label>
                                <textarea id="description" v-model="editedTask.description"
                                    class="form-control"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="status" class="form-label">Statut</label>
                                <select id="status" v-model="editedTask.status" class="form-select">
                                    <option value="en attente">En attente</option>
                                    <option value="en cours">En cours</option>
                                    <option value="terminé">Terminé</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Enregistrer</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modale de confirmation de suppression -->
        <div class="modal fade" id="deleteTaskModal" tabindex="-1" aria-labelledby="deleteTaskLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteTaskLabel">Confirmer la suppression</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Êtes-vous sûr de vouloir supprimer cette tâche ?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-danger" @click="deleteTask">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "../utils/axios"; 
/* import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";  */
export default {
    setup() {
        const tasks = ref([]);
        const editedTask = ref({ id: null, title: "", description: "", status: "en attente" });
        const taskToDelete = ref(null);

        // Récupérer les tâches
        const fetchTasks = async () => {
            try {
                const response = await api.get("/tasks");
                tasks.value = response.data;
            } catch (error) {
                console.error("Erreur lors du chargement des tâches :", error);
            }
        };

        // Ouvrir la modale pour modifier une tâche
        const openEditModal = (task) => {
            editedTask.value = { ...task };
            new bootstrap.Modal(document.getElementById("editTaskModal")).show();
        };

        // Mettre à jour une tâche
        const updateTask = async () => {
            try {
                await api.put(`/tasks/${editedTask.value.id}`, editedTask.value);
                fetchTasks();
                new bootstrap.Modal(document.getElementById("editTaskModal")).hide();
            } catch (error) {
                console.error("Erreur lors de la mise à jour :", error);
            }
        };

        // Confirmer la suppression
        const confirmDelete = (taskId) => {
            taskToDelete.value = taskId;
            new bootstrap.Modal(document.getElementById("deleteTaskModal")).show();
        };

        // Supprimer une tâche
        const deleteTask = async () => {
            try {
                await api.delete(`/tasks/${taskToDelete.value}`);
                fetchTasks();
                new bootstrap.Modal(document.getElementById("deleteTaskModal")).hide();
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
            }
        };

        // Définir une classe de badge pour les statuts
        const getStatusClass = (status) => {
            return {
                "badge bg-success": status === "terminé",
                "badge bg-warning": status === "en cours",
                "badge bg-danger": status === "en attente",
            };
        };

        onMounted(fetchTasks);

        return { tasks, fetchTasks, editedTask, openEditModal, updateTask, confirmDelete, deleteTask, getStatusClass };
    },
};
</script>

<style scoped>
/* Personnalisation des cartes */
.table {
    border-radius: 10px;
    overflow: hidden;
}

/* Icônes Bootstrap 5 dans les boutons */
.btn i {
    margin-right: 5px;
}

/* Badges de statut */
.badge {
    font-size: 1rem;
    padding: 5px 10px;
}
</style>
