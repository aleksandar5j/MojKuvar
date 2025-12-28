<template>
  <header>
    <RouterLink to="/"><img alt="Logo" class="logo" :src="logo" /></RouterLink>

    <div class="center-nav">
      <RouterLink to="/vasa-omiljena-jela">Moji favoriti</RouterLink>
      <RouterLink to="/o-nama">O nama</RouterLink>
    </div>

    <div class="right-nav">
      <template v-if="!isLoggedIn">
        <RouterLink to="/register">Registruj se</RouterLink>
        <RouterLink to="/login">Uloguj se</RouterLink>
      </template>

      <template v-else>
        <button class="addforlogged" @click="router.push('/dodaj-recept')">Dodaj recept</button>
        <div class="user-menu" @click="toggleMenu">
          <!-- avatar -->
          <img class="avatar" :src="avatar" alt="User" />

          <!-- dropdown -->
          <div v-if="menuOpen" class="dropdown">
            <div class="dropdown-user">Korisničko ime: {{ user.usr_username }}</div>
            <button class="dropdown-btn" @click="router.push('/moji-recepti')">Moji recepti</button>
            <button class="dropdown-btn" @click.stop="logoutUser">Odjavi se</button>
          </div>
        </div>
      </template>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSessionStore } from './stores/sessionUser'
import { computed } from 'vue'
import logo from './components/logo.png'
import avatar from './components/avatar.png'

const session = useSessionStore()
const router = useRouter()

const isLoggedIn = computed(() => !!session.user)
const user = computed(() => session.user || {})

const logoutUser = () => {
  session.logout()
  router.push('/login')
}

import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<style scoped>
@import './assets/base.css';

#app {
  font-weight: normal;
  background-color: #743f3f;
}

.addforlogged {
  padding: 0px 15px;
  margin-right: 40px;
  border-radius: 10px;
  font-size: 15px;
  border: 0;
  background-color: #a0643c;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.addforlogged:hover {
  transition: 0.3s;
  background-color: #915228;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 75px;
  background-color: #743f3f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo {
  height: 80px;
  width: auto;
  padding-top: 5px;
}

.center-nav {
  text-align: center;
}

.center-nav a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0 40px;
  position: relative;
}

.center-nav a:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
  width: 2px;
  background-color: white;
}

.center-nav a:hover {
  color: #a0643c;
}

.center-nav a.router-link-exact-active {
  color: #a0643c;
}

.right-nav {
  display: flex;
  gap: 1rem;
}

.right-nav a {
  text-decoration: none;
  color: #ffffff;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;
}

.right-nav a:hover {
  background-color: #d8d8d8;
  border-radius: 5px;
  color: #743f3f;
  font-weight: bold;
}

.user-menu {
  position: relative;
  cursor: pointer;
  margin-right: 20px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 48px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-user {
  padding: 12px;
  font-weight: bold;
  color: #743f3f;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.dropdown-btn {
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
}

.dropdown-btn:hover {
  background-color: #f2f2f2;
}
</style>
