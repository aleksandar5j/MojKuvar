<template>
  <header>
    <RouterLink to="/"><img alt="Logo" class="logo" :src="logo" /></RouterLink>

    <button class="hamburger" @click="mobileOpen = !mobileOpen">☰</button>

    <div class="center-nav">
      <RouterLink to="/vasa-omiljena-jela">Moji favoriti</RouterLink>
      <RouterLink to="/o-nama">O nama</RouterLink>
      <RouterLink to="/novosti">Novosti</RouterLink>
    </div>

    <div class="right-nav">
      <template v-if="!isLoggedIn">
        <RouterLink to="/register">Registruj se</RouterLink>
        <RouterLink to="/login">Uloguj se</RouterLink>
      </template>

      <template v-else>
        <button class="addforlogged" @click="router.push('/dodaj-recept')">Dodaj recept</button>
        <div class="user-menu" @click="toggleMenu">
          <img v-if="session.isAdmin" class="admin" :src="admin" alt="Admin" />
          <img v-else-if="session.isLoggedIn" class="avatar" :src="avatar" alt="User" />

          <div v-if="menuOpen" class="dropdown">
            <div class="dropdown-user">Korisničko ime: {{ user.usr_username }}</div>
            <button
              class="dropdown-btn"
              style="color: #743f3f; font-weight: bold"
              v-if="session.isAdmin"
              @click="router.push('/admin-komande')"
            >
              Admin panel
            </button>
            <button class="dropdown-btn" @click="router.push('/moji-recepti')">Moji recepti</button>
            <button class="dropdown-btn" @click.stop="logoutUser">Odjavi se</button>
          </div>
        </div>
      </template>
    </div>
  </header>

  <div class="mobile-menu" v-if="mobileOpen">
    <RouterLink to="/" @click="closeMobile">Početna</RouterLink>
    <RouterLink to="/vasa-omiljena-jela" @click="closeMobile">Moji favoriti</RouterLink>
    <RouterLink to="/o-nama" @click="closeMobile">O nama</RouterLink>
    <RouterLink to="/novosti" @click="closeMobile">Novosti</RouterLink>

    <hr />

    <template v-if="!isLoggedIn">
      <RouterLink to="/register" @click="closeMobile">Registruj se</RouterLink>
      <RouterLink to="/login" @click="closeMobile">Uloguj se</RouterLink>
    </template>

    <template v-else>
      <button @click="goToAddRecipeMobile">➕ Dodaj recept</button>
      <button
        @click="
          () => {
            router.push('/moji-recepti')
            closeMobile()
          }
        "
      >
        📖 Moji recepti
      </button>
      <button
        v-if="session.isAdmin"
        @click="
          () => {
            router.push('/admin-komande')
            closeMobile()
          }
        "
      >
        🛠 Admin panel
      </button>
      <button class="logout" @click="logoutUser">🚪 Odjavi se</button>
    </template>
  </div>

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
import admin from './components/admin.png'

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

const mobileOpen = ref(false)

const closeMobile = () => {
  mobileOpen.value = false
}

const goToAddRecipeMobile = () => {
  router.push('/dodaj-recept')
  closeMobile()
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
  height: 65px;
  background-color: #743f3f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo {
  height: 150px;
  max-height: 100%;
  width: auto;
  display: block;
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

.admin {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid black;
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

.hamburger {
  display: none;
  font-size: 30px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.mobile-menu {
  position: fixed;
  top: 75px;
  left: 0;
  width: 100%;
  background: #743f3f;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 15px;
  z-index: 999;
  animation: slideDown 0.3s ease;
}

.mobile-menu a,
.mobile-menu button {
  color: white;
  font-size: 18px;
  text-align: left;
  background: none;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.mobile-menu a:hover,
.mobile-menu button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.mobile-menu hr {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.mobile-menu .logout {
  background: #a0643c;
  font-weight: bold;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 800px) {
  .center-nav,
  .right-nav {
    display: none;
  }

  .hamburger {
    display: block;
  }

  .logo {
    height: 90px;
  }
}

@media (max-width: 800px) {
  header {
    height: 65px;
    padding: 0 1rem;
  }

  .logo {
    height: 55px;
  }
}
</style>
