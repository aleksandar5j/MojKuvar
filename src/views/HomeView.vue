<template>
  <div class="hero">
    <div class="content">
      <label id="naslov">Pronadji svoj recept ↓</label>

      <!-- INPUT I SEARCH DUGME -->
      <div class="row">
        <input type="text" v-model="imeRecepta" placeholder="Pretraži recept po imenu..." />
        <button @click="searchByName" id="search">Pretraži</button>
      </div>

      <!-- KATEGORIJA -->
      <div class="row">
        <label>Kategorija jela</label>
        <select class="select" v-model="selectedCategory" @change="onCategoryChange">
          <option value="">Sve kategorije</option>
          <option v-for="cat in categories" :key="cat.cat_id" :value="cat.cat_id">
            {{ cat.cat_name }}
          </option>
        </select>
      </div>

      <!-- SASTOJCI -->
      <div class="row">
        <label>Po sastojku</label>
        <select class="select" v-model="selectedIngredient" @change="onIngredientChange">
          <option value="">Svi sastojci</option>
          <option v-for="ing in ingredients" :key="ing.ing_id" :value="ing.ing_id">
            {{ ing.ing_name }}
          </option>
        </select>
      </div>

      <!-- DODAJ NOVI RECEPT -->
      <div class="newRecipe">
        <label>Dodaj svoj recept →</label>
        <button>Dodaj</button>
      </div>
    </div>
  </div>

  <!-- NASLOVI -->
  <h1 v-if="imeRecepta || selectedCategory || selectedIngredient" class="section-title">
    Pretraga ↓
  </h1>
  <h1 v-else class="section-title">SVI RECEPTI ↓</h1>

  <!-- RECEPTI -->
  <div class="main-wrapper" v-if="recipes.length > 0" ref="recipesWrapper">
    <div class="main" v-for="recipe in recipes" :key="recipe.rec_id">
      <RouterLink :to="{ name: 'detalji-recepta', params: { id: recipe.rec_id } }">
        <div class="recipe-card">
          <img :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" />
          <h2>{{ recipe.rec_name }}</h2>
          <p class="difficulty">Težina pripreme: {{ recipe.rec_preparation }}</p>
        </div>
      </RouterLink>
    </div>
  </div>

  <h1 v-else class="no-results">NEMA REZULTATA PRETRAGE</h1>

  <hr class="section-divider" />

  <!-- OMILJENA JELA -->
  <h1 class="section-title">OMILJENA JELA ↓</h1>
  <div class="slider-container">
    <button class="arrow left" @click="scrollLeft">‹</button>
    <div class="slider-wrapper" ref="slider">
      <div class="main-wrapper2">
        <div class="main2" v-for="fav in favoriteRecipes" :key="fav.rec_id">
          <RouterLink :to="{ name: 'detalji-recepta', params: { id: fav.rec_id } }">
            <div class="recipe-card2">
              <img :src="`http://565q123.e2.mars-hosting.com${fav.image}`" alt="recipe" />
              <h2>{{ fav.rec_name }}</h2>
              <p class="difficulty">Težina pripreme: {{ fav.rec_preparation }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
    <button class="arrow right" @click="scrollRight">›</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const imeRecepta = ref('')
const selectedCategory = ref('')
const selectedIngredient = ref('')

async function pretrazi() {
  try {
    const res = await api.getRecipesSearch({
      search: imeRecepta.value,
      category: selectedCategory.value,
      ingredient: selectedIngredient.value,
    })
    recipes.value = res.data.data
    console.log(res.data)

    // Scroll samo ako imamo rezultate
    if (recipes.value.length > 0) {
      // delay da se DOM update završi
      setTimeout(() => {
        scrollToRecipes()
      }, 50)
    }
  } catch (error) {
    console.log(error)
  }
}

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
const favoriteRecipes = ref([])

async function getFavoriteRecipes() {
  try {
    const res = await api.getFavoriteRecipes()
    console.log(res.data)
    favoriteRecipes.value = res.data.data
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
  getFavoriteRecipes()
})

const slider = ref(null)

const scrollLeft = () => {
  slider.value.scrollBy({
    left: -425,
    behavior: 'smooth',
  })
}

const scrollRight = () => {
  slider.value.scrollBy({
    left: 425,
    behavior: 'smooth',
  })
}

const recipesWrapper = ref(null)

function scrollToRecipes() {
  if (recipesWrapper.value) {
    const y = recipesWrapper.value.getBoundingClientRect().top + window.scrollY - 300 // 100px gore
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

function searchByName() {
  selectedCategory.value = ''
  selectedIngredient.value = ''
  pretrazi()
}

// Kad se promeni kategorija
function onCategoryChange() {
  imeRecepta.value = ''
  selectedIngredient.value = ''
  pretrazi()
  scrollToRecipes()
}

// Kad se promeni sastojak
function onIngredientChange() {
  imeRecepta.value = ''
  selectedCategory.value = ''
  pretrazi()
  scrollToRecipes()
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
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  filter: blur(5px);
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
  margin-left: 10px;
  transition: 0.25s ease;
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

.recipe-card,
.recipe-card2 {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: 0.25s ease;
  cursor: pointer;
  text-align: center;
}

.recipe-card:hover,
.recipe-card2:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.recipe-card img,
.recipe-card2 img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.recipe-card h2,
.recipe-card2 h2 {
  margin: 18px 0 10px;
  font-size: 20px;
  font-weight: bold;
  color: #743f3f;
}

.difficulty {
  font-size: 12px;
  color: black;
  margin-bottom: 14px;
}

.section-title {
  color: #743f3f;
  font-size: 45px;
  text-align: center;
  font-weight: bold;
  margin-top: 30px;
}

.no-results {
  color: #743f3f;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  margin-top: 100px;
  margin-bottom: 150px;
}

.section-divider {
  margin: 50px;
  background-color: #743f3f;
  height: 3px;
  border: 0;
  border-radius: 50px;
}

.slider-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(243, 243, 243);
  border-radius: 50px;
  margin: 30px;
}

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

.slider-wrapper {
  max-width: calc(4 * 400px + 3 * 25px);
  overflow-x: hidden;
}

.main-wrapper2 {
  display: flex;
  gap: 25px;
  padding: 10px;
  flex-wrap: nowrap;
}

.main2 {
  flex-shrink: 0;
}

a {
  text-decoration: none;
}
</style>
