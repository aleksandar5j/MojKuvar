import axios from './config'

export default {
  getCategories: (data) => axios.get('categories', data),
  getIngredients: (data) => axios.get('ingredients', data),
  getRecipes: (data) => axios.get('recipes', data),
  getRecipeId: (id) => axios.get(`recipes/${id}`),
  getRelatedRecipes: (id) => axios.get(`recipes/same-category?id=${id}`),
}
