<template>
    <div class="container mt-3">
        <h2>Gestion des Tâches</h2>

        <!-- Messages de succès -->
        <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ successMessage }}
            <button type="button" class="btn-close" @click="successMessage = ''"></button>
        </div>

        <!-- Formulaire de création -->
        <form @submit.prevent="createTask" class="mb-4">
            <div class="row">
                <div class="col-md-4">
                    <input v-model="newTask.title" class="form-control" placeholder="Titre de la tâche" required />
                </div>
                <div class="col-md-4">
                    <input v-model="newTask.description" class="form-control" placeholder="Description" />
                </div>
                <div class="col-md-2">
                    <select v-model="newTask.status" class="form-select">
                        <option value="en attente">En attente</option>
                        <option value="en cours">En cours</option>
                        <option value="terminé">Terminé</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-primary w-100" type="submit">Ajouter</button>
                </div>
            </div>
        </form>

        <!-- Barre de recherche et filtre -->
        <div class="mb-3 d-flex">
            <input v-model="searchQuery" class="form-control me-2" placeholder="Rechercher par titre"
                @input="fetchTasks" />
            <select v-model="statusFilter" class="form-select w-auto" @change="fetchTasks">
                <option value="">Tous</option>
                <option value="en attente">En attente</option>
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
            </select>
        </div>

        <!-- Liste des tâches -->
        <table class="table table-bordered table-hover">
            <thead>
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
                        <select v-model="task.status" class="form-select" @change="updateTask(task)">
                            <option value="en attente">En attente</option>
                            <option value="en cours">En cours</option>
                            <option value="terminé">Terminé</option>
                        </select>
                    </td>
                    <td>
                        <div class="d-flex">
                            <a class="btn btn-success me-2" href="#" @click="viewTask(task)">Voir</a>
                            <a class="btn btn-warning me-2" href="#" @click="openEditModal(task)"> Modifier</a>
                            <a class="btn btn-danger " href="#" @click="confirmDelete(task.id)">
                                Supprimer</a>
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modale Lecture & Modification -->
        <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? 'Modifier la tâche' : 'Détails de la tâche' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateTask">
                            <div class="mb-3">
                                <label for="title" class="form-label">Titre</label>
                                <input type="text" id="title" v-model="selectedTask.title" class="form-control"
                                    :disabled="!isEditing" required />
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Description</label>
                                <textarea id="description" v-model="selectedTask.description" class="form-control"
                                    :disabled="!isEditing"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="status" class="form-label">Statut</label>
                                <select id="status" v-model="selectedTask.status" class="form-select"
                                    :disabled="!isEditing">
                                    <option value="en attente">En attente</option>
                                    <option value="en cours">En cours</option>
                                    <option value="terminé">Terminé</option>
                                </select>
                            </div>
                            <button v-if="isEditing" type="submit" class="btn btn-primary w-100">Enregistrer</button>
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
                        <h5 class="modal-title">Confirmer la suppression</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">Êtes-vous sûr de vouloir supprimer cette tâche ?</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-danger" @click="deleteTask">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, computed, onMounted } from "vue";
import api from "../utils/axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

export default {
    setup() {
        const tasks = ref([]);
        const newTask = ref({ title: "", description: "", status: "en attente" });
        const selectedTask = ref({});
        const isEditing = ref(false);
        const taskToDelete = ref(null);
        const searchQuery = ref("");
        const statusFilter = ref("");
        const successMessage = ref("");

        const hideMessageAfterDelay = () => {
            setTimeout(() => {
                successMessage.value = "";
            }, 3000); // Cache le message après 3 secondes
        };

        const fetchTasks = async () => {
            try {
                //console.log("Recherche en cours :", searchQuery.value); // Vérification
                const response = await api.get("/tasks", {
                    params: {
                        search: searchQuery.value || null, 
                        status: statusFilter.value || null
                    }
                });
                //console.log("Résultats récupérés :", response.data); 
                tasks.value = response.data;
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches :", error);
            }
        };

        const createTask = async () => {
            await api.post("/tasks", newTask.value);
            successMessage.value = " Tâche créée avec succès !";
            fetchTasks();
            newTask.value = { title: "", description: "", status: "en attente" };
            hideMessageAfterDelay();
        };

        const viewTask = (task) => {
            selectedTask.value = { ...task };
            isEditing.value = false;
            new bootstrap.Modal(document.getElementById("taskModal")).show();
        };

        /* Mondal Modification de Tâches */
        const openEditModal = (task) => {
            selectedTask.value = { ...task };
            isEditing.value = true;
            new bootstrap.Modal(document.getElementById("taskModal")).show();
        };
        /*  Modification de Tâches */
        const updateTask = async () => {
            await api.put(`/tasks/${selectedTask.value.id}`, selectedTask.value);
            successMessage.value = "Tâche modifiée avec succès !";
            fetchTasks();
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById("taskModal"));
            if (modalInstance) modalInstance.hide();
            hideMessageAfterDelay();
        };

        /* Mondal Suppression de Tâches */
        const confirmDelete = (taskId) => {
            taskToDelete.value = taskId;
            new bootstrap.Modal(document.getElementById("deleteTaskModal")).show();
        };
        /* Suppression de Tâches */
        const deleteTask = async () => {
            await api.delete(`/tasks/${taskToDelete.value}`);
            successMessage.value = "Tâche supprmée avec succès !";
            fetchTasks();
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById("deleteTaskModal"));
            if (modalInstance) modalInstance.hide();
            hideMessageAfterDelay();
        };

        onMounted(fetchTasks);

        return { tasks, newTask, selectedTask, isEditing, searchQuery, statusFilter, fetchTasks, createTask, viewTask, openEditModal, updateTask, confirmDelete, deleteTask };
    },
};
</script>
