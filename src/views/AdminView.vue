<template>
  <div class="admin-page">
    <h1 class="title">Admin panel</h1>
    <p class="subtitle">Upravljanje sadržajem aplikacije</p>

    <div class="admin-sections">
      <div class="admin-card" @click="openModal('recipes')">
        <span class="icon">🍲</span>
        <h3>Recepti</h3>
        <p>Dodavanje, izmena i brisanje recepata</p>
      </div>

      <div class="admin-card" @click="openModal('categories')">
        <span class="icon">📂</span>
        <h3>Kategorije</h3>
        <p>Organizacija recepata po kategorijama</p>
      </div>

      <div class="admin-card" @click="openModal('ingredients')">
        <span class="icon">🥕</span>
        <h3>Sastojci</h3>
        <p>Upravljanje sastojcima</p>
      </div>

      <div class="admin-card" @click="openModal('comments')">
        <span class="icon">💬</span>
        <h3>Komentari</h3>
        <p>Moderacija komentara korisnika</p>
      </div>

      <div class="admin-card" @click="openModal('users')">
        <span class="icon">👤</span>
        <h3>Korisnici</h3>
        <p>Pregled i kontrola korisnika</p>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ activeTitle }}</h2>
          <button class="close" @click="closeModal">✕</button>
        </div>
        <div class="modal-content">
          <div v-if="activeTable === 'recipes'" class="cards-container">
            <div v-for="rec in recipes" :key="rec.rec_id" class="recipe-card">
              <button class="card-delete-btn">🗑</button>

              <img
                :src="`http://565q123.e2.mars-hosting.com${rec.image}`"
                alt="Slika recepta"
                class="recipe-image"
              />
              <div class="recipe-info">
                <h4>{{ rec.rec_name }}</h4>
              </div>
            </div>
          </div>

          <div v-if="activeTable === 'categories'" class="cards-container-wrapper">
            <!-- Dugme za otvaranje popup-a -->
            <div class="add-category-wrapper">
              <button class="add-btn" @click="showAddPopup = true">➕ Dodaj kategoriju</button>
            </div>

            <!-- Lista kategorija -->
            <div class="cards-container">
              <div v-for="cat in categories" :key="cat.cat_id" class="category-card">
                <button class="card-delete-btnn" @click="deleteCategory(cat.cat_id)" title="Obriši">
                  ✖
                </button>
                <div class="category-info">
                  <h4>{{ cat.cat_name }}</h4>
                </div>
              </div>
            </div>

            <!-- Popup za dodavanje nove kategorije -->
            <div v-if="showAddPopup" class="popup-overlay">
              <div class="popup-card">
                <h3>Dodaj novu kategoriju</h3>

                <input
                  type="text"
                  v-model="newCategoryName"
                  placeholder="Ime kategorije"
                  class="popup-input"
                />

                <div class="popup-buttons">
                  <button class="btn-add" @click="addCategory()">Dodaj</button>
                  <button class="btn-cancel" @click="showAddPopup = false">Otkaži</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTable === 'ingredients'" class="cards-container-wrapper">
            <div class="add-ingredient-wrapper">
              <button class="add-btn" @click="action = 'add'">➕ Dodaj sastojak</button>
            </div>

            <div class="cards-container">
              <div v-for="ing in ingredients" :key="ing.ing_id" class="ingredient-card">
                <button class="card-delete-btn">🗑</button>

                <div class="ingredient-info">
                  <h4>{{ ing.ing_name }}</h4>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTable === 'comments'" class="cards-comment-wrapper">
            <!-- Tabela komentara -->
            <div class="comments-table-wrapper">
              <table class="comments-table">
                <thead>
                  <tr>
                    <th>Korisnik</th>
                    <th>Recept</th>
                    <th>Datum</th>
                    <th>Komentar</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="com in comments" :key="com.com_id">
                    <td>{{ com.usr_fullname }} ({{ com.usr_username }})</td>
                    <td>{{ com.rec_name }}</td>
                    <td>{{ new Date(com.com_timecreated).toLocaleString() }}</td>
                    <td>{{ com.com_text }}</td>
                    <td>
                      <button>🗑 Obriši</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="activeTable === 'users'" class="cards-users-wrapper">
            <!-- Tabela komentara -->
            <div class="users-table-wrapper">
              <table class="users-table">
                <thead>
                  <tr>
                    <th>Korisnik</th>
                    <th>Email</th>
                    <th>Datum</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="usr in users" :key="usr.usr_id">
                    <td>{{ usr.usr_fullname }} ({{ usr.usr_username }})</td>
                    <td>{{ usr.usr_email }}</td>
                    <td>{{ new Date(usr.usr_timecreated).toLocaleString() }}</td>
                    <td>
                      <button>🗑 Obriši</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api'
import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '@/stores/sessionUser'

const session = useSessionStore()

const showModal = ref(false)
const activeTable = ref(null)
const action = ref(null)

const openModal = (table) => {
  activeTable.value = table
  action.value = null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  activeTable.value = null
  action.value = null
}

const titles = {
  recipes: 'Upravljanje receptima',
  categories: 'Upravljanje kategorijama',
  ingredients: 'Upravljanje sastojcima',
  comments: 'Upravljanje komentarima',
  users: 'Upravljanje korisnicima',
}

const activeTitle = computed(() => titles[activeTable.value])

const recipes = ref([])
const categories = ref([])
const ingredients = ref([])
const comments = ref([])
const users = ref([])

async function getAll() {
  try {
    const rec = await api.adminRecipes(session.sid)
    const cat = await api.adminCategories(session.sid)
    const ing = await api.adminIngredients(session.sid)
    const com = await api.adminComments(session.sid)
    const usr = await api.adminUsers(session.sid)
    recipes.value = rec.data.data
    categories.value = cat.data.data
    ingredients.value = ing.data.data
    comments.value = com.data.data
    users.value = usr.data.data
    console.log(rec.data, cat.data, ing.data, com.data, usr.data)
  } catch (error) {
    console.log(error)
  }
}

async function deleteCategory(cat_id) {
  try {
    const res = await api.adminDeleteCategories(cat_id)
    console.log(res.data)
    console.log('Uspesno obrisano')
    await getAll()
  } catch (error) {
    console.log(error)
  }
}

const showAddPopup = ref(false)
const newCategoryName = ref('')

async function addCategory() {
  if (!newCategoryName.value.trim()) {
    alert('Unesite ime kategorije')
    return
  }

  try {
    const res = await api.adminPostCategory(newCategoryName.value)
    console.log(res.data)
    newCategoryName.value = ''
    showAddPopup.value = false
    console.log('Kategorija dodata')
    await getAll()
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  getAll()
})
</script>

<style scoped>
.admin-page {
  padding-top: 130px;
  max-width: 900px;
  margin-inline: auto;
  height: 100vh;
}

.title {
  color: #743f3f;
  font-weight: bold;
  font-size: 50px;
  margin-bottom: 6px;
  text-align: center;
}

.subtitle {
  color: #777;
  margin-bottom: 80px;
  text-align: center;
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 22px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f9f9f9, #fff);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.admin-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 30px;
}

.admin-card h3 {
  margin: 0;
  font-size: 18px;
}

.admin-card p {
  margin: 2px 0 0;
  color: #666;
  font-size: 14px;
}

.close {
  font-size: 22px;
  border: none;
  background: none;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

.actions button {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  width: 800px;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
}

.modal-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.recipe-card {
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.recipe-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.recipe-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.recipe-card {
  position: relative;
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 450px;
}

.card-delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #e05a4b;
  color: #fff;
  border: none;
  font-size: 25px;
  border-radius: 6px;
  padding: 4px 8px;
  height: 40px;
  cursor: pointer;
  z-index: 2;
  transition: background 0.3s;
}

.card-delete-btn:hover {
  background-color: #f01f07;
}

.recipe-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.recipe-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cards-container-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.add-category-wrapper {
  display: flex;
  justify-content: flex-start;
}

.add-btn {
  background-color: #27ae60; /* zeleno */
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background-color: #1e8449;
}

/* Grid kartica */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

/* Kartica kategorije */
.category-card {
  position: relative;
  background: #fafafa;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* Dugme za brisanje */
.card-delete-btnn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: red;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.card-delete-btnn:hover {
  background: #832c23;
  color: #fff;
  transition: 0.2s;
}

.category-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.ingredient-card {
  position: relative;
  background: #fafafa;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* Dugme za brisanje */
.card-delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-weight: bold;
  z-index: 2;
  transition: background 0.2s;
}

.card-delete-btn:hover {
  background-color: #c0392b;
}

.ingredient-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.cards-comment-wrapper {
  max-height: 1000px; /* popup scroll ako je puno komentara */
  overflow-y: auto;
  padding-right: 8px;
  width: 95%; /* povećana širina popup-a */
  margin: 0 auto; /* centrirano */
}

.comments-table-wrapper {
  width: 100%;
  overflow-x: auto; /* ako tabela bude preširoka, pojaviće se horizontalni scroll */
}

.comments-table {
  width: 100%;
  min-width: 700px; /* minimalna širina da tabela ne bude preuska */
  border-collapse: collapse;
  font-size: 14px; /* malo veći font */
}

.comments-table th,
.comments-table td {
  border: 1px solid #ddd;
  padding: 10px 12px; /* veći padding za preglednost */
  text-align: left;
}

.comments-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.card-delete-btn {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px; /* veće dugme */
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.card-delete-btn:hover {
  background-color: #c0392b;
}

.cards-users-wrapper {
  max-height: 1000px; /* popup scroll ako je puno komentara */
  overflow-y: auto;
  padding-right: 8px;
  width: 95%; /* povećana širina popup-a */
  margin: 0 auto; /* centrirano */
}

.users-table-wrapper {
  width: 100%;
  overflow-x: auto; /* ako tabela bude preširoka, pojaviće se horizontalni scroll */
}

.users-table {
  width: 100%;
  min-width: 700px; /* minimalna širina da tabela ne bude preuska */
  border-collapse: collapse;
  font-size: 14px; /* malo veći font */
}

.users-table th,
.users-table td {
  border: 1px solid #ddd;
  padding: 10px 12px; /* veći padding za preglednost */
  text-align: left;
}

.users-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.card-delete-btn {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px; /* veće dugme */
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.card-delete-btn:hover {
  background-color: #c0392b;
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
