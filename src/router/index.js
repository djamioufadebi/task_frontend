import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import TaskList from '../views/TaskList.vue';
import Register from '../views/Register.vue';

const routes = [

  { path: '/', 
    component: Login 
  },

  { path: '/dashboard', 
    component: Dashboard 
  },

  { path: '/tasks', 
    component: TaskList 
  },

  { path: '/register', 
    component: Register 
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;