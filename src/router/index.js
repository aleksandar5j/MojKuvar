import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Favorites from '@/views/Favorites.vue'
import AboutUs from '@/views/AboutUs.vue'
import RecipeInfo from '@/views/RecipeInfo.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import postRecipe from '@/views/postRecipe.vue'
import MyRecipes from '@/views/MyRecipes.vue'

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
    {
      path: '/o-nama',
      name: 'o-nama',
      component: AboutUs,
    },
    {
      path: '/detalji-recepta/:id',
      name: 'detalji-recepta',
      component: RecipeInfo,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dodaj-recept',
      name: 'dodaj-recept',
      component: postRecipe,
    },
    {
      path: '/moji-recepti',
      name: 'moji-recepti',
      component: MyRecipes,
    },
  ],
})

export default router
