<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="favorites-page">
    <div v-if="isLoggedIn">
      <h1
        style="
          padding-top: 30px;
          padding-bottom: 50px;
          text-align: center;
          font-weight: bold;
          color: #743f3f;
          font-size: 40px;
        "
      >
        Tvoji omiljeni recepti
      </h1>
      <div class="main-wrapper" v-if="favorites.length > 0" ref="favoritesWrapper">
        <div class="main" v-for="fav in favorites" :key="fav.fav_id">
          <RouterLink :to="{ name: 'detalji-recepta', params: { id: fav.rec_id } }">
            <div class="recipe-card">
              <button
                class="fav-btn"
                @click.stop.prevent="toggleFavorite(fav)"
                title="Ukloni iz omiljenih"
              >
                ❤
              </button>
              <img :src="`http://565q123.e2.mars-hosting.com${fav.image}`" alt="Recipe image" />
              <h2>{{ fav.rec_name }}</h2>
              <p class="difficulty">Težina pripreme: {{ fav.rec_preparation }}</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <div v-else class="nofav">
        <img src="/src/components/nosearch.png" style="height: 200px" />
        <h3 style="text-align: center">Trenutno nemate omiljene recepte!</h3>
      </div>
    </div>

    <div v-else class="notlogged">
      <p style="font-size: 30px; font-weight: bold">
        Morate biti ulogovani da biste videli i dodavali omiljene recepte.
      </p>
      <button @click="router.push('/login')">Uloguj se</button>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from '@/stores/sessionUser'
import api from '@/api'
import { ref, onMounted, computed } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

const session = useSessionStore()
const isLoggedIn = computed(() => session.isLoggedIn)

const favorites = ref([])

async function favoriteRecipes() {
  try {
    const res = await api.userFavoriteRecipes(session.sid)
    favorites.value = res.data.data
    console.log(res.data.data)
  } catch (e) {
    console.log(e)
  }
}

async function toggleFavorite(fav) {
  try {
    const res = await api.deleteFavoriteRecipe(session.sid, fav.rec_id)
    await favoriteRecipes()
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (isLoggedIn.value) {
    favoriteRecipes()
  }
})
</script>

<style scoped>
.favorites-page {
  min-height: 100vh; /* zauzima full visinu */
  display: flex;
  justify-content: center; /* horizontalno centriranje */
  align-items: flex-start; /* gore ostavlja padding */
  padding-top: 120px; /* odstojanje od headera */
  background: #f3efef;
}

.nofav {
  margin-top: 100px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  align-items: center;
}

/* GRID WRAPPER */
.main-wrapper {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px;
  padding: 32px 36px;
  background-color: rgba(116, 63, 63, 0.06);
  border-radius: 32px;
  justify-items: center;
}

/* GRID ITEM */
.main {
  display: flex;
  justify-content: center;
}

/* LINK RESET */
a {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* KARTICA */
.recipe-card {
  position: relative;
  width: 100%;
  max-width: 280px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden; /* VAŽNO: slika će se uklopiti u radius */

  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.fav-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px; /* veće dugme */
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  border-color: #e53935;
  background: #e53935;
  color: #fff;
  font-size: 25px; /* veće srce */
  cursor: pointer;
  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.25s ease;
}

.fav-btn:hover {
  background: #e53935;
  border-color: #e53935;
  transform: scale(1.1); /* malo veći hover efekat */
}

.fav-btn.active {
  background: #e53935;
  border-color: #e53935;
  color: #fff;
}

/* SLIKA */
.recipe-card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  /* ukloni border-bottom */
  border-bottom: none;
}

.recipe-card:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
  transform: translateY(-8px);
}

/* NASLOV */
.recipe-card h2 {
  margin: 14px 12px 6px;
  font-size: 16.5px;
  font-weight: 600;
  color: #743f3f;
  line-height: 1.3;
}

/* TEŽINA PRIPREME */
.recipe-card .difficulty {
  margin-bottom: 16px;
  font-size: 14px;
  color: #6d6d6d;
}

/* MOBILE */
@media (max-width: 768px) {
  .main-wrapper {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: 24px 16px;
  }
}

.notlogged {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 300px;
}

.notlogged button {
  font-size: 18px;
  border-radius: 50px;
  opacity: 0.95;
  background-color: #743f3f;
  padding: 10px 22px;
  border: 0;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.25s ease;
}

.notlogged button:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #743f3f;
}
</style>
