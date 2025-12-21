<template>
  <div class="hero">
    <div class="content">
      <label id="naslov">Pronadji recept po tvom ukusu ↓</label>

      <!-- INPUT I SEARCH DUGME -->
      <div class="row">
        <input type="text" v-model="imeRecepta" placeholder="Pretraži recept po imenu..." />
        <button @click="searchByName" id="search">Pretraži</button>
      </div>

      <!-- KATEGORIJA -->
      <div class="row">
        <label>Kategorija jela</label>
        <select class="select" v-model="selectedCategory" @change="onCategoryChange">
          <option value="" style="color: black">Sve kategorije</option>
          <option
            v-for="cat in categories"
            :key="cat.cat_id"
            :value="cat.cat_id"
            style="color: black"
          >
            {{ cat.cat_name }}
          </option>
        </select>
      </div>

      <!-- SASTOJCI -->
      <div class="row">
        <label>Po sastojku</label>
        <select class="select" v-model="selectedIngredient" @change="onIngredientChange">
          <option value="" style="color: black">Svi sastojci</option>
          <option
            v-for="ing in ingredients"
            :key="ing.ing_id"
            :value="ing.ing_id"
            style="color: black"
          >
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
  <h1 v-if="recipes.length > 0" class="section-title">SVI RECEPTI</h1>

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

  <div v-else class="no-results-container">
    <img src="/src/components/nosearch.png" alt="No results" class="no-results-img" />
    <p class="no-results-text">Nema rezultata pretrage</p>
  </div>

  <div class="tips">
    <div class="tip">
      <img src="/src/components/clock.png" />
      <p>Manje vremena u kuhinji – više uživanja</p>
    </div>
    <div class="tip">
      <img src="/src/components/meal.png" />
      <p>Nemaš ideju šta da kuvaš? Mi imamo!</p>
    </div>
    <div class="tip">
      <img src="/src/components/heart.png" />
      <p>Savršeno i za porodicu i za goste</p>
    </div>
  </div>

  <!-- OMILJENA JELA -->
  <h1 class="section-title">OMILJENA JELA</h1>
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
  scrollToRecipes()
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
  color: rgb(255, 255, 255);
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
  border-bottom: 2px solid #743f3f;
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
  margin-left: 10px;
  transition: 0.25s ease;
}

.newRecipe button:hover {
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #743f3f;
}

.main-wrapper {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  justify-items: center;
  background-color: rgba(116, 63, 63, 0.06); /* #743f3f sa 50% providnosti */
  padding: 40px 60px;
  border-radius: 50px;
}

.recipe-card,
.recipe-card2 {
  width: 280px;
  background-color: rgba(228, 228, 228, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px var(--card-shadow);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #743f3f;
  font-weight: bold;
  border: 2px solid #743f3f;
}

.recipe-card:hover,
.recipe-card2:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
}

.recipe-card img,
.recipe-card2 img {
  height: 210px;
  transition: transform 0.4s ease;
  width: 100%;
  object-position: center;
}

.recipe-card:hover img,
.recipe-card2:hover img {
  transform: scale(1.05);
}

.recipe-card h2,
.recipe-card2 h2 {
  margin: 16px 12px 6px;
  font-size: 18px;
  color: var(--primary);
  text-align: center;
  width: 100%;
}

.difficulty {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
}

.section-title {
  position: relative;
  font-size: 36px;
  letter-spacing: 1px;
  margin: 60px auto 40px;
  text-align: center;
  color: #743f3f;
  width: fit-content;
  cursor: pointer;
  font-weight: bold;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10px;
  width: 0;
  height: 4px;
  background-color: #743f3f;
  border-radius: 50px;
  transform: translateX(-50%);
  transition: width 0.35s ease;
}

.section-title:has(+ .main-wrapper:hover)::after {
  width: 80%;
}

.section-title:has(~ .slider-container:hover)::after {
  width: 80%;
}

.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120px;
  margin-bottom: 150px;
  color: #743f3f;
}

.no-results-img {
  height: 300px;
  margin-bottom: 20px;
  opacity: 0.85;
}

.no-results-text {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}

.section-divider {
  margin: 50px;
  margin-left: 200px;
  margin-right: 200px;
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
  background-color: rgba(116, 63, 63, 0.06); /* #743f3f sa 50% providnosti */
  border-radius: 50px;
  margin: 30px;
  max-width: 1300px;
  margin: auto;
  padding: 30px;
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

.tips {
  display: flex;
  flex-direction: row;
  max-width: 1300px;
  margin: auto;
  gap: 15px;
  justify-content: center;
  background-color: rgba(116, 63, 63, 0.06);
  margin-top: 100px;
  margin-bottom: 100px;
  border-radius: 50px;
}

.tip {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 20px;
  background-color: rgba(116, 63, 63, 0.08);
  padding-right: 20px;
  border-radius: 20px;
}

.tip img {
  height: 60px;
  margin: 5px;
}

.tip p {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 17px;
  color: black;
}
</style>
