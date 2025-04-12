import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        })
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        const data = await response.json()
        localStorage.setItem('jwt', data.token)
        localStorage.setItem(
          'userData',
          JSON.stringify({
            username: data.username,
            avatarUrl: data.avatarUrl,
          }),
        )
        this.user = data
        return true
      } catch (error) {
        if (error.message === 'HTTP error 401') {
          this.error = 'Некорректные данные'
        } else if (error.message.startsWith('HTTP error')) {
          this.error = 'Ошибка входа'
        } else {
          this.error = 'Ошибка сервера'
        }
        return false
      }
    },
    async register(userData) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        return true
      } catch (error) {
        if (error.message === 'HTTP error 400') {
          this.error = 'Пользователь с таким email уже существует'
        } else if (error.message.startsWith('HTTP error')) {
          this.error = 'Ошибка регистрации'
        } else {
          this.error = 'Ошибка сервера'
        }
        return false
      }
    },
    setError(message) {
      this.error = message
    },
    hideError() {
      this.error = null
    },
  },
})
