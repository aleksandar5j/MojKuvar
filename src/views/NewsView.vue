<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="news-page">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay">
        <h1>Sreća se pravi kod kuće!</h1>
        <p>
          Želimo da vam život u kuhinji bude lakši i ukusniji svakog dana, tako da uvek možete da
          pripremate hranu koju volite.
        </p>
      </div>
    </section>

    <!-- CTA / PROMO -->
    <section class="cta">
      <div class="cta-img"></div>

      <div class="cta-content">
        <h2>Pridruži se zajednici</h2>
        <p>
          Pripremili smo poseban meni baš za tebe. Sa Meal Planner-om možeš brzo pripremiti meni
          prilagođen svom ukusu.
        </p>
        <button class="cta-btn" @click="router.push('/register')">Registruj se</button>
      </div>
    </section>

    <section class="cta2">
      <div class="cta-content2">
        <h2>Dodaj svoj recept</h2>
        <p>Ulogujte se, dodajte vas omiljeni recept, i zadovoljite druge vašim ukusom!</p>
        <button class="cta-btn2" @click="router.push('/dodaj-recept')">Dodaj recept</button>
      </div>

      <div class="cta-img2"></div>
    </section>

    <section class="cta3">
      <div class="cta-img3"></div>

      <div class="cta-content3">
        <h2>Vaši omiljeni recepti</h2>
        <p>Ulogujte se, pronadjite vaš omiljeni recept, i sačuvajte ga u vaše favorite!</p>
        <button class="cta-btn3" @click="router.push('/vasa-omiljena-jela')">Moji favoriti</button>
      </div>
    </section>

    <h2 class="section-title" style="font-size: 60px">Najnovija jela</h2>
    <section class="latest-section">
      <div class="latest-grid">
        <div
          class="food-card"
          v-for="(food, index) in latestRecipes"
          :key="food.rec_id"
          :class="{
            featured: index === 0,
            'side-top': index === 1,
            'side-bottom': index === 2,
            normal: index > 2,
          }"
        >
          <div class="img-box">
            <img :src="`http://565q123.e2.mars-hosting.com${food.image}`" />
            <button
              class="fav-btn"
              :class="{ active: food.isFavorite }"
              @click="toggleFavorite(food)"
            >
              ❤
            </button>
            <span class="food-tag">{{ food.rec_name }}</span>

            <div class="food-desc">{{ food.rec_description }}</div>

            <div class="overlay"></div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-if="showSuccess" class="success-popup">
    {{ successMessage }}
  </div>

  <div v-if="showError" class="error-popup">
    {{ errorMessage }}
  </div>
</template>

<script setup>
import router from '@/router'
import api from '@/api'
import { ref, onMounted } from 'vue'
import { useSessionStore } from '@/stores/sessionUser'

const session = useSessionStore()
const isLoggedIn = session.isLoggedIn

const latestRecipes = ref([])
const userFavorites = ref([])

async function getLatestRecipes() {
  try {
    const res = await api.latestRecipes()
    latestRecipes.value = res.data.data
    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

async function getUserFavorites() {
  if (!isLoggedIn) return
  try {
    const res = await api.userFavoriteRecipes(session.sid)
    userFavorites.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

function markFavoriteRecipes() {
  latestRecipes.value.forEach((food) => {
    food.isFavorite = userFavorites.value.some((uf) => uf.rec_id === food.rec_id)
  })
}

async function toggleFavorite(food) {
  if (!isLoggedIn) {
    triggerError('Morate biti ulogovani!')
    setTimeout(() => {
      router.push('/login')
    }, 1000)
    return
  }
  try {
    if (!food.isFavorite) {
      const res = await api.addFavoriteRecipe(session.sid, food.rec_id)
      triggerSuccess('Uspesno si dodao recept u favorite ✅')
      console.log(res.data)
    } else {
      const res = await api.deleteFavoriteRecipe(session.sid, food.rec_id)
      triggerSuccess('Uspesno si uklonio recept iz favorita ✅')
      console.log(res.data)
    }
    await getUserFavorites()
    markFavoriteRecipes()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await getLatestRecipes()
  await getUserFavorites()
  markFavoriteRecipes()
})

const successMessage = ref('') // poruka za zeleni popup
const showSuccess = ref(false) // da li prikazati popup

function triggerSuccess(msg) {
  successMessage.value = msg
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 1000) // 2 sekunde prikaz
}

const errorMessage = ref('') // poruka za zeleni popup
const showError = ref(false) // da li prikazati popup

function triggerError(msg) {
  errorMessage.value = msg
  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 1000) // 2 sekunde prikaz
}
</script>

<style scoped>
.news-page {
  margin-top: 76px;
  padding: 0 40px 60px;
  background-color: rgba(116, 63, 63, 0.2); /* #743f3f sa 50% providnosti */
}

/* HERO */
.hero {
  position: relative;
  height: 420px;
  border-radius: 20px;
  overflow: hidden;
  background: url('/src/components/backgroundimage.jpeg') bottom / cover no-repeat;
  margin-bottom: 100px;
}

/* BLUR LAYER */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(20px);
  transform: scale(1.1);
  z-index: 1;

  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.7) 35%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0) 80%
  );
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.7) 35%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0) 80%
  );
}

/* TEKST I OVERLAY IZNAD BLURA */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2; /* ⬅ iznad blura */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  color: #fff;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.25), transparent);
}

.hero h1 {
  font-size: 60px;
  margin-bottom: 10px;
}

.hero p {
  max-width: 520px;
  font-size: 18px;
}

/* CTA */
.cta {
  max-width: 1200px;
  min-height: 420px;
  margin: 0 auto 70px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 20px;
  overflow: hidden;
  background: #743f3f;
}

/* LEVO – SLIKA */
.cta-img {
  background: url('src/components/cooking.jpeg') center / cover no-repeat;
  min-height: 260px;
}

/* DESNO – SADRŽAJ */
.cta-content {
  padding: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cta-content h2 {
  font-size: 40px;
  margin-bottom: 12px;
  color: white;
  font-weight: bold;
}

.cta-content p {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 22px;
  color: white;
}

.cta-btn {
  align-self: flex-start;
  background: #52271cff;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
}
.cta-btn:hover {
  opacity: 0.9;
}

.cta2 {
  max-width: 1200px;
  min-height: 420px;
  margin: 0 auto 70px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 20px;
  overflow: hidden;
  background: #743f3f;
}

.cta-img2 {
  background: url('src/components/asaa.jpg') center / cover no-repeat;
  min-height: 260px;
}

/* DESNO – SADRŽAJ */
.cta-content2 {
  padding: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cta-content2 h2 {
  font-size: 40px;
  margin-bottom: 12px;
  color: white;
  font-weight: bold;
}

.cta-content2 p {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 22px;
  color: white;
}

.cta-btn2 {
  align-self: flex-start;
  background: #52271cff;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
}
.cta-btn2:hover {
  opacity: 0.9;
}

.cta3 {
  max-width: 1200px;
  min-height: 420px;
  margin: 0 auto 70px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 20px;
  overflow: hidden;
  background: #743f3f;
}

/* LEVO – SLIKA */
.cta-img3 {
  background: url('src/components/favorite-meal.jpg') center / cover no-repeat;
  min-height: 260px;
}

/* DESNO – SADRŽAJ */
.cta-content3 {
  padding: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cta-content3 h2 {
  font-size: 40px;
  margin-bottom: 12px;
  color: white;
  font-weight: bold;
}

.cta-content3 p {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 22px;
  color: white;
}

.cta-btn3 {
  align-self: flex-start;
  background: #52271cff;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
}
.cta-btn3:hover {
  opacity: 0.9;
}

/* GRID */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.news-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.img-wrapper {
  position: relative;
}

.img-wrapper img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.tag {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.fav {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
}

.desc {
  padding: 18px;
  font-size: 14px;
  line-height: 1.5;
}

.latest-section {
  padding: 0 40px; /* padding sa leve i desne strane */
  display: flex;
  justify-content: center;
}

.section-title {
  font-size: 28px;
  padding-left: 260px;
  color: #743f3f;
  font-weight: bold;
  margin-top: 100px;
}

/* GRID */
.latest-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 260px; /* ili 1fr ako želiš da fleksibilno raste */
  gap: 22px;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}

.food-card {
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  text-decoration: none;
  color: white;
  cursor: pointer;

  display: flex;
  flex-direction: column;
}

.img-box {
  position: relative;
  width: 100%;
  flex: 1; /* ovo čini da img-box zauzima celu visinu kartice */
  display: flex;
  flex-direction: column;
}

.food-card img {
  width: 100%;
  height: 100%; /* punu visinu img-box */
  object-fit: cover; /* slika se puni i pokriva celu površinu */
  transition: transform 0.4s ease;
}

.food-card .food-desc {
  position: absolute;
  bottom: 50px; /* iznad donjeg dela slike */
  left: 20px;
  right: 20px;
  color: #fff;
  font-size: 16px;
  line-height: 1.4;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

.food-card .overlay {
  z-index: 2;
}

.food-card.featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* TAMNI OVERLAY */
.food-card .overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1));
}

/* BADGE */
.food-card .food-tag {
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
.food-card h2 {
  position: absolute;
  bottom: 22px;
  left: 22px;
  right: 22px;
  font-size: 20px;
  line-height: 1.3;
  z-index: 2;
}

/* HOVER EFEKAT */
.food-card:hover img {
  transform: scale(1.05);
}

/* DUGME SRCE */
.fav-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  font-size: 25px;
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

/* RESPONSIVE */
@media (max-width: 900px) {
  .latest-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .food-card.featured {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 600px) {
  .latest-grid {
    grid-template-columns: 1fr;
  }

  .food-card.featured {
    grid-column: span 1;
  }
}

.success-popup {
  position: fixed;
  top: 90px;
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

.error-popup {
  position: fixed;
  top: 90px;
  right: 20px;
  background-color: #8f1c0d;
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
