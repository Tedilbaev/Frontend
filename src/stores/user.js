import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    error: null,
  }),
  actions: {
    async fetchUserProfile() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        return false
      }
      try {
        const response = await fetch('http://localhost:8080/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        this.user = await response.json()
        localStorage.setItem(
          'userData',
          JSON.stringify({
            username: this.user.username,
            avatarUrl: this.user.avatarUrl,
            email: this.user.email,
            phone: this.user.phone,
            balance: this.user.balance,
            description: this.user.description,
            location: this.user.location,
          }),
        )
        return true
      } catch (error) {
        if (error.message === 'HTTP error 401' || error.message === 'HTTP error 403') {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          localStorage.removeItem('userData')
        } else {
          this.error = 'Ошибка сервера'
        }
        return false
      }
    },
    logout() {
      this.user = null
      this.error = null
      localStorage.removeItem('jwt')
      localStorage.removeItem('userData')
    },
  },
})
