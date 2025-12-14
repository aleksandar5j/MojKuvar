<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="hero">
    <div class="content">
      <label id="naslov">Pronadji svoj recept ↓</label>
      <div class="row" style="margin-bottom: 20px">
        <input type="text" v-model="imeRecepta" placeholder="Pretraži recept po imenu..." />
        <button @click="pretrazi" id="search">Pretraži</button>
      </div>
      <div class="row">
        <label>Kategorija jela</label>
        <select class="select">
          <option v-for="category in categories" :key="category.cat_name" style="color: black">
            {{ category.cat_name }}
          </option>
        </select>
      </div>

      <div class="row">
        <label>Po sastojku</label>
        <select class="select">
          <option v-for="ing in ingredients" :key="ing.ing_name" style="color: black">
            {{ ing.ing_name }}
          </option>
        </select>
      </div>

      <div class="newRecipe">
        <label>Dodaj svoj recept →</label>
        <button>Dodaj</button>
      </div>
    </div>
  </div>

  <h1
    style="color: #743f3f; font-size: 45px; text-align: center; font-weight: bold; margin-top: 30px"
  >
    Svi recepti ↓
  </h1>

  <div class="main-wrapper">
    <div class="main" v-for="recipe in recipes" :key="recipe.rec_id">
      <RouterLink :to="{ name: 'detalji-recepta', params: { id: recipe.rec_id } }">
        <div class="recipe-card">
          <img :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" />
          <h2>{{ recipe.rec_name }}</h2>
          <p style="color: black; font-size: 12px; margin-bottom: 10px">
            Težina pripreme: {{ recipe.rec_preparation }}
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
  <hr
    style="margin: 50px; background-color: #743f3f; height: 3px; border: 0; border-radius: 50px"
  />
  <h1 style="font-weight: bold; color: #743f3f; text-align: center">Glavna jela ↓</h1>
  <div class="slider-container">
    <!-- LEVA STRELICA -->
    <button class="arrow left" @click="scrollLeft">‹</button>

    <!-- SLIDER -->
    <div class="slider-wrapper" ref="slider">
      <div class="main-wrapper2">
        <div class="main2" v-for="jelo in glavnajela" :key="jelo.rec_id">
          <RouterLink :to="{ name: 'detalji-recepta', params: { id: jelo.rec_id } }">
            <div class="recipe-card2">
              <img :src="`http://565q123.e2.mars-hosting.com${jelo.image}`" alt="recipe" />
              <h2>{{ jelo.rec_name }}</h2>
              <p class="difficulty">Težina pripreme: {{ jelo.rec_preparation }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- DESNA STRELICA -->
    <button class="arrow right" @click="scrollRight">›</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const categories = ref([])

async function getCategories() {
  try {
    const res = await api.getCategories()
    console.log(res.data)
    categories.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

const ingredients = ref([])

async function getIngredients() {
  try {
    const res = await api.getIngredients()
    console.log(res.data)
    ingredients.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

const recipes = ref([])
const glavnajela = ref([])

async function getGlavnaJela() {
  try {
    const res = await api.getGlavnaJela()
    console.log(res.data)
    glavnajela.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

async function getRecipes() {
  try {
    const res = await api.getRecipes()
    console.log(res.data)
    recipes.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getCategories()
  getIngredients()
  getRecipes()
  getGlavnaJela()
})

const slider = ref(null)

const scrollLeft = () => {
  slider.value.scrollBy({
    left: -425, // širina kartice + gap
    behavior: 'smooth',
  })
}

const scrollRight = () => {
  slider.value.scrollBy({
    left: 425,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
.hero {
  width: 100%;
  height: 70vh;
  position: relative;

  background-image: url('@/components/backgroundimage.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  filter: blur(0);
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;

  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  background-repeat: inherit;

  filter: blur(5px);
  transform: scale(1);
  z-index: 1;

  -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 100%, transparent 100%);
}

.content {
  position: relative;
  z-index: 2;
  color: white;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 70px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.row label {
  color: #743f3f;
  font-size: 23px;
  font-weight: bold;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.content input {
  height: 45px;
  padding: 10px 18px;
  width: 480px;
  border-radius: 50px;
  font-size: 16px;
  border: 2px solid transparent;
  opacity: 0.9;
  transition: 0.25s ease;
  backdrop-filter: blur(4px);
}

.content input:focus {
  border-color: #743f3f;
  outline: none;
  box-shadow: 0 0 10px #743f3f;
}

#search {
  font-size: 18px;
  border-radius: 50px;
  opacity: 0.95;
  background-color: #743f3f;
  padding: 13px 22px;
  border: 0;
  color: white;
  cursor: pointer;
  transition: 0.25s ease;
}

#search:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #743f3f;
}

/* SELECT */
.select {
  font-size: 16px;
  padding: 8px 12px;
  width: 160px;
  height: 40px;

  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid transparent;
  border-radius: 12px;

  cursor: pointer;
  transition: 0.25s ease;
  backdrop-filter: blur(4px);
}

.select:hover {
  border-color: #743f3f;
}

.select:focus {
  border-color: #743f3f;
  outline: none;
  box-shadow: 0 0 10px #743f3f;
}

/* Naslov */
#naslov {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  margin-bottom: 50px;
  font-size: 42px;
  color: #743f3f;
}

.newRecipe {
  margin-top: 80px;
}

.newRecipe label {
  color: #743f3f;
  font-size: 23px;
  font-weight: bold;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.newRecipe button {
  font-size: 18px;
  border-radius: 50px;
  opacity: 0.95;
  background-color: #743f3f;
  padding: 10px 22px;
  border: 0;
  color: white;
  cursor: pointer;
  transition: 0.25s ease;
  margin-left: 10px;
}

.newRecipe button:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #743f3f;
}

.main-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  padding: 10px;
}

.recipe-card {
  width: 450px;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: 0.25s ease;
  cursor: pointer;
  text-align: center;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.recipe-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}
a .recipe-card h2 {
  margin: 20px 0 20px;
  font-size: 20px;
  font-weight: bold;
  color: #743f3f;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.slider-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(233, 233, 233);
  border-radius: 50px;
  margin: 30px;
}

/* strelice */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #743f3f;
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 30px;
  cursor: pointer;
  z-index: 10;
  opacity: 0.9;
  transition: 0.2s;
}

.arrow:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
}

.arrow.left {
  left: 50px;
}

.arrow.right {
  right: 50px;
}

/* vidi se max 4 kartice */
.slider-wrapper {
  max-width: calc(4 * 400px + 3 * 25px);
  overflow-x: hidden;
}

/* slider */
.main-wrapper2 {
  display: flex;
  gap: 25px;
  padding: 10px;
  flex-wrap: nowrap;
}

.main2 {
  flex-shrink: 0;
}

/* kartica */
.recipe-card2 {
  min-width: 400px;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: 0.25s ease;
  cursor: pointer;
  text-align: center;
}

.recipe-card2:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.recipe-card2 img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.recipe-card2 h2 {
  margin: 18px 0 8px;
  font-size: 20px;
  font-weight: bold;
  color: #743f3f;
}

.difficulty {
  font-size: 12px;
  margin-bottom: 14px;
  color: black;
}

a {
  text-decoration: none;
}
</style>
