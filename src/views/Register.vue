<template>
  <div class="contain">
    <div class="center">
      <h1 class="text-center">Регистрация</h1>
      <div class="sub-div">
        <label for="regEmail">Введите адрес эл. почты (логин):</label>
        <p>
          <input
            v-model="email"
            type="text"
            id="regEmail"
            placeholder="Например: ivanivanov@mail.ru"
            class="custom-text"
            @click="hideError"
          />
        </p>
        <label for="regPassword">Введите пароль:</label>
        <p>
          <input
            v-model="password"
            type="password"
            id="regPassword"
            class="custom-text"
            @click="hideError"
          />
        </p>
        <label for="regPasswordConfirm">Повторите пароль:</label>
        <p>
          <input
            v-model="passwordConfirm"
            type="password"
            id="regPasswordConfirm"
            class="custom-text"
            @click="hideError"
          />
        </p>
        <label for="regUsername">Придумайте имя пользователя (до 20 символов): </label>
        <p>
          <input
            v-model="username"
            type="text"
            id="regUsername"
            class="custom-text"
            maxlength="20"
            @click="hideError"
          />
        </p>
      </div>
      <div class="sub-div">
        <button @click="handleRegister" class="sign-btn">Зарегистрироваться</button>
        <p></p>
        <button @click="goToLogin" class="reg-btn">К авторизации</button>
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
      passwordConfirm: '',
      username: '',
    }
  },
  computed: {
    ...mapState(useAuthStore, ['error']),
  },
  methods: {
    ...mapActions(useAuthStore, ['register', 'setError', 'hideError']),

    async handleRegister() {
      if (this.password !== this.passwordConfirm) {
        this.setError('Пароли не совпадают')
        console.log(this.error)
        return false
      }

      const success = await this.register({
        email: this.email,
        password: this.password,
        username: this.username,
      })

      if (success) {
        this.goToLogin()
      }
    },

    goToLogin() {
      this.setError(null)
      this.$router.push('/login')
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
