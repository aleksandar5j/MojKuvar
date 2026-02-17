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

  getFavoriteRecipes: (data) => axios.get('recipes/most-favorited-recipes', data),

  registerUser: ({ fullname, username, password, email }) =>
    axios.post('auth/register', { fullname, username, password, email }),

  loginUser: ({ username, password }) => axios.post('auth/login', { username, password }),

  getComments: (id) => axios.get(`recipes/comments?id=${id}`),
  addComment: ({ id, comment, sid }) => axios.post('recipes/comments', { id, comment, sid }),

  userFavoriteRecipes: (sid) => axios.get('recipes/favorites', { params: { sid } }),
  addFavoriteRecipe: (sid, rec_id) => axios.post('recipes/favorites', { sid, rec_id }),
  deleteFavoriteRecipe: (sid, rec_id) =>
    axios.delete('recipes/favorites', { params: { sid, rec_id } }),

  postRecipe: (data) => axios.post('recipes', data),
  deleteOwnRecipe: (sid, rec_id) => axios.delete('recipes', { params: { sid, rec_id } }),
  updateOwnRecipe: (data) => axios.put('recipes', data),

  myRecipes: (sid) => axios.get('recipes/my-recipes', { params: { sid } }),

  latestRecipes: (data) => axios.get('recipes/latest-added-recipes', data),

  adminRecipes: (sid) => axios.get('admin/recipes', { params: { sid } }),
  adminDeleteRecipes: (sid, rec_id) => axios.delete('admin/recipes', { params: { sid, rec_id } }),
  adminEditRecipes: (data) => axios.put('admin/recipes', data),

  adminCategories: (sid) => axios.get('admin/categories', { params: { sid } }),
  adminDeleteCategories: (sid, cat_id) =>
    axios.delete('admin/categories', { params: { sid, cat_id } }),
  adminPostCategory: (sid, cat_name) => axios.post('admin/categories', { sid, cat_name }),

  adminIngredients: (sid) => axios.get('admin/ingredients', { params: { sid } }),
  adminDeleteIngredients: (sid, ing_id) =>
    axios.delete('admin/ingredients', { params: { sid, ing_id } }),
  adminPostIngredients: (sid, ing_name) => axios.post('admin/ingredients', { sid, ing_name }),

  adminComments: (sid) => axios.get('admin/comments', { params: { sid } }),
  adminDeleteComment: (sid, com_id) => axios.delete('admin/comments', { params: { sid, com_id } }),

  adminUsers: (sid) => axios.get('admin/users', { params: { sid } }),
  adminDeleteUser: (sid, usr_id) => axios.delete('admin/users', { params: { sid, usr_id } }),

  adminUpdateUserRole: (data) => axios.put('admin/give-role', data),

  deleteOwnComment: (sid, com_id) => axios.delete('recipes/comments', { params: { sid, com_id } }),
  updateOwnComment: (data) => axios.put('recipes/comments', data),
}
