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
  adminDeleteRecipes: (rec_id) => axios.delete('admin/recipes', { params: { rec_id } }),
  adminEditRecipes: (data) => axios.put('admin/recipes', data),

  adminCategories: (sid) => axios.get('admin/categories', { params: { sid } }),
  adminDeleteCategories: (cat_id) => axios.delete('admin/categories', { params: { cat_id } }),
  adminPostCategory: (cat_name) => axios.post('admin/categories', { cat_name }),

  adminIngredients: (sid) => axios.get('admin/ingredients', { params: { sid } }),
  adminDeleteIngredients: (ing_id) => axios.delete('admin/ingredients', { params: { ing_id } }),
  adminPostIngredients: (ing_name) => axios.post('admin/ingredients', { ing_name }),

  adminComments: (sid) => axios.get('admin/comments', { params: { sid } }),
  adminDeleteComment: (com_id) => axios.delete('admin/comments', { params: { com_id } }),

  adminUsers: (sid) => axios.get('admin/users', { params: { sid } }),
  adminDeleteUser: (usr_id) => axios.delete('admin/users', { params: { usr_id } }),

  adminUpdateUserRole: (data) => axios.put('admin/give-role', data),

  deleteOwnComment: (sid, com_id) =>
    axios.delete('recipes/delete-own-comment', { params: { sid, com_id } }),
}
