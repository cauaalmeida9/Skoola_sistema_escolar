import { defineStore } from 'pinia'
import router from '@/router' // Assumindo que seu roteador está em src/router/index.js

export const useAuthStore = defineStore('auth', {
  state: () => ({
    
    isAuthenticated: false, 
  }),
  actions: {
    login() {
     
      this.isAuthenticated = true
      router.push('/home') 
    },
    logout() {
      this.isAuthenticated = false
      router.push('/login')
    },
    checkAuth() {
     
      return this.isAuthenticated
    }
  },
})