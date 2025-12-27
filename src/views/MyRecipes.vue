<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="myrecipes-page">
    <div v-if="recipes.length > 0">
      <!-- NASLOV -->
      <div class="page-title">
        <h1>Moji recepti</h1>
      </div>

      <!-- GRID KARTICA -->
      <div class="main-wrapper">
        <div class="main" v-for="recipe in recipes" :key="recipe.rec_id">
          <RouterLink :to="{ name: 'detalji-recepta', params: { id: recipe.rec_id } }">
            <div class="recipe-card">
              <img :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" alt="Recipe image" />

              <h2>{{ recipe.rec_name }}</h2>

              <p class="difficulty">Težina pripreme: {{ recipe.rec_preparation }}</p>

              <p class="description">Kategorija: {{ recipe.cat_name }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- AKO NEMA RECEPATA -->
    <div v-else class="nofav">
      <img src="/src/components/nosearch.png" style="height: 400px; margin-top: 50px" />
      <h3 style="text-align: center; font-size: 40px; font-weight: bold; color: #743f3f">
        Još uvek niste dodali nijedan recept!
      </h3>
      <button @click="router.push('/dodaj-recept')">Dodaj svoj recept</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'
import router from '@/router'

const session = useSessionStore()

const recipes = ref([])

async function myRecipes() {
  try {
    const res = await api.myRecipes(session.sid)
    recipes.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  myRecipes()
})
</script>

<style scoped>
.myrecipes-page {
  padding-top: 120px; /* odstojanje od headera */
}

.page-title {
  text-align: center;
  padding: 30px 20px 40px;
}

.page-title h1 {
  font-size: 40px;
  font-weight: 800;
  color: #743f3f;
  margin: 0;
}

/* GRID – max 5 kartica */
.main-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  max-width: 1400px; /* OVO pravi prostor sa strane */
  margin: 0 auto; /* centriranje */
  padding: 0 20px 60px;
}

/* RESPONSIVE */
@media (max-width: 1400px) {
  .main-wrapper {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1100px) {
  .main-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main-wrapper {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 20px 40px;
  }
}

@media (max-width: 480px) {
  .main-wrapper {
    grid-template-columns: 1fr;
  }
}
/* KARTICA */
.recipe-card {
  background: #fce6e6;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  transition: all 0.35s ease;
  cursor: pointer;

  height: 380px;
  display: flex;
  flex-direction: column;
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 22px 45px rgba(0, 0, 0, 0.12);
}

.recipe-card img {
  height: 70%;
  width: 100%;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.4s ease;
}

.recipe-card .card-content {
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recipe-card h2,
.recipe-card .difficulty,
.recipe-card .description {
  flex: 1;
}

.recipe-card:hover img {
  transform: scale(1.05);
}

/* SADRŽAJ */
.recipe-card h2 {
  font-size: 20px;
  font-weight: 700;
  color: #743f3f;
  margin: 16px 18px 6px;
}

.recipe-card .difficulty {
  font-size: 14px;
  font-weight: 600;
  color: #b17f7f;
  margin: 0 18px 6px;
}

/* OPIS */
.recipe-card .description {
  font-size: 14px;
  color: #666;
  margin: 0 18px 18px;
  line-height: 1.5;
  flex-grow: 1;
}

/* LINK RESET */
a {
  text-decoration: none;
  color: inherit;
}

/* PRAZNO STANJE */
.nofav {
  display: flex;
  min-height: 88vh;
  flex-direction: column;
  align-items: center;
}

.nofav button {
  height: 60px;
  width: 230px;
  padding: 7px 18px;
  background: #743f3f;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.25s;
  margin-top: 20px;
}

.nofav button:hover {
  background: #5f3030;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .main-wrapper {
    padding: 0 20px 40px;
    gap: 20px;
  }

  .recipe-card img {
    height: 160px;
  }
}
</style>
