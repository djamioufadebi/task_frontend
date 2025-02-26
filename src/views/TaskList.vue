<template>
    <div class="container mt-4">
        <h2>Mes Tâches</h2>
        <button class="btn btn-success mb-3" @click="fetchTasks">Rafraîchir</button>
        <table class="table table-bordered">
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
                    <td>{{ task.status }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" @click="editTask(task)">Modifier</button>
                        <button class="btn btn-danger btn-sm ms-2" @click="deleteTask(task.id)">Supprimer</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const tasks = ref([]);

        const fetchTasks = async () => {
            const response = await axios.get('http://127.0.0.1:8000/api/tasks', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            tasks.value = response.data;
        };

        const deleteTask = async (taskId) => {
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchTasks();
        };

        onMounted(fetchTasks);

        return { tasks, fetchTasks, deleteTask };
    }
};
</script>
