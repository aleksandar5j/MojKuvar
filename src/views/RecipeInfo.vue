<!-- eslint-disable vue/no-parsing-error -->
<!-- RecipeInfo.vue -->
<template>
  <div>
    <h1 style="color: #743f3f; padding-top: 120px; text-align: center; font-size: 40px; background-color: rgba(83, 12, 12, 0.2); font-weight: bold;">
      Instrukcije za pravljenje recepta
    </h1>

    <div class="wrapper" v-if="recipe && recipe.rec_name">
      <div class="recipe-card">
        <h1 class="recipe-title">{{ recipe.rec_name }}</h1>
        <img
          class="recipe-image"
          :src="config.imageUrl + recipe.rec_id"
          alt="Recept slika"
        />

        <div class="prep-time">
          <img src="/src/components/clock.png" alt="Clock" />
          <p>{{ recipe.rec_preparation }}</p>
        </div>

        <br><hr style="height: 2px; border: 0; background-color: #743f3f;"></br>

        <h2 class="sub-title">Sastojci</h2>
        <ul class="ingredients">
          <li v-for="ing in ingredients" :key="ing.ing_id" style="border: 0;">
            <span class="ing-name">{{ ing.ing_name }}</span>
            <span class="ing-qty">{{ ing.rig_quantity }}</span>
          </li>
        </ul>

        <br><hr style="height: 2px; border: 0; background-color: #743f3f;"></br>

        <h3 style="font-weight: bold; margin-top: 20px; color: #743f3f; font-size: 25px;margin-bottom: 10px; text-align: center;">Instrukcije</h3>
        <p class="recipe-inst" style="color: #743f3f">{{ recipe.rec_instructions }}</p>
      </div>

      <hr style="width: 120vh; margin-top: 40px; height: 2px; background-color: #5c2e2e; border: 0;"></hr>

      <div class="comments-section">
        <h2>Komentari</h2>

        <div v-if="isLoggedIn" class="add-comment">
          <h3 style="color: #743f3f;">Dodaj komentar</h3>
          <textarea v-model="newComment"></textarea>
          <button @click="postComment">Pošalji</button>
        </div>
        <div v-else class="login-box">
          <p>
            🔒 Morate biti <b>ulogovani</b> da biste dodali komentar.
          </p>
          <button @click="router.push('/login')">Uloguj se</button>
        </div>

        <div v-if="comments.length === 0" class="no-comments" style="color: #743f3f;">
          Nema komentara za ovaj recept.
        </div>

        <div v-else class="comments-list">
          <div v-for="c in comments" :key="c.com_id" class="comment-card">
            <div class="comment-header">
              <span class="comment-user"><img src="/src/components/avatar.png" style="height: 40px; margin-right: 10px; margin-bottom: 7px;">{{ c.usr_username }}</span>
              <span class="comment-date"> Objavljen: {{ new Date(c.com_timecreated).toLocaleString() }}</span>

              <div>
                <button
                  v-if="c.usr_id && c.usr_id === session.user?.usr_id"
                  class="comment-delete-btn"
                  @click="deleteComment(c.com_id)"
                >
                  ✖ Obriši
                </button>
                <button
                  v-if="c.usr_id && c.usr_id === session.user?.usr_id"
                  class="comment-update-btn"
                  @click="openEditPopup(c)"
                >
                  ✎ Izmeni
                </button>
              </div>
            </div>
            <hr class="comment-separator" />
            <p class="comment-text">{{ c.com_text }}</p>
          </div>
        </div>
      </div>

      <hr style="width: 120vh; margin-top: 40px; height: 2px; background-color: #5c2e2e; border: 0;"></hr>

      <div v-if="relatedRecipes.length" class="related-section">
        <h3 style="font-weight: bold; color: #743f3f; font-size: 25px;">Slični recepti</h3>
        <div class="related-wrapper">
          <RouterLink
            v-for="r in relatedRecipes"
            :key="r.rec_id"
            :to="{ name: 'detalji-recepta', params: { id: r.rec_id } }"
            class="related-card-link"
          >
            <div class="related-card">
              <img
                :src="config.imageUrl + r.rec_id"
                class="related-image"
                alt="Sličan recept"
              />
              <p class="related-name">{{ r.rec_name }}</p>
              <p class="related-desc">{{ r.rec_description }}</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <div v-else>
        <h1 style="color: #743f3f; margin-top: 120px; margin-bottom: 80px; font-weight: bold; font-size: 40px;">Nema sličnih recepta!</h1>
      </div>
    </div>

    <div v-if="isEditPopupOpen" class="edit-popup-overlay">
      <div class="edit-popup">
        <h3>Izmeni komentar</h3>
        <textarea v-model="editCommentData.com_text" rows="4" class="edit-textarea"></textarea>
        <div class="edit-actions">
          <button @click="updateComment" class="btn-save">Sačuvaj</button>
          <button @click="closeEditPopup" class="btn-cancel">Otkaži</button>
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
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useSessionStore } from '@/stores/sessionUser'
import router from '@/router'

import config from '@/api/config'

const session = useSessionStore()
const isLoggedIn = session.isLoggedIn

const route = useRoute()
const recipe = ref({})
const ingredients = ref([])
const relatedRecipes = ref([])

async function getRecipe() {
  try {
    const res = await api.getRecipeId(route.params.id)
    recipe.value = res.data.data.recipe
    ingredients.value = res.data.data.ingredients

    const related = await api.getRelatedRecipes(route.params.id)
    relatedRecipes.value = related.data.data.data
  } catch (error) {
    console.log('AxiosErrorcode:', error.code)
    console.log(error)
  }
}

const comments = ref([])

async function getComments() {
  try {
    const res = await api.getComments(route.params.id)
    comments.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

const newComment = ref('')

async function postComment() {
  try {
    await api.addComment({
      id: route.params.id,
      comment: newComment.value,
      sid: session.sid
    })
    newComment.value = ''
    getComments()
    triggerSuccess('Komentar uspešno dodat ✅')
  } catch (error) {
    console.log(error)
  }
}

async function deleteComment(com_id) {
  const confirmDelete = window.confirm('Da li si siguran da želiš da obrišeš svoj komentar?')
  if (!confirmDelete || !isLoggedIn) return
  try {
    await api.deleteOwnComment(session.sid, com_id)
    await getComments()
    triggerSuccess('Komentar uspešno obrisan ✅')
  } catch (err) {
    console.error(err)
  }
}

const isEditPopupOpen = ref(false)
const editCommentData = ref({ com_id: null, usr_id: null, com_text: '' })

function openEditPopup(c) {
  editCommentData.value = { com_id: c.com_id, com_text: c.com_text }
  isEditPopupOpen.value = true
}

function closeEditPopup() {
  isEditPopupOpen.value = false
}

async function updateComment() {
  if (!isLoggedIn) return
  try {
    await api.updateOwnComment({
      com_id: editCommentData.value.com_id,
      com_text: editCommentData.value.com_text,
      sid: session.sid
    })
    isEditPopupOpen.value = false
    await getComments()
    triggerSuccess('Komentar uspešno izmenjen ✏️')
  } catch (error) {
    console.error(error)
  }
}

const successMessage = ref('')
const showSuccess = ref(false)
function triggerSuccess(msg) {
  successMessage.value = msg
  showSuccess.value = true
  setTimeout(() => { showSuccess.value = false }, 3000)
}

onMounted(() => {
  getRecipe()
  getComments()
})

watch(() => route.params.id, () => {
  getRecipe()
  getComments()
})
</script>



<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background-color: rgba(83, 12, 12, 0.2);
}

.recipe-card {
  width: 900px;
  background: #ffc7c7;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
}

.recipe-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
}

.recipe-title {
  margin: 0;
  font-size: 26px;
  font-weight: bold;
  color: #743f3f;
  padding-bottom: 20px;
}

.recipe-desc {
  font-size: 16px;
  color: white;
  padding-bottom: 20px;
}
.sub-title {
  margin-top: 20px;
  font-size: 25px;
  text-align: center;
  font-weight: bold;
  color: #743f3f;
}

.ingredients {
  margin-top: 10px;
  padding-left: 0;
  list-style: none;
}

.ingredients li {
  display: flex;
  justify-content: space-between;
  background-color: rgba(83, 12, 12, 0.2);
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.ing-name {
  font-weight: 600;
  color: #743f3f
}

.ing-qty {
  color: #743f3f;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 20px;
}

.related-section {
  background: #ffc7c7;
  padding: 50px;
  border-radius: 15px;
  margin-top: 30px;
  min-width: 900px;
}

.related-section h3 {
  color: white;
  font-size: 22px;
  margin-bottom: 20px;
  text-align: center;
}

.related-wrapper {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.related-card {
  width: 250px;       /* veće kartice */
  background-color: rgba(83, 12, 12, 0.2);
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.related-card:hover {
  transform: scale(1.05);
}

.related-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.related-name {
  font-size: 20px;
  font-weight: bold;
  color: #743f3f;
  padding: 20px 5px;
}

.related-desc {
  color: #743f3f;
  padding-bottom: 20px;
  font-size: 13px;
  margin-left: 30px;
  margin-right: 30px;
}
.comments-section {
  width: 100%;
  max-width: 900px;
  margin-top: 40px;
  padding: 20px;
  background: #ffc7c7;
  border-radius: 15px;
  color: white;
}

.comments-section h2 {
  margin-bottom: 15px;
  font-size: 25px;
  color: #743f3f;
  font-weight: bold;
  text-align: center;
}

.add-comment {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  color: white;
}

.add-comment textarea {
  padding: 10px;
  border-radius: 10px;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 10px;
  border: none;
  font-size: 14px;
  color: white;
  background-color: rgba(83, 12, 12, 0.2);
}

.add-comment button {
  align-self: flex-end;
  padding: 8px 20px;
  border-radius: 50px;
  background-color: #743f3f;
  color: white;
  border: none;
  cursor: pointer;
}

.add-comment h3 {
  align-self: flex-start;
}

.add-comment button:hover {
  opacity: 0.6;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-card {
  background-color: rgba(83, 12, 12, 0.2);
  padding: 15px;
  border-radius: 10px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #fff;
}

.comment-user {
  font-size: 25px;
  color: #743f3f;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comment-date {
  font-size: 12px;
  font-weight: normal;
  color: #743f3f;
}

.comment-separator {
  border: 0;
  border-top: 1px solid #a85c5c;
  margin: 5px 0;
}

.comment-text {
  font-size: 14px;
  color: #743f3f;
  line-height: 1.5;
  padding-top: 20px;
}

.comment-delete-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  padding-top: 4px;
  padding-bottom: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

.comment-delete-btn:hover {
  background: #992e22;
}

.comment-update-btn {
  background: #af8000;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  padding-top: 4px;
  padding-bottom: 6px;
  padding-left: 12px;
  padding-right: 12px;
  margin-left: 10px;
}

.comment-update-btn:hover {
  background: #9c7300;
}

.login-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  padding: 15px 20px;
  margin: 20px 0;

  background-color: rgba(83, 12, 12, 0.2);
  border-radius: 10px;

  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.login-box p {
  margin: 0;
  font-size: 16px;
  color: #743f3f;
}

.login-box button {
  background-color: #b46e6e;
  color: #fff;

  border: none;
  border-radius: 8px;

  padding: 8px 18px;
  font-size: 15px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;
}

.login-box button:hover {
  background-color: #8f4a4a;
  transform: translateY(-1px);
}

.prep-time {
  display: flex;
  flex-direction: row;
  background-color: rgba(83, 12, 12, 0.2);
  border-radius: 10px;
  padding: 5px;
  gap: 15px;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 15px;
}

.prep-time p {
  font-weight: bold;
  font-size: 20px;
  color: #743f3f;
}

.prep-time img {
  height: 50px;
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

.edit-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Popup box */
.edit-popup {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: popupFadeIn 0.25s ease;
}

/* Title */
.edit-popup h3 {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

/* Textarea */
.edit-textarea {
  width: 100%;
  resize: none;
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}

.edit-textarea:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.15);
}

/* Buttons */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

.btn-save {
  background: #743f3f;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-save:hover {
  background: #532d2d;
}

.btn-save:active {
  transform: scale(0.97);
}

.btn-cancel {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #ddd;
}

/* Animation */
@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .edit-popup {
    margin: 0 14px;
  }
}

@media (max-width: 600px) {

  h1 {
    font-size: 26px !important;
    padding-top: 90px !important;
  }

  .wrapper {
    padding: 16px;
  }

  /* CARD */
  .recipe-card {
    width: 100%;
    padding: 18px;
    border-radius: 18px;
  }

  .recipe-title {
    font-size: 22px;
    text-align: center;
  }

  .recipe-image {
    height: 220px;
    border-radius: 14px;
  }

  /* PREP TIME */
  .prep-time {
    gap: 10px;
    padding: 10px;
  }

  .prep-time img {
    height: 36px;
  }

  .prep-time p {
    font-size: 16px;
  }

  /* INGREDIENTS */
  .sub-title {
    font-size: 20px;
  }

  .ingredients li {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .ing-name {
    font-size: 15px;
  }

  .ing-qty {
    font-size: 14px;
  }

  /* INSTRUCTIONS */
  .recipe-inst {
    font-size: 14px;
    line-height: 1.6;
    text-align: left;
  }

  hr {
    width: 100% !important;
  }

  /* COMMENTS */
  .comments-section {
    padding: 16px;
    border-radius: 18px;
  }

  .comments-section h2 {
    font-size: 22px;
  }

  .add-comment textarea {
    font-size: 14px;
    min-height: 100px;
  }

  .add-comment button {
    align-self: stretch;
    padding: 12px 0;
    font-size: 15px;
  }

  .comment-card {
    padding: 14px;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .comment-user {
    font-size: 18px;
  }

  .comment-date {
    font-size: 11px;
  }

  .comment-text {
    font-size: 14px;
    padding-top: 10px;
  }

  .comment-delete-btn,
  .comment-update-btn {
    font-size: 13px;
    padding: 6px 12px;
    margin-top: 6px;
  }

  /* LOGIN BOX */
  .login-box {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .login-box button {
    width: 100%;
    padding: 10px 0;
  }

  /* RELATED */
  .related-section {
    min-width: auto;
    padding: 20px;
  }

  .related-wrapper {
    flex-direction: column;
    gap: 16px;
  }

  .related-card {
    width: 100%;
  }

  .related-image {
    height: 180px;
  }

  .related-name {
    font-size: 18px;
    padding: 12px 6px;
  }

  .related-desc {
    font-size: 13px;
    margin: 0 16px 12px;
  }

  /* SUCCESS POPUP */
  .success-popup {
    top: auto;
    bottom: 20px;
    right: 50%;
    transform: translateX(50%);
    width: calc(100% - 40px);
    text-align: center;
    border-radius: 14px;
    font-size: 14px;
  }
}

</style>
