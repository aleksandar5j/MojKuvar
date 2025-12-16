<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <h1 style="color: white; padding-top: 120px; text-align: center; font-size: 40px; background-color: #743f3f;">
      Instrukcije za pravljenje recepta
    </h1>

    <div class="wrapper" v-if="recipe && recipe.rec_name">
      <div class="recipe-card">
        <h1 class="recipe-title">{{ recipe.rec_name }}</h1>
        <img class="recipe-image" :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" />

        <p class="recipe-prep"><strong>Težina pripreme:</strong> {{ recipe.rec_preparation }}</p>

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

      <hr style="width: 150vh; margin-top: 40px; height: 3px; background-color: #5c2e2e; border: 0;"></hr>

      <div class="comments-section">
        <h2>Komentari</h2>

        <!-- Forma za dodavanje komentara -->
        <div v-if="isLoggedIn" class="add-comment">
          <textarea v-model="newComment" placeholder="Dodaj svoj komentar..."></textarea>
          <button @click="postComment">Pošalji</button>
        </div>
        <div v-else>
          <p style="color: white; text-align: center; padding-bottom: 10px;">Morate biti ulogovani da dodate komentar.</p>
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

const session = useSessionStore()
const isLoggedIn = session.isLoggedIn

const route = useRoute()
const recipe = ref({})
const ingredients = ref([])
const relatedRecipes = ref([])

async function getRecipe() {
  try {
    const res = await api.getRecipeId(route.params.id)
    console.log(res.data)

    recipe.value = res.data.data.recipe
    ingredients.value = res.data.data.ingredients

    const related = await api.getRelatedRecipes(route.params.id)
    relatedRecipes.value = related.data.data.data
    console.log(relatedRecipes.value)
  } catch (error) {
    console.log(error)
  }
}

const comments = ref([])

async function getComments() {
  try {
    const res = await api.getComments(route.params.id)
    console.log(res.data)
    comments.value = res.data.data
    console.log(comments.value)
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
  background-color: #743f3f;
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

.recipe-prep {
  font-size: 15px;
  color: white;
  background: #743f3f;
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
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
  background-color: #5c2e2e; /* tamnija nijansa od wrappera */
  padding: 30px;
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
  width: 370px;       /* veće kartice */
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
  height: 250px;  /* veća slika */
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
}
.comments-section {
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
  padding: 20px;
  background-color: #5c2e2e;
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
}

.add-comment textarea {
  padding: 10px;
  border-radius: 10px;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 10px;
  border: none;
  font-size: 14px;
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

.add-comment button:hover {
  opacity: 0.9;
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

</style>
