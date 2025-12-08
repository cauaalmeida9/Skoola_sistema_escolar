import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null, // Para simular dados do usuário
  }),
  actions: {
    login(username, password) {
      // Simulação de autenticação (você pode criar um "usuário fixo")
      const mockUser = {
        username: 'escola@gmail.com',
        password: 'escola123'
      }

      if (username === mockUser.username && password === mockUser.password) {
        this.isAuthenticated = true
        this.user = { username: mockUser.username }
        // Salvar no localStorage
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
      // Recupera do localStorage
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
