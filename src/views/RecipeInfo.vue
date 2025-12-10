<template>
  <div>
    <h1 style="color: black; padding-top: 120px; text-align: center; font-size: 40px">
      Instrukcije za pravljenje recepta
    </h1>

    <div class="wrapper" v-if="recipe">
      <div class="recipe-card">
        <h1 class="recipe-title">{{ recipe.rec_name }}</h1>
        <img class="recipe-image" :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" />

        <p class="recipe-prep"><strong>Težina pripreme:</strong> {{ recipe.rec_preparation }}</p>

        <h2 class="sub-title">Sastojci</h2>
        <ul class="ingredients">
          <li v-for="ing in ingredients" :key="ing.ing_id">
            <span class="ing-name">{{ ing.ing_name }}</span>
            <span class="ing-qty">{{ ing.rig_quantity }}</span>
          </li>
        </ul>

        <h3 style="font-weight: bold; margin-top: 20px">Instrukcije</h3>
        <p class="recipe-inst">{{ recipe.rec_instructions }}</p>

        <h3 style="font-weight: bold; margin-top: 25px">Deskripcija</h3>
        <p class="recipe-desc">{{ recipe.rec_description }}</p>
      </div>

      <h2 class="sub-title" style="margin-top: 50px">Slični recepti</h2>
      <div class="related-container">
        <RouterLink
          v-for="r in relatedRecipes"
          :key="r.rec_id"
          :to="{ name: 'detalji-recepta', params: { id: r.rec_id } }"
          class="related-card"
        >
          <img :src="`http://565q123.e2.mars-hosting.com${r.image}`" class="related-img" />
          <h3>{{ r.rec_name }}</h3>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api'
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

const route = useRoute()
const recipe = ref(null)
const ingredients = ref([])
const relatedRecipes = ref([])

async function getRecipe(id) {
  try {
    const res = await api.getRecipeId(id)
    recipe.value = res.data.recipe
    ingredients.value = res.data.ingredients

    const same = await api.getSameCategoryRecipes(route.params.id)
    relatedRecipes.value = same.data
  } catch (error) {
    console.log(error)
  }
}

// Pokreni prvi put
onMounted(() => {
  getRecipe(route.params.id)
})

// Watch za promenu ID-ja u ruti (klik na sličan recept)
watch(
  () => route.params.id,
  (newId) => {
    getRecipe(newId)
  },
)
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  padding: 30px;
}

.recipe-card {
  width: 600px;
  background: #ffffff;
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
  color: #222;
}

.recipe-desc {
  font-size: 16px;
  color: #555;
  padding-bottom: 20px;
}

.recipe-prep {
  font-size: 15px;
  color: #743f3f;
  background: #f3f3f3;
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
}

.sub-title {
  margin-top: 20px;
  font-size: 22px;
  color: #333;
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
}

.ing-qty {
  color: #222;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 20px;
}
</style>
