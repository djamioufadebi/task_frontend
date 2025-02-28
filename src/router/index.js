import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import TaskList from '../views/TaskList.vue';
import Register from '../views/Register.vue';
import TaskCreate from '../views/TaskCreate.vue';
import TaskUpdate from '../views/TaskUpdate.vue';

const routes = [

  { path: '/', 
   component: Login, 
    name : "home"
  },

  { path: '/dashboard', 
    component: Dashboard,
    name : "dashboard" 
  },

  { path: '/tasks', 
    component: TaskList,
    name : "tasks" 
  },

  { path: '/tasks-create', 
    component: TaskCreate,
    name : "task-create" 
  },

  { path: '/tasks-update', 
    component: TaskUpdate,
    name : "task-update" 
  },

  { path: '/register', 
    component: Register,
    name : "register"  
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;