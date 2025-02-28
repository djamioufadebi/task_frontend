<template>
    <div class="container mt-3">
        <h2>Gestion des Tâches</h2>

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
            <input v-model="searchQuery" class="form-control me-2" placeholder="Rechercher par titre" />
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
                <tr v-for="task in filteredTasks" :key="task.id">
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
                        <!-- <button class="btn btn-warning btn-sm" @click="openEditModal(task)">Modifier</button>
                        <button class="btn btn-danger btn-sm ms-2" @click="deleteTask(task.id)">Supprimer</button> -->
                        <!-- Dropdown Bootstrap -->
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle btn-sm" type="button"
                                data-bs-toggle="dropdown">
                                Actions
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" @click="viewTask(task)">Voir</a></li>
                                <li><a class="dropdown-item" href="#" @click="openEditModal(task)">Modifier</a></li>
                                <li><a class="dropdown-item text-danger" href="#" @click="confirmDelete(task.id)">🗑
                                        Supprimer</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
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
    const searchQuery = ref("");
    const statusFilter = ref("");

    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks", { params: { search: searchQuery.value, status: statusFilter.value } });
        tasks.value = response.data;
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    //Creation de tache
    const createTask = async () => {
      await api.post("/tasks", newTask.value);
      fetchTasks();
      newTask.value = { title: "", description: "", status: "en attente" };
    };

        // Modifier une tâche
        const openEditModal = (task) => {
            selectedTask.value = { ...task };
            isEditing.value = true;
            new bootstrap.Modal(document.getElementById("taskModal")).show();
        };

        //Mise à jour de tache 
        const updateTask = async (task) => {
        await api.put(`/tasks/${task.id}`, task);
        fetchTasks();
        }; 

        //Suppression de tache
        const deleteTask = async (taskId) => {
        if (confirm("Supprimer cette tâche ?")) {
            await api.delete(`/tasks/${taskId}`);
            fetchTasks();
        }
        };

    const filteredTasks = computed(() =>
      tasks.value.filter((t) => t.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );

    onMounted(fetchTasks);

    return { tasks, newTask, searchQuery, statusFilter, fetchTasks, createTask, updateTask, deleteTask, filteredTasks };
  },
};
</script>
