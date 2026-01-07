import { defineStore } from 'pinia'
import api from '@/api'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    sid: localStorage.getItem('sid') || null,
    message: null,
  }),

  actions: {
    async login(username, password) {
      const res = await api.loginUser({ username, password })
      const { sessionUser, sid, message } = res.data.data

      this.user = sessionUser
      this.sid = sid
      this.message = message

      localStorage.setItem('user', JSON.stringify(sessionUser))
      localStorage.setItem('sid', sid)
    },

    logout() {
      this.user = null
      this.sid = null
      this.message = null

      localStorage.removeItem('user')
      localStorage.removeItem('sid')
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => !!state.user?.usr_admin,
  },
})
