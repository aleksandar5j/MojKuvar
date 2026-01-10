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
        <button @click="dodajRecept">Dodaj</button>
      </div>
    </div>
  </div>

  <!-- NASLOVI -->
  <h1 v-if="recipes.length > 0" class="section-title">PREPORUČUJEMO</h1>

  <!-- RECEPTI -->
  <div class="recipes-wrapper" v-if="recipes.length > 0" ref="recipesWrapper">
    <RouterLink
      v-for="(recipe, index) in displayedRecipes"
      :key="recipe.rec_id"
      :to="{ name: 'detalji-recepta', params: { id: recipe.rec_id } }"
      :class="['rec-card', { big: index === 0 }]"
    >
      <!-- SRCE -->
      <button
        class="fav-btn"
        :class="{ active: recipe.isFavorite }"
        @click.stop.prevent="toggleFavorite(recipe)"
        title="Dodaj u omiljene"
      >
        ❤
      </button>

      <img :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" alt="recipe" />

      <div class="overlay"></div>

      <span class="badge">{{ recipe.rec_name }}</span>

      <h2>{{ recipe.rec_description }}</h2>
    </RouterLink>

    <div v-if="visibleCount < recipes.length" class="load-more-container">
      <button class="load-more-btn" @click="loadMoreRecipes">Učitaj još recepata ↓</button>
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
        <div class="main2" v-for="pop in popularRecipes" :key="pop.rec_id">
          <RouterLink
            :to="{ name: 'detalji-recepta', params: { id: pop.rec_id } }"
            class="rec-card"
          >
            <img :src="`http://565q123.e2.mars-hosting.com${pop.image}`" alt="recipe" />

            <div class="overlay"></div>

            <span class="badge">{{ pop.rec_name }}</span>

            <h2>Vreme pripreme: {{ pop.rec_preparation }}</h2>
          </RouterLink>
        </div>
      </div>
    </div>
    <button class="arrow right" @click="scrollRight">›</button>
  </div>

  <div class="tip2">
    <img src="/src/components/avatar.png" />
    <p>Registrujte se i dodajte vaš recept, kao i da sačuvate vaše omiljene recepte.</p>
  </div>

  <footer class="footer">
    <div class="footer-content">
      <!-- LOGO / OPIS -->
      <div class="footer-col">
        <img src="/src/components/logo.png" />
        <p>Pronađi savršene recepte za svaki dan. Jednostavno, brzo i ukusno.</p>
      </div>

      <!-- LINKOVI -->
      <div class="footer-col">
        <h4>Navigacija</h4>
        <ul>
          <li><RouterLink to="/novosti">Novosti</RouterLink></li>
          <li><RouterLink to="/vasa-omiljena-jela">Omiljeni recepti</RouterLink></li>
          <li><RouterLink to="/dodaj-recept">Dodaj recept</RouterLink></li>
        </ul>
      </div>

      <!-- INFO -->
      <div class="footer-col">
        <h4>Informacije</h4>
        <ul>
          <li>📍 Srbija</li>
          <li>📧 kontakt@mojkuvar.rs</li>
          <li>☎️ +381 64 123 456</li>
        </ul>
      </div>
    </div>

    <!-- DONJA LINIJA -->
    <div class="footer-bottom">
      © {{ new Date().getFullYear() }} Moj Kuvar — Sva prava zadržana
    </div>
  </footer>

  <div v-if="showSuccess" class="success-popup">
    {{ successMessage }}
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

import { useSessionStore } from '@/stores/sessionUser'
import router from '@/router'

const session = useSessionStore()
const isLoggedIn = session.isLoggedIn

const imeRecepta = ref('')
const selectedCategory = ref('')
const selectedIngredient = ref('')

async function pretrazi() {
  try {
    visibleCount.value = STEP

    const res = await api.getRecipesSearch({
      search: imeRecepta.value,
      category: selectedCategory.value,
      ingredient: selectedIngredient.value,
    })
    recipes.value = res.data.data
    console.log(res.data)

    if (recipes.value.length > 0) {
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
const popularRecipes = ref([])

async function getPopularRecipes() {
  try {
    const res = await api.getFavoriteRecipes()
    console.log(res.data)
    popularRecipes.value = res.data.data
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

const userFavorites = ref([])

async function getUserFavorites() {
  try {
    const res = await api.userFavoriteRecipes(session.sid)
    userFavorites.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

function markFavoriteRecipes() {
  recipes.value.forEach((recipe) => {
    recipe.isFavorite = userFavorites.value.some((uf) => uf.rec_id === recipe.rec_id)
  })
}

async function toggleFavorite(recipe) {
  try {
    if (!recipe.isFavorite) {
      if (!isLoggedIn) {
        router.push('/login')
        return
      }
      await api.addFavoriteRecipe(session.sid, recipe.rec_id)
      await getUserFavorites()
      triggerSuccess('Uspesno si dodao recept u favorite ✅')
      markFavoriteRecipes()
    } else {
      await api.deleteFavoriteRecipe(session.sid, recipe.rec_id)
      await getUserFavorites()
      triggerSuccess('Uspesno si uklonio recept iz favorita ✅')
      markFavoriteRecipes()
    }
  } catch (error) {
    console.error(error)
  }
}

async function dodajRecept() {
  if (isLoggedIn) {
    router.push('/dodaj-recept')
  } else {
    router.push('/login')
  }
}

onMounted(async () => {
  await getCategories()
  await getIngredients()
  await getRecipes()

  await getPopularRecipes() // 🔥 popularno (slider)

  if (isLoggedIn) {
    await getUserFavorites() // ❤️ user
    markFavoriteRecipes()
  }
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

const STEP = 6
const visibleCount = ref(STEP)

const displayedRecipes = computed(() => {
  return recipes.value.slice(0, visibleCount.value)
})

const loadMoreRecipes = () => {
  visibleCount.value += STEP
}

const successMessage = ref('') // poruka za zeleni popup
const showSuccess = ref(false) // da li prikazati popup

function triggerSuccess(msg) {
  successMessage.value = msg
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 4000) // 2 sekunde prikaz
}
</script>

<style scoped>
.hero {
  width: 100%;
  height: 70vh;
  position: relative;
  overflow: hidden;

  background-image: url('@/components/backgroundimage.jpeg');
  background-size: cover;
  background-position: center;
}

/* BLUR SAMO NA DONJEM DELU */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;

  background-image: inherit;
  background-size: inherit;
  background-position: inherit;

  filter: blur(18px);
  transform: scale(1.1);
  z-index: 1;

  /* VIDLJIVO SAMO DOLE */
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.85) 30%,
    rgba(0, 0, 0, 0.4) 55%,
    rgba(0, 0, 0, 0) 75%
  );
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.85) 30%,
    rgba(0, 0, 0, 0.4) 55%,
    rgba(0, 0, 0, 0) 75%
  );
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

.difficulty {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
}

.section-title {
  position: relative;
  font-size: 55px;
  letter-spacing: 1px;
  margin-top: 100px;
  color: #743f3f;
  font-weight: bold;
  margin-left: 310px;
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
  overflow-x: hidden; /* sakriva scrollbar */
  scroll-behavior: smooth;
}

.main-wrapper2 {
  display: flex;
  gap: 25px;
  padding: 10px;
  flex-wrap: nowrap;
  align-items: flex-start; /* ovo je ključno */
}

.main-wrapper2 .rec-card {
  width: 380px;
  height: 260px; /* ista visina kao grid */
  flex-shrink: 0;
  display: block; /* osigurava da img height:100% radi */
}

.main-wrapper2 .rec-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  margin-top: 20px;
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

.tip2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
  align-items: center;
  background-color: rgba(116, 63, 63, 0.06);
  border-radius: 50px;
  padding: 20px;
  gap: 20px;
  max-width: 1300px;
  margin-top: 100px;
}

.tip2 img {
  height: 80px;
}

.tip2 p {
  font-size: 30px;
  color: black;
  font-weight: bold;
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

.recipes-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 260px;
  gap: 22px;
}

/* KARTICA */
.rec-card {
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  text-decoration: none;
  color: white;
}

/* PRVA VELIKA */
.rec-card.big {
  grid-column: span 2;
  grid-row: span 2;
}

/* SLIKA */
.rec-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* TAMNI OVERLAY */
.rec-card .overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1));
}

/* BADGE */
.rec-card .badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #743f3f;
  color: white;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 50px;
  font-weight: 600;
  z-index: 2;
}

/* NASLOV */
.rec-card h2 {
  position: absolute;
  bottom: 22px;
  left: 22px;
  right: 22px;
  font-size: 20px;
  line-height: 1.3;
  z-index: 2;
}

/* HOVER */
.rec-card:hover img {
  transform: scale(1.05);
}

.rec-card img {
  transition: transform 0.4s ease;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .recipes-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }

  .rec-card.big {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 600px) {
  .recipes-wrapper {
    grid-template-columns: 1fr;
  }

  .rec-card.big {
    grid-column: span 1;
  }
}

.rec-card {
  position: relative;
}

/* Dugme srce */
.fav-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px; /* veće dugme */
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: transparent;
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

.load-more-container {
  grid-column: 1 / -1; /* 🔥 zauzima ceo grid red */
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 20px;
}

.load-more-btn {
  background-color: #743f3f;
  color: white;
  font-size: 18px;
  padding: 14px 25px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(116, 63, 63, 0.35);
}

.footer {
  margin-top: 80px;
  background: #743f3f;
  color: #ddd;
  padding: 50px 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  justify-content: center; /* sve u sredinu */
  align-items: flex-start;
  gap: 150px; /* razmak izmedju kolona */

  text-align: center;
}

.footer-col {
  max-width: 260px; /* da tekst ne ide u širinu */
  flex: 1;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  margin-bottom: 16px;
}

/* tekst da se lepo lomi */
.footer-col p,
.footer-col li {
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;
}

.footer-col h3,
.footer-col h4 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 25px;
}

.footer-col img {
  height: 80px;
}

.footer-col a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: #ff4d4d;
}

.footer-bottom {
  margin-top: 40px;
  padding-top: 15px;
  border-top: 1px solid #333;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}

.main-wrapper2 .rec-card {
  width: 380px;
  height: 260px; /* ISTO kao grid-auto-rows */
  flex-shrink: 0;
}

.success-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #2e794d; /* zeleno */
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  z-index: 2000;
  animation:
    slideIn 0.3s ease,
    fadeOut 0.3s ease 1.7s forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>
