<template>
  <h1 style="color: black; padding-top: 120px; text-align: center; font-size: 40px">
    Instrukcije za pravljenje recepta
  </h1>
  <div class="wrapper" v-if="recipe" style="padding-top: 50px">
    <div class="recipe-card">
      <!-- Slika recepta -->
      <h1 class="recipe-title" style="margin-bottom: 15px">{{ recipe.rec_name }}</h1>
      <img class="recipe-image" :src="`http://565q123.e2.mars-hosting.com${recipe.image}`" />

      <!-- Glavni detalji -->

      <h3 style="font-weight: bold; margin-top: 20px">Instrukcije</h3>
      <p class="recipe-inst">{{ recipe.rec_instructions }}</p>

      <h3 style="font-weight: bold; margin-top: 25px">Deskripcija</h3>
      <p class="recipe-desc">{{ recipe.rec_description }}</p>

      <p class="recipe-prep"><strong>Težina pripreme:</strong> {{ recipe.rec_preparation }}</p>

      <hr />

      <!-- Sastojci -->
      <h2 class="sub-title">Sastojci</h2>

      <ul class="ingredients">
        <li v-for="ing in ingredients" :key="ing.ing_id">
          <span class="ing-name">{{ ing.ing_name }}</span>
          <span class="ing-qty">{{ ing.rig_quantity }}</span>
        </li>
      </ul>
    </div>
  </div>

  <div v-else class="loading">
    <p>Učitavanje recepta...</p>
  </div>
</template>

<script setup>
import api from '@/api'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()

const recipe = ref(null)
const ingredients = ref([])

async function getRecipe() {
  try {
    const res = await api.getRecipeId(route.params.id)
    console.log(res.data)
    recipe.value = res.data.data.recipe
    ingredients.value = res.data.data.ingredients
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getRecipe()
})
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
  color: #333;
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
