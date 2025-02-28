<!-- <template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <h3 class="text-center">Connexion</h3>
                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" v-model="email" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Mot de passe</label>
                        <input type="password" v-model="password" class="form-control" required />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Se connecter</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const email = ref('');
        const password = ref('');
        const authStore = useAuthStore();
        const router = useRouter();

        const handleLogin = async () => {
            await authStore.login(email.value, password.value);
            if (authStore.token) {
                router.push('/dashboard');
            }
        };

        return { email, password, handleLogin };
    }
};
</script> -->
<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow-lg p-2 rounded" style="width: 400px;">
            <div class="text-center">
                <i class="bi bi-person-circle text-primary" style="font-size: 3rem;"></i>
                <h3 class="mt-2">Connexion</h3>
            </div>

            <!-- Affichage des erreurs -->
            <div v-if="errorMessage" class="alert alert-danger py-2 text-center">
                {{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" v-model="email" class="form-control" placeholder="Entrez votre email"
                        required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input type="password" v-model="password" class="form-control"
                        placeholder="Entrez votre mot de passe" required />
                </div>

                <button type="submit" class="btn btn-primary w-100 fw-bold">
                    <i class="bi bi-box-arrow-in-right"></i> Se connecter
                </button>

            </form>

           
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

export default {
    setup() {
        const email = ref("");
        const password = ref("");
        const errorMessage = ref(null);
        const authStore = useAuthStore();
        const router = useRouter();

        const handleLogin = async () => {
            try {
                await authStore.login(email.value, password.value);
                if (authStore.token) {
                    router.push("/dashboard");
                }
            } catch (error) {
                errorMessage.value = "Email ou mot de passe incorrect.";
            }
        };

        return { email, password, handleLogin, errorMessage };
    },
};
</script>

<style scoped>
/* Ajoute une animation au bouton */
.btn-primary {
    transition: background 0.3s ease-in-out;
}

.btn-primary:hover {
    background-color: #0b5ed7;
}

/* Animation d'apparition */
.card {
    animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
