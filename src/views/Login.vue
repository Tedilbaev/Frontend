<template>
  <div class="contain">
    <div class="center">
      <h1 class="text-center">Авторизация</h1>
      <div class="sub-div">
        <label for="login">Введите адрес эл. почты (логин):</label>
        <p>
          <input
            v-model="email"
            type="text"
            id="login"
            placeholder="Например: ivanivanov@mail.ru"
            class="custom-text"
            @click="hideError"
          />
        </p>
        <label for="password">Введите пароль:</label>
        <p>
          <input
            v-model="password"
            type="password"
            id="password"
            class="custom-text"
            @click="hideError"
          />
        </p>
      </div>
      <div class="sub-div">
        <button @click="handleLogin" class="sign-btn">Войти</button>
        <p></p>
        <button @click="goToRegister" class="reg-btn">К регистрации</button>
      </div>
      <p v-if="error" class="text-center" style="color: red">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    ...mapState(useAuthStore, ['error']),
  },
  methods: {
    ...mapActions(useAuthStore, ['login', 'hideError']),

    async handleLogin() {
      const success = await this.login({
        email: this.email,
        password: this.password,
      })

      if (success) {
        this.$router.push('/myads')
      }
    },

    goToRegister() {
      this.$router.push('/register')
    },
  },
}
</script>

<style scoped>
.contain {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Заменили height: 600px на min-height: 100vh */
}

.center {
  width: 450px;
  background-color: white;
  padding: 20px;
  border-radius: 20px; /* Перенесли border-radius сюда, так как div { border-radius } был слишком общим */
}

.reg-btn {
  border-radius: 20px;
  background-color: white;
  border-top: none;
  border-right: none;
  border-bottom: 1px solid #2b8025;
  border-left: 1px solid #2b8025;
  color: black;
  box-shadow: -8px 7px 8px -6px #bac2c9;
  height: 30px;
  width: 100%;
  margin-bottom: 5px;
  transition: 0.3s;
}

.reg-btn:hover {
  color: #f2f2f2;
  background-color: #2b8025;
}

.sign-btn {
  border: none;
  border-radius: 20px;
  background-color: #2b8025;
  color: #f2f2f2;
  box-shadow: -8px 7px 8px -6px #bac2c9;
  height: 30px;
  width: 100%;
  margin-bottom: 5px;
  transition: 0.3s;
  outline: none;
}

.sign-btn:hover {
  color: black;
  background-color: white;
  border-bottom: 1px solid #2b8025;
  border-left: 1px solid #2b8025;
}

.sign-btn:active {
  background-color: #2b8025;
  color: #f2f2f2;
}

.reg-btn:active {
  background-color: white;
  border-bottom: 1px solid #2b8025;
  border-left: 1px solid #2b8025;
  color: black;
}

.custom-text {
  border: 0px;
  border-bottom: 1px solid #2b8025;
  border-top: 1px solid #2b8025;
  border-radius: 20px;
  max-height: 100%;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  height: 30px;
  outline: none;
}

.custom-text:focus {
  border: 1px solid #2b8025;
}

.sub-div {
  margin-top: 25px;
  margin-bottom: 10px;
}
</style>
