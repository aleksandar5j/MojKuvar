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
        <span>Dobrodošao, {{ user.usr_username }}</span>
        <button @click="logoutUser">LogOut</button>
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

const session = useSessionStore()
const router = useRouter()

// inicijalizacija iz localStorage

// reactive properties
const isLoggedIn = computed(() => !!session.user)
const user = computed(() => session.user || {})

const logoutUser = () => {
  session.logout()
  router.push('/')
}
</script>

<style scoped>
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
  flex: 1;
  text-align: center;
}

.center-nav a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
  margin: 30px;
}

.center-nav a:hover {
  color: #a0643c;
}

.center-nav a.router-link-exact-active {
  color: #a0643c;
  font-weight: 700;
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
  background-color: #eee;
  border-radius: 5px;
  color: #a0643c;
}
</style>
