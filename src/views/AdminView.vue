<template>
  <div class="admin-page">
    <h1 class="title">Admin panel</h1>
    <p class="subtitle">Upravljanje sadržajem aplikacije</p>

    <div class="admin-sections">
      <div class="admin-card" @click="openModal('recipes')">
        <span class="icon">🍲</span>
        <h3>Recepti</h3>
        <p>Izmena i brisanje recepata</p>
      </div>

      <div class="admin-card" @click="openModal('categories')">
        <span class="icon">📂</span>
        <h3>Kategorije</h3>
        <p>Brisanje i dodavanje kategorije</p>
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
            <h2>
              <strong style="color: red">✖ - </strong>Direktno brisanje <br />
              <strong style="color: black">✎ - </strong>Direktna izmena
            </h2>

            <div v-for="rec in recipes" :key="rec.rec_id" class="recipe-card">
              <button class="card-delete-btnn" @click="deleteRecipe(rec.rec_id)">✖</button>
              <button class="card-edit-btnn" @click="openEditPopup(rec)">✎</button>

              <img :src="config.imageUrl + rec.rec_id" alt="Slika recepta" class="recipe-image" />

              <div class="recipe-info">
                <h4>{{ rec.rec_name }}</h4>
              </div>
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

          <div v-if="activeTable === 'categories'" class="cards-container-wrapper">
            <h2><strong style="color: red">✖ - </strong>Direktno brisanje</h2>
            <div class="add-category-wrapper">
              <button class="add-btn" @click="showAddPopup = true">+ Dodaj kategoriju</button>
            </div>

            <div class="cards-container">
              <div v-for="cat in categories" :key="cat.cat_id" class="category-card">
                <button class="card-delete-btnn" @click="deleteCategory(cat.cat_id)">✖</button>
                <div class="category-info">
                  <h4>{{ cat.cat_name }}</h4>
                </div>
              </div>
            </div>

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
            <h2><strong style="color: red">✖ - </strong>Direktno brisanje</h2>
            <div class="add-ingredient-wrapper">
              <button class="add-btn" @click="showAddPopup = true">➕ Dodaj sastojak</button>
            </div>

            <div class="cards-container">
              <div v-for="ing in ingredients" :key="ing.ing_id" class="ingredient-card">
                <button class="card-delete-btnn" @click="deleteIngredient(ing.ing_id)">✖</button>
                <div class="ingredient-info">
                  <h4>{{ ing.ing_name }}</h4>
                </div>
              </div>
            </div>

            <div v-if="showAddPopup" class="popup-overlay">
              <div class="popup-card">
                <h3>Dodaj novi sastojak</h3>
                <input
                  type="text"
                  v-model="newIngredientName"
                  placeholder="Ime sastojka"
                  class="popup-input"
                />
                <div class="popup-buttons">
                  <button class="btn-add" @click="addIngredient()">Dodaj</button>
                  <button class="btn-cancel" @click="showAddPopup = false">Otkaži</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTable === 'comments'" class="cards-comment-wrapper">
            <h2><strong style="color: red">✖ - </strong>Direktno brisanje</h2>
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
                      <button class="card-delete" @click="deleteComment(com.com_id)">✖</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="activeTable === 'users'" class="cards-users-wrapper">
            <h2><strong style="color: red">✖ - </strong>Direktno brisanje</h2>
            <div class="users-table-wrapper">
              <table class="users-table">
                <thead>
                  <tr>
                    <th>Korisnik</th>
                    <th>Email</th>
                    <th>Datum kreiranja</th>
                    <th>Status</th>
                    <th>Daj rolu</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="usr in users" :key="usr.usr_id">
                    <td>{{ usr.usr_fullname }} ({{ usr.usr_username }})</td>
                    <td>{{ usr.usr_email }}</td>
                    <td>{{ new Date(usr.usr_timecreated).toLocaleString() }}</td>
                    <td>
                      {{ usr.usr_roles && usr.usr_roles.trim() !== '' ? usr.usr_roles : 'user' }}
                    </td>

                    <td class="role-cell">
                      <div class="multi-select-dropdown">
                        <button @click="usr.showDropdown = !usr.showDropdown" class="dropdown-btn">
                          {{ usr.newRoles.length ? usr.newRoles.join(', ') : 'Dodeliti rolu' }}
                        </button>

                        <div v-if="usr.showDropdown" class="dropdown-options">
                          <label v-for="role in availableRoles" :key="role">
                            <input type="checkbox" :value="role" v-model="usr.newRoles" />
                            {{ role }}
                          </label>
                        </div>
                      </div>

                      <button class="btn-save" @click="saveUserRole(usr)">Sačuvaj</button>
                    </td>

                    <td>
                      <button class="card-delete" @click="deleteUser(usr.usr_id)">✖</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSuccess" class="success-popup">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import api from '@/api'
import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '@/stores/sessionUser'

import config from '@/api/config'

const session = useSessionStore()

const showModal = ref(false)
const activeTable = ref(null)
const action = ref(null)

const recipes = ref([])
const categories = ref([])
const ingredients = ref([])
const comments = ref([])
const users = ref([])

const showAddPopup = ref(false)
const newCategoryName = ref('')
const newIngredientName = ref('')
const isEditPopupOpen = ref(false)

const editRecipeData = ref({
  rec_id: null,
  rec_name: '',
  rec_description: '',
  rec_preparation: '',
  rec_instructions: '',
})

const successMessage = ref('')
const showSuccess = ref(false)

function triggerSuccess(msg) {
  successMessage.value = msg
  showSuccess.value = true
  setTimeout(() => (showSuccess.value = false), 2000)
}

const openModal = (table) => {
  activeTable.value = table
  action.value = null
  showModal.value = true

  if (table === 'users') {
    users.value.forEach((u) => {
      u.newRoles = u.usr_roles ? u.usr_roles.split(', ') : []
      u.showDropdown = false
    })
  }
}

const availableRoles = ref([])

const fetchRoles = async () => {
  try {
    const res = await api.getRoles(session.sid)
    // backend vraća roles unutar data
    availableRoles.value = res.data.data.roles.map((r) => r.rol_name)
  } catch (err) {
    console.error('Greška pri učitavanju rola:', err)
  }
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

async function getAll() {
  try {
    const [rec, cat, ing, com, usr] = await Promise.all([
      api.adminRecipes(session.sid),
      api.adminCategories(session.sid),
      api.adminIngredients(session.sid),
      api.adminComments(session.sid),
      api.adminUsers(session.sid),
    ])
    recipes.value = rec.data.data.recipes
    categories.value = cat.data.data
    ingredients.value = ing.data.data
    comments.value = com.data.data
    users.value = usr.data.data.map((u) => ({
      ...u,
      newRoles: u.usr_roles ? u.usr_roles.split(', ') : [],
      showDropdown: false,
    }))
  } catch (err) {
    console.log(err)
  }
}

function openEditPopup(rec) {
  editRecipeData.value = { ...rec }
  isEditPopupOpen.value = true
}

function closeEditPopup() {
  isEditPopupOpen.value = false
}

async function deleteRecipe(rec_id) {
  if (!confirm('Da li si siguran da želiš da obrišeš ovaj recept?')) return
  try {
    await api.adminDeleteRecipes(session.sid, rec_id)
    await getAll()
    triggerSuccess('Recept uspešno obrisan ✅')
  } catch (err) {
    console.log(err)
  }
}

async function editRecipe() {
  try {
    await api.adminEditRecipes(editRecipeData.value, session.sid)
    isEditPopupOpen.value = false
    await getAll()
    triggerSuccess('Recept uspešno izmenjen ✅')
  } catch (err) {
    console.log(err)
  }
}

async function addCategory() {
  const name = newCategoryName.value.trim()
  if (!name) return alert('Unesite ime kategorije')

  try {
    // backend očekuje query param, ne body
    await api.adminPostCategory(name, session.sid)

    newCategoryName.value = ''
    showAddPopup.value = false
    await getAll()
    triggerSuccess('Kategorija uspešno dodata ✅')
  } catch (err) {
    console.error(err)
    if (err.response?.data?.message) alert(`Greška: ${err.response.data.message}`)
    else alert('Greška prilikom dodavanja kategorije')
  }
}

async function deleteCategory(cat_id) {
  if (!cat_id) return alert('Nije izabrana kategorija')
  if (!confirm('Da li si siguran da želiš da obrišeš ovu kategoriju?')) return

  try {
    // POZIV API
    await api.adminDeleteCategory(cat_id, session.sid)

    // REFRESH LISTE
    await getAll()
    triggerSuccess('Kategorija uspešno obrisana ✅')
  } catch (err) {
    console.error(err)
    if (err.response?.data?.message) {
      alert(`Greška: ${err.response.data.message}`)
    } else {
      alert('Greška prilikom brisanja kategorije')
    }
  }
}

async function addIngredient() {
  if (!newIngredientName.value.trim()) return alert('Unesite ime sastojka')
  try {
    await api.adminPostIngredients(newIngredientName.value, session.sid)
    newIngredientName.value = ''
    showAddPopup.value = false
    await getAll()
    triggerSuccess('Sastojak uspešno dodat ✅')
  } catch (err) {
    console.log(err)
  }
}

async function deleteIngredient(ing_id) {
  if (!confirm('Da li si siguran da želiš da obrišeš ovaj sastojak?')) return
  try {
    await api.adminDeleteIngredients(session.sid, ing_id)
    await getAll()
    triggerSuccess('Sastojak uspešno obrisan ✅')
  } catch (err) {
    console.log(err)
  }
}

// AdminView.vue
async function deleteComment(com_id) {
  if (!confirm('Da li si siguran da želiš da obrišeš ovaj komentar?')) return

  try {
    const res = await api.adminDeleteComment(session.sid, com_id)
    console.log('Response from delete:', res) // ovde vidiš com_id
    await getAll() // osveži listu komentara
    triggerSuccess(`Komentar ${res.com_id} uspešno obrisan ✅`)
  } catch (err) {
    console.log('Greška pri brisanju:', err)
  }
}

async function deleteUser(usr_id) {
  if (!confirm('Da li si siguran da želiš da obrišeš ovog korisnika?')) return

  try {
    const res = await api.adminDeleteUser(session.sid, usr_id)
    console.log('Response from delete:', res) // vidiš usr_id

    await getAll() // ❗ čekamo da se lista osveži
    triggerSuccess(`Korisnik ${usr_id} uspešno obrisan ✅`)
  } catch (err) {
    console.log(err)
    const msg = err.response?.data?.message || 'Greška pri brisanju korisnika ❌'
    triggerSuccess(msg)
  }
}

async function saveUserRole(user) {
  if (!user.newRoles || user.newRoles.length === 0) {
    triggerSuccess('Rola nije promenjena ❌')
    return
  }

  try {
    const res = await api.adminUpdateUserRole({
      usr_id: user.usr_id,
      roles: user.newRoles.join(','),
      sid: session.sid,
    })

    if (res?.data?.success) {
      await getAll()
      triggerSuccess('Uspesno promenjena rola korisnika ✅')
    } else {
      alert(res?.data?.message || 'Došlo je do greške na serveru ❌')
    }
  } catch (err) {
    console.log('ERROR:', err?.response?.data || err)
    alert(err?.response?.data?.message || 'Server greška ❌')
  }
}

onMounted(() => {
  getAll()
  fetchRoles()
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
  width: 1100px; /* bilo 1000px */
  max-height: 100vh;
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
  margin-bottom: 20px;
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
  width: 32px;
  height: 32px;
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

.card-edit-btnn {
  position: absolute;
  top: 8px;
  right: 50px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: yellow;
  color: black;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.card-edit-btnn:hover {
  background: rgb(172, 172, 1);
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

.ingredient-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.cards-comment-wrapper {
  max-height: 70vh; /* popup scroll ako ima puno komentara */
  overflow-y: auto;
  padding: 10px 20px;
}

/* Wrapper same tabele */
.comments-table-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  background: #fff;
}

/* Sama tabela */
.comments-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

/* Zaglavlje tabele */
.comments-table th {
  background: #f5f5f5;
  text-align: left;
  padding: 12px 15px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

/* Redovi tabele */
.comments-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
  color: #555;
}

/* Hover efekat na red */
.comments-table tbody tr:hover {
  background-color: #fafafa;
  transition: background 0.2s;
}

/* Dugme za brisanje */
.card-delete {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 5px 9px;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

.card-delete:hover {
  background-color: #832c23;
}

/* Responsive mobilni prikaz */
@media (max-width: 768px) {
  .comments-table th,
  .comments-table td {
    font-size: 12px;
    padding: 8px 10px;
  }

  .card-delete {
    padding: 4px 6px;
    font-size: 12px;
  }
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

.success-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #27ae60; /* zeleno */
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

.btn-save {
  background-color: #27ae60;
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.btn-save:hover {
  background-color: #1e8449;
}

.role-cell {
  display: flex;
  align-items: center;
  gap: 8px; /* razmak između selecta i dugmeta */
}

/* Select stil */
.role-cell select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px; /* širina selecta */
}

/* Fokus efekat */
.role-cell select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.4);
}

/* Opcije */
.role-cell select option {
  padding: 6px 10px;
  font-size: 14px;
}
.role-cell {
  position: relative; /* roditelj postaje reference za apsolutni dropdown */
}
.multi-select-dropdown {
  position: relative;
}
/* Custom checkbox u dropdown-u */
.multi-select-dropdown input[type='checkbox'] {
  appearance: none; /* uklanja default stil checkboxa */
  width: 20px;
  height: 20px;
  border: 2px solid #743f3f; /* boja u skladu sa sajtom */
  border-radius: 6px;
  margin-right: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.multi-select-dropdown input[type='checkbox']:checked {
  background-color: #743f3f;
  border-color: #743f3f;
}

.multi-select-dropdown input[type='checkbox']:checked::after {
  content: '✔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 14px;
}

.multi-select-dropdown label {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
}

.multi-select-dropdown label:hover {
  background-color: rgba(116, 63, 63, 0.1);
}

.multi-select-dropdown .dropdown-options {
  position: absolute; /* lebdi preko ostalog sadržaja */
  top: 100%; /* odmah ispod dugmeta */
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  padding: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10; /* iznad svega ostalog u tabeli */
  width: max-content; /* širina se prilagođava sadržaju */
}
.multi-select-dropdown .dropdown-btn {
  background-color: #743f3f; /* boja sajta */
  color: white; /* tekst bele boje */
  border: none; /* ukloni default border */
  border-radius: 8px; /* blago zaobljeni uglovi */
  padding: 6px 12px; /* prostor unutar buttona */
  font-size: 14px; /* tekst u skladu sa ostalim */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between; /* tekst i strelica na krajevima */
  width: 150px; /* fiksna širina da ne širi red */
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

/* Hover efekat */
.multi-select-dropdown .dropdown-btn:hover {
  background-color: #a05a5a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Strelica animacija */
.multi-select-dropdown .dropdown-btn::after {
  content: '▾';
  margin-left: 8px;
  transition: transform 0.2s;
}

/* Rotacija strelice kada je dropdown otvoren */
.multi-select-dropdown .dropdown-btn.active::after {
  transform: rotate(180deg);
}
</style>
