<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <h1 style="color: white; padding-top: 120px; text-align: center; font-size: 40px; background: rgb(109, 68, 68);">
      Instrukcije za pravljenje recepta
    </h1>

    <div class="wrapper" v-if="recipe && recipe.rec_name">
      <div class="recipe-card">
        <h1 class="recipe-title">{{ recipe.rec_name }}</h1>
        <img class="recipe-image" :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" />

        <div class="prep-time">
          <img src="/src/components/clock.png">
          <p>{{ recipe.rec_preparation }}</p>
        </div>

        <br><hr></br>

        <h2 class="sub-title">Sastojci</h2>
        <ul class="ingredients">
          <li v-for="ing in ingredients" :key="ing.ing_id" style="background-color: #743f3f; border: 0;">
            <span class="ing-name">{{ ing.ing_name }}</span>
            <span class="ing-qty">{{ ing.rig_quantity }}</span>
          </li>
        </ul>

        <br><hr></br>

        <h3 style="font-weight: bold; margin-top: 20px; color: white;">Instrukcije</h3>
        <p class="recipe-inst" style="color: white">{{ recipe.rec_instructions }}</p>

        <br><hr></br>

        <h3 style="font-weight: bold; margin-top: 25px; color: white;">Deskripcija</h3>
        <p class="recipe-desc">{{ recipe.rec_description }}</p>
      </div>

      <hr style="width: 150vh; margin-top: 40px; height: 3px; background-color: #5c2e2e; border: 0;"></hr>

      <div v-if="relatedRecipes.length" class="related-section">
        <h3 style="font-weight: bold;">Slični recepti</h3>
        <div class="related-wrapper">
          <RouterLink
            v-for="r in relatedRecipes"
            :key="r.rec_id"
            :to="{ name: 'detalji-recepta', params: { id: r.rec_id } }"
            class="related-card-link"
          >
            <div class="related-card">
              <img :src="`http://565q123.e2.mars-hosting.com${r.image}`" class="related-image" />
              <p class="related-name">{{ r.rec_name }}</p>
              <p class="related-desc">{{ r.rec_description }}</p>
            </div>
          </RouterLink>
        </div>
      </div>

      <div v-else>
        <h1 style="color: white; margin-top: 120px; margin-bottom: 80px; font-weight: bold; font-size: 40px;">Nema sličnih recepta!</h1>
      </div>

      <hr style="width: 150vh; margin-top: 40px; height: 3px; background-color: #5c2e2e; border: 0;"></hr>

      <div class="comments-section">
        <h2>Komentari</h2>

        <!-- Forma za dodavanje komentara -->
        <div v-if="isLoggedIn" class="add-comment">
          <h3>Dodaj komentar</h3>
          <textarea v-model="newComment"></textarea>
          <button @click="postComment">Pošalji</button>
        </div>
        <div v-else class="login-box">
          <p>
            🔒 Morate biti <b>ulogovani</b> da biste dodali komentar.
          </p>
          <button @click="router.push('/login')">Uloguj se</button>
        </div>

        <!-- Lista komentara -->
        <div v-if="comments.length === 0" class="no-comments">
          Nema komentara za ovaj recept.
        </div>

        <div v-else class="comments-list">
          <div v-for="c in comments" :key="c.com_id" class="comment-card">
            <div class="comment-header">
              <span class="comment-user">{{ c.usr_username }}</span>
              <span class="comment-date"> Objavljen: {{ new Date(c.com_timecreated).toLocaleString() }}</span>
            </div>
            <hr class="comment-separator" />
            <p class="comment-text">{{ c.com_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import api from '@/api'
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useSessionStore } from '@/stores/sessionUser'
import router from '@/router'

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
    const res = await api.addComment({
      id: route.params.id,
      comment: newComment.value,
      sid: session.sid
    })

    console.log(res.data)
    newComment.value = ''
    getComments()
  } catch (error) {
    console.log(error)
  }
}


onMounted(() => {
  getRecipe()
  getComments()
})

watch(
  () => route.params.id,
  // eslint-disable-next-line no-unused-vars
  (newId, oldId) => {
    getRecipe()
    getComments()
  }
)
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  background: rgb(109, 68, 68);
}

.recipe-card {
  width: 700px;
  background: #854848;
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
  color: white;
  padding-bottom: 20px;
}

.recipe-desc {
  font-size: 16px;
  color: white;
  padding-bottom: 20px;
}
.sub-title {
  margin-top: 20px;
  font-size: 22px;
  color: white;
}

.ingredients {
  margin-top: 10px;
  padding-left: 0;
  list-style: none;
}

.ingredients li {
  display: flex;
  justify-content: space-between;
  background: #fafafa;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.ing-name {
  font-weight: 600;
  color: white
}

.ing-qty {
  color: white;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 20px;
}

.related-section {
  background: #854848;
  padding: 50px;
  border-radius: 15px;
  margin-top: 30px;
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
  background: #743f3f; /* malo tamnija nijansa */
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
  color: white;
  padding: 20px 5px;
}

.related-desc {
  color: white;
  padding-bottom: 20px;
  font-size: 12px;
  margin-left: 30px;
  margin-right: 30px;
}
.comments-section {
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
  padding: 20px;
  background: #854848;
  border-radius: 15px;
  color: white;
}

.comments-section h2 {
  margin-bottom: 15px;
  font-size: 24px;
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
  background-color: #743f3f;
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
  background-color: #743f3f;
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
  color: rgb(179, 179, 179);
}

.comment-date {
  font-size: 12px;
  font-weight: normal;
  color: #ccc;
}

.comment-separator {
  border: 0;
  border-top: 1px solid #a85c5c;
  margin: 5px 0;
}

.comment-text {
  font-size: 14px;
  color: #f5f5f5;
  line-height: 1.5;
  padding-top: 20px;
}

.login-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  padding: 15px 20px;
  margin: 20px 0;

  background:#743f3f;
  border-radius: 10px;

  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.login-box p {
  margin: 0;
  font-size: 16px;
  color: white;
}

.login-box button {
  background-color: #a85c5c;
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
  background: #743f3f;
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
}

.prep-time img {
  height: 50px;
}

</style>
