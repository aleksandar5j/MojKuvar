import axios from './config'

export default {
  getCategories: (data) => axios.get('categories', data),

  getIngredients: (data) => axios.get('ingredients', data),

  getRecipes: (data) => axios.get('recipes', data),

  getRecipeId: (id) => axios.get('getRecById', { params: { id } }),


  getRelatedRecipes: (id) => axios.get(`same-category?id=${id}`),

  getGlavnaJela: (data) => axios.get('recipes/glavna-jela', data),

  getRecipesSearch: ({ search, category, ingredient } = {}) =>
    axios.get('search-recipes', { params: { search, category, ingredient } }),

  getFavoriteRecipes: (data) => axios.get('most-favorited-recipes', data),

  registerUser: ({ fullname, username, password, email }) =>
    axios.post('auth/register', { fullname, username, password, email }),

  loginUser: ({ username, password }) => axios.post('auth/login', { username, password }),

  getComments: (id) => axios.get(`comments?id=${id}`),
  addComment: ({ id, comment, sid }) => axios.post('comments', { id, comment, sid }),

  userFavoriteRecipes: (sid) => axios.get('favorites', { params: { sid } }),
  addFavoriteRecipe: (sid, rec_id) => axios.post('favorites', { sid, rec_id }),
  deleteFavoriteRecipe: (sid, rec_id) =>
    axios.delete('favorites', { params: { sid, rec_id } }),
 postIngredient: (sid, ing_name) =>
  axios.post('ingredients', null, { params: { sid, ing_name } }),



  postRecipe: (data) => axios.post('recipes', data),
  deleteOwnRecipe: (sid, rec_id) => axios.delete('recipes', { params: { sid, rec_id } }),
  updateOwnRecipe: (data) => axios.put('recipes', data),

  myRecipes: (sid) => axios.get('my-recipes', { params: { sid } }),

  latestRecipes: (data) => axios.get('last-added-recipes', data),

  adminRecipes: (sid) => axios.get('admin/recipes', { params: { sid } }),
adminDeleteRecipes: (sid, rec_id) => axios.delete('admin/recipes', { params: { sid, rec_id } }),
adminEditRecipes: (data, sid) => axios.put('admin/recipes', { ...data, sid }),

// GET sve kategorije
  adminCategories: (sid) =>
    axios.get('admin/categories', { params: { sid } }),

  // POST nova kategorija
 // api.js
adminPostCategory: (cat_name, sid) =>
  axios.post('admin/categories', null, { params: { cat_name, sid } })

,

  // DELETE kategorija
  // DELETE kategorija
// DELETE kategorija
// api.js
adminDeleteCategory: (cat_id, sid) =>
  axios.delete('admin/categories', { params: { cat_id, sid } })

,



 adminIngredients: (sid) => axios.get('admin/ingredients', { params: { sid } }),
adminPostIngredients: (ing_name, sid) => axios.post('admin/ingredients', { ing_name, sid }),
adminDeleteIngredients: (sid,ing_id) => axios.delete('admin/ingredients', { params: { sid,ing_id} }),

  adminComments: (sid) => axios.get('admin/comments', { params: { sid } }),
 adminDeleteComment: (sid,com_id) =>
  axios.delete(`admin/comments`, {
    params: { sid,com_id },
  }),






  adminUsers: (sid) => axios.get('admin/users', { params: { sid } }),
adminDeleteUser: (sid,usr_id) => axios.delete('admin/users', { params: {  sid,usr_id } }),
// Axios helper
// Axios helper
adminUpdateUserRole: (data) =>
  axios.put(
    'admin/give-role',
    null,
    {
      params: {
        usr_id: data.usr_id,
        roles: data.roles,  // string tipa "admin,user"
        sid: data.sid
      }
    }
  ),





  deleteOwnComment: (sid, com_id) => axios.delete('comments', { params: { sid, com_id } }),
  updateOwnComment: (data) => axios.put('comments', data),
  getRoles: (sid) => axios.get('admin/roles', { params: { sid } }),
}
