import axios from './config'

export default {
  getCategories: (data) => axios.get('categories', data),

  getIngredients: (data) => axios.get('ingredients', data),

  getRecipes: (data) => axios.get('recipes', data),

  getRecipeId: (id) => axios.get(`recipes/${id}`),

  getRelatedRecipes: (id) => axios.get(`recipes/same-category?id=${id}`),

  getGlavnaJela: (data) => axios.get('recipes/glavna-jela', data),

  getRecipesSearch: ({ search, category, ingredient } = {}) =>
    axios.get('recipes/search-recipes', { params: { search, category, ingredient } }),

  getFavoriteRecipes: (data) => axios.get('recipes/favorite-recipes', data),

  registerUser: ({ fullname, username, password, email }) =>
    axios.post('auth/register', { fullname, username, password, email }),

  loginUser: ({ username, password }) => axios.post('auth/login', { username, password }),

  getComments: (id) => axios.get(`recipes/comments?id=${id}`),
  addComment: ({ id, comment, sid }) => axios.post('recipes/comments', { id, comment, sid }),

  userFavoriteRecipes: (sid) => axios.get('recipes/favorites', { params: { sid } }),
  addFavoriteRecipe: (sid, rec_id) => axios.post('recipes/add-favorite-recipe', { sid, rec_id }),
  deleteFavoriteRecipe: (sid, rec_id) =>
    axios.post('recipes/delete-favorite-recipe', { sid, rec_id }),

  postRecipe: (data) => axios.post('recipes/post-recipe', data),

  myRecipes: (sid) => axios.get('recipes/my-recipes', { params: { sid } }),

  latestRecipes: (data) => axios.get('recipes/latest-added-recipes', data),

  adminRecipes: (sid) => axios.get('admin/recipes', { params: { sid } }),
  adminCategories: (sid) => axios.get('admin/categories', { params: { sid } }),
  adminIngredients: (sid) => axios.get('admin/ingredients', { params: { sid } }),
  adminComments: (sid) => axios.get('admin/comments', { params: { sid } }),
  adminUsers: (sid) => axios.get('admin/users', { params: { sid } }),
}
