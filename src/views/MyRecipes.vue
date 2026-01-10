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
        <div v-for="rec in recipes" :key="rec.rec_id" class="recipe-card">
          <!-- EDIT / DELETE -->
          <div class="card-actions">
            <button class="card-edit-btnn" @click.stop="openEditPopup(rec)" title="Izmeni">
              ✎
            </button>
            <button class="card-delete-btnn" @click.stop="deleteRecipe(rec.rec_id)" title="Obriši">
              ✖
            </button>
          </div>

          <!-- LINK SAMO NA SADRŽAJ -->
          <RouterLink
            class="card-link"
            :to="{ name: 'detalji-recepta', params: { id: rec.rec_id } }"
          >
            <img
              :src="`http://565q123.e2.mars-hosting.com${rec.image}`"
              alt="Slika recepta"
              class="recipe-image"
            />

            <div class="recipe-info">
              <h4>{{ rec.rec_name }}</h4>
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

    <div v-if="showSuccess" class="success-popup">
      {{ successMessage }}
    </div>

    <div v-if="isEditPopupOpen" class="popup-overlay-edit">
      <div class="popup-card-edit">
        <h3>✎ Izmena recepta</h3>
        <h3>Ime</h3>
        <input
          type="text"
          v-model="editRecipeData.rec_name"
          placeholder="Naziv recepta"
          class="popup-input"
        />
        <h3>Deskripcija</h3>
        <textarea
          v-model="editRecipeData.rec_description"
          placeholder="Opis recepta"
          class="popup-input textarea"
        ></textarea>

        <h3>Vreme pripreme</h3>
        <input
          type="text"
          v-model="editRecipeData.rec_preparation"
          placeholder="Vreme pripreme (npr. 30 min)"
          class="popup-input"
        />

        <h3>Korak po korak instrukcije</h3>
        <textarea
          v-model="editRecipeData.rec_instructions"
          placeholder="Instrukcije za pripremu"
          class="popup-input textarea"
        ></textarea>

        <div class="popup-buttonss">
          <button class="btn-add" @click="editRecipe()">Sačuvaj izmene</button>
          <button class="btn-cancel" @click="closeEditPopup">Otkaži</button>
        </div>
      </div>
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
    console.log(res.data)
    console.log(recipes.value)
  } catch (error) {
    console.log(error)
  }
}

async function deleteRecipe(rec_id) {
  try {
    const res = await api.deleteOwnRecipe(session.sid, rec_id)
    console.log(res.data)
    triggerSuccess('Vas recept je uspešno obrisan ✅')
    await myRecipes()
  } catch (error) {
    console.log(error)
  }
}

const successMessage = ref('') // poruka za zeleni popup
const showSuccess = ref(false) // da li prikazati popup

function triggerSuccess(msg) {
  successMessage.value = msg
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000) // 2 sekunde prikaz
}

async function editRecipe() {
  try {
    const res = await api.updateOwnRecipe({
      rec_id: editRecipeData.value.rec_id,
      rec_name: editRecipeData.value.rec_name,
      rec_description: editRecipeData.value.rec_description,
      rec_preparation: editRecipeData.value.rec_preparation,
      rec_instructions: editRecipeData.value.rec_instructions,
      sid: session.sid,
    })
    console.log(res.data)
    isEditPopupOpen.value = false
    triggerSuccess('Vas recept je uspesno izmenjen ✅')
    await myRecipes()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  myRecipes()
})

const isEditPopupOpen = ref(false)

const editRecipeData = ref({
  rec_id: null,
  rec_name: '',
  rec_description: '',
  rec_preparation: '',
  rec_instructions: '',
})

function openEditPopup(rec) {
  editRecipeData.value = {
    rec_id: rec.rec_id,
    rec_name: rec.rec_name,
    rec_description: rec.rec_description,
    rec_preparation: rec.rec_preparation,
    rec_instructions: rec.rec_instructions,
  }
  isEditPopupOpen.value = true
}

function closeEditPopup() {
  isEditPopupOpen.value = false
}
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

.main-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 26px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 20px 60px;
  min-height: 75vh;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .main-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 768px) {
  .main-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .main-wrapper {
    grid-template-columns: 1fr;
  }
}

/* CARD */
.recipe-card {
  position: relative;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  height: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;
}

.recipe-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 45px rgba(0, 0, 0, 0.15);
}

/* ACTIONS */
.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 3;
}

.card-edit-btnn,
.card-delete-btnn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition:
    opacity 0.25s ease,
    transform 0.2s ease;
}

.card-edit-btnn {
  color: black;
}

.recipe-card:hover .card-edit-btnn,
.recipe-card:hover .card-delete-btnn {
  opacity: 1;
}

.card-edit-btnn {
  background: #cfa900;
}
.card-edit-btnn:hover {
  background: #b39200;
  transform: scale(1.05);
}

.card-delete-btnn {
  background: #e74c3c;
}
.card-delete-btnn:hover {
  background: #8a291e;
  transform: scale(1.05);
}

/* LINK */
.card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* IMAGE */
.recipe-image {
  height: 70%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.06);
}

/* INFO */
.recipe-info {
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  background: linear-gradient(to top, #ffffff, #fff7f7);
}

.recipe-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #3b2c2c;
  text-align: center;
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

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.2s ease-in;
}

.popup-overlay-edit {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.2s ease-in;
}

.popup-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  padding: 25px 30px;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
  min-width: 320px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transform: scale(0.8);
  animation: scaleUp 0.2s forwards;
}

.popup-card-edit {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  padding: 30px 40px;
  border-radius: 18px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);

  width: 70vw;
  max-width: 900px;

  min-height: 80vh;
  overflow-y: auto;

  display: flex;
  flex-direction: column;

  animation: scaleUp 0.25s ease-out;
}

.popup-card-edit h3 {
  color: black;
  padding-top: 30px;
}

.popup-card-edit textarea {
  min-height: 140px;
  resize: vertical;
}

.popup-card h3 {
  font-size: 1.4rem;
  margin: 0;
  text-align: center;
  color: #333;
}

.popup-input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.popup-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.popup-buttonss {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-add {
  background: #743f3f;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #743f3f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-cancel {
  background: #c7c7c7;
  color: #555;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

/* Animacije */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}
</style>
