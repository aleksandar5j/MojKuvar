import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Favorites from '@/views/Favorites.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/vasa-omiljena-jela',
      name: 'vasa-omiljena-jela',
      component: Favorites,
    },
  ],
})

export default router
