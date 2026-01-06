<template>
  <div class="hero">
    <div class="add-recipe-wrapper">
      <h2 class="form-title">Dodaj novi recept</h2>

      <div class="form-group">
        <label>Naziv recepta:</label>
        <input type="text" v-model="rec_name" placeholder="Unesi naziv recepta" />
      </div>

      <div class="form-group">
        <label>Kategorija:</label>
        <select v-model="cat_id">
          <option disabled value="">Izaberi kategoriju</option>
          <option v-for="cat in categories" :key="cat.cat_id" :value="cat.cat_id">
            {{ cat.cat_name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Slika:</label>
        <input type="file" @change="onFileChange" />
      </div>

      <div class="form-group">
        <label>Instrukcije:</label>
        <textarea v-model="rec_instructions" placeholder="Koraci za pripremu"></textarea>
      </div>

      <div class="form-group">
        <label>Opis:</label>
        <textarea v-model="rec_description" placeholder="Kratak opis recepta"></textarea>
      </div>

      <div class="form-group">
        <label>Priprema:</label>
        <textarea v-model="rec_preparation" placeholder="Vreme pripreme"></textarea>
      </div>

      <h3>Sastojci</h3>

      <!-- Dodavanje postojećeg sastojka -->
      <div class="ingredient-row">
        <select v-model="selectedIngredient">
          <option disabled value="">Izaberi sastojak...</option>
          <option v-for="ing in ingredientss" :key="ing.ing_id" :value="ing.ing_name">
            {{ ing.ing_name }}
          </option>
        </select>
        <input type="text" v-model="newQuantity" placeholder="Količina" />
        <button class="btn-add" @click="addSelectedIngredient">Dodaj</button>
      </div>

      <!-- Dodavanje novog sastojka -->
      <div class="ingredient-row">
        <input type="text" v-model="customIngredient" placeholder="Unesi novi sastojak" />
        <input type="text" v-model="customQuantity" placeholder="Količina" />
        <button class="btn-add" @click="addCustomIngredient">Dodaj novi</button>
      </div>

      <!-- Lista selektovanih sastojaka -->
      <div class="ingredient-list" v-if="ingredients.length">
        <h4>Izabrani sastojci:</h4>
        <div v-for="(ing, index) in ingredients" :key="index" class="ingredient-item">
          {{ ing.name }} - {{ ing.quantity }}
          <button class="btn-remove" @click="removeIngredient(index)">X</button>
        </div>
      </div>

      <div class="submit-btn">
        <button class="btn-submit" @click="submitRecipe">Sačuvaj recept</button>
      </div>
    </div>
  </div>

  <div v-if="toastMsg" :class="['toast', toastType]">
    <span class="icon">
      {{ toastType === 'error' ? '⚠️' : '✅' }}
    </span>
    <p>{{ toastMsg }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'

const session = useSessionStore()

const rec_name = ref('')
const rec_instructions = ref('')
const rec_description = ref('')
const rec_preparation = ref('')
const cat_id = ref(null)
const image = ref(null)

const ingredients = ref([])
const selectedIngredient = ref('')
const newQuantity = ref('')
const customIngredient = ref('')
const customQuantity = ref('')

const categories = ref([])
const ingredientss = ref([])
const router = useRouter()

async function loadCategories() {
  try {
    const res = await api.getCategories()
    categories.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

async function loadIngredients() {
  try {
    const res = await api.getIngredients()
    ingredientss.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

function addSelectedIngredient() {
  if (!selectedIngredient.value || !newQuantity.value) return
  ingredients.value.push({ name: selectedIngredient.value, quantity: newQuantity.value })
  selectedIngredient.value = ''
  newQuantity.value = ''
}

function addCustomIngredient() {
  if (!customIngredient.value || !customQuantity.value) return
  ingredients.value.push({ name: customIngredient.value, quantity: customQuantity.value })
  customIngredient.value = ''
  customQuantity.value = ''
}

function removeIngredient(index) {
  ingredients.value.splice(index, 1)
}

function onFileChange(e) {
  image.value = e.target.files[0]
}

async function submitRecipe() {
  if (
    !rec_name.value ||
    !rec_instructions.value ||
    !rec_preparation.value ||
    !cat_id.value ||
    !image.value
  ) {
    showToast('Popuni sva obavezna polja!', 'error')
    return
  }

  try {
    const fd = new FormData()
    fd.append('rec_name', rec_name.value)
    fd.append('rec_instructions', rec_instructions.value)
    fd.append('rec_description', rec_description.value)
    fd.append('rec_preparation', rec_preparation.value)
    fd.append('cat_id', cat_id.value)
    fd.append('ingredients', JSON.stringify(ingredients.value))
    fd.append('sid', session.sid) // <-- sid ide u FormData
    fd.append('image', image.value) // File

    // ne šalji sid kao header, samo FormData
    await api.postRecipe(fd)

    showToast('Recept uspešno dodat!', 'success')

    setTimeout(() => {
      router.push('/moji-recepti')
    }, 1200)
  } catch (err) {
    console.error(err)
    showToast('Došlo je do greške prilikom dodavanja recepta.', 'error')
  }
}

onMounted(() => {
  loadCategories()
  loadIngredients()
})

const toastMsg = ref('')
const toastType = ref('error')

function showToast(msg, type = 'error') {
  toastMsg.value = msg
  toastType.value = type

  setTimeout(() => {
    toastMsg.value = ''
  }, 3500)
}
</script>

<style scoped>
/* HERO */
.hero {
  min-height: 100vh;
  width: 100%;
  background:
    linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
    url('/src/components/backgroundimage.jpeg') center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

/* MAIN WRAPPER – WIDE */
.add-recipe-wrapper {
  width: 96%;
  max-width: 1400px;
  background: #fff;
  border-radius: 22px;
  padding: 26px 30px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
}

/* TITLE */
.add-recipe-wrapper h2 {
  text-align: center;
  color: #743f3f;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 18px;
}

.form-title {
  grid-column: 1 / -1; /* 🔥 zauzima ceo grid red */
  text-align: center;

  font-size: 32px;
  font-weight: 600;
  color: #743f3f;
  margin-bottom: 10px;
}

/* FORM LAYOUT – SVE U ŠIRINU */
.add-recipe-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 50px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  background: rgba(255, 255, 255, 0.96);
  border-radius: 24px;
}

/* FORM GROUP */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #743f3f;
  margin-bottom: 4px;
}

/* INPUTS – KOMPAKTNI */
.form-group input,
.form-group textarea,
.form-group select {
  padding: 8px 10px;
  font-size: 13px;
  border-radius: 12px;
  border: 1px solid #d2c0c0;
  transition: 0.2s;
}

.form-group textarea {
  resize: none;
  min-height: 70px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #743f3f;
  box-shadow: 0 0 0 2px rgba(116, 63, 63, 0.2);
}

/* FILE INPUT */
.form-group input[type='file'] {
  padding: 8px;
  background: #f6eaea;
  border: 2px dashed #743f3f;
  cursor: pointer;
}

/* SASTOJCI NASLOV – CELOM ŠIRINOM */
.add-recipe-wrapper h3 {
  grid-column: 1 / -1;
  margin-top: 6px;
  margin-bottom: 6px;
  color: #743f3f;
  font-size: 18px;
  font-weight: 700;
}

.ingredient-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

/* select + input */
.ingredient-row select,
.ingredient-row input {
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(116, 63, 63, 0.4);
  font-size: 14px;
  outline: none;
}

/* širine */
.ingredient-row select {
  width: 200px;
}

.ingredient-row input {
  width: 180px;
}

/* dugme */
.btn-add {
  height: 40px;
  width: 100px;
  padding: 0 18px;
  background: #743f3f;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.25s;
}

.btn-add:hover {
  background: #5f3030;
}

.btn-remove {
  background: none;
  border: none;
  color: #b33a3a;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-remove:hover {
  color: red;
  transform: scale(1.2);
}

.submit-btn {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
select,
textarea {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #d6bcbc;
  font-size: 14px;
}

textarea {
  min-height: 110px;
  resize: none;
}

.submit-btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* INGREDIENT LIST – TAG MODE */
/* Naslov liste */
.ingredient-list h4 {
  color: #743f3f;
  font-size: 16px;
  font-weight: 600;
}

/* Lista tagova */
.ingredient-list {
  grid-column: 1 / -1; /* ceo red */
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0; /* već smo razmak dali h4 */
}

.ingredient-item {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  padding: 8px 12px;
  background: rgba(183, 58, 58, 0.2); /* svetlo crvena pozadina */
  border-radius: 20px;
  font-size: 13px;
  color: #743f3f;
}

.btn-remove {
  background: none;
  border: none;
  color: #b33a3a;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-remove:hover {
  color: red;
  transform: scale(1.2);
}

/* SUBMIT – CELOM ŠIRINOM */
.submit-btn {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 10px;
}

.btn-submit {
  padding: 12px 42px;
  background: #743f3f;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.btn-submit:hover {
  background: #5c2f2f;
}

.toast {
  position: fixed;
  top: 25px;
  right: 25px;
  z-index: 9999;

  min-width: 280px;
  max-width: 380px;
  padding: 16px 20px;

  display: flex;
  align-items: center;
  gap: 12px;

  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;

  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.35s ease;
}

.toast .icon {
  font-size: 22px;
}

/* ERROR */
.toast.error {
  background: #e53935;
  color: #fff;
}

/* SUCCESS */
.toast.success {
  background: #2e7d32;
  color: #fff;
}

@keyframes slideIn {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
