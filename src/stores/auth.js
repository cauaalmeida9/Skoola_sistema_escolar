import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    login(username, password) {
      
      const mockUser = {
        username: 'escola@gmail.com',
        password: 'escola2284'
      }

      if (username === mockUser.username && password === mockUser.password) {
        this.isAuthenticated = true
        this.user = { username: mockUser.username }
       
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: this.user }))
        router.push('/home')
      } else {
        alert('Usuário ou senha incorretos')
      }
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('auth')
      router.push('/login')
    },
    checkAuth() {
      
      const authData = JSON.parse(localStorage.getItem('auth'))
      if (authData && authData.isAuthenticated) {
        this.isAuthenticated = true
        this.user = authData.user
      } else {
        this.isAuthenticated = false
        this.user = null
      }
      return this.isAuthenticated
    }
  },
})
