<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" />

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo {
  height: 60px;
  width: auto;
}

/* Navigacija */
nav {
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
}

nav a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: #eee;
  border-radius: 5px;
}

/* Pomak sadržaja ispod header-a */
main {
  margin-top: 100px; /* isto koliko header da ne preklapa sadržaj */
}
</style>
