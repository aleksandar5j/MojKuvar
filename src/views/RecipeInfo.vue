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
    </div>
  </div>
</template>

<script setup>
import api from '@/api'
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

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
    console.log('Related:', relatedRecipes.value)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getRecipe()
})

watch(
  () => route.params.id,
  (newId, oldId) => {
    getRecipe()
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
  background: #a85c5c;
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

</style>
