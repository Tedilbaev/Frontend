<template>
  <Header />
  <main>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="replenishpopup" style="overflow-y: hidden" id="replenish">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Пополнить счет</h1>
          <div class="text-center">
            <label for="amountReplen">Введите сумму пополнения</label>
              <p>
                <input
                  v-model="amount"
                  type="text"
                  id="amountReplen"
                  placeholder="Например: 1000.00"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="50"
                />
              </p>
            <button type="button" class="btn custom-btn" @click="replenishBalance">
              Пополнить
            </button>
            <button type="button" class="btn custom-btn" @click="closeDialog('#replenish')">
              Отмена
            </button>
          </div>
        </div>
      </dialog>
    </div>
    <div class="container" id="app">
      <div class="row">
        <User />

        <div class="col-md-9">
          <h1 class="head">Кошелек:</h1>
          <h2 v-if="user.balance" class="head">{{ user.balance }} &#8381;</h2>
          <h2 v-else class="head">0 &#8381;</h2>
          <p>
            <button type="button" class="btn custom-btn" @click="showDialog('#replenish')">Пополнить счет</button>
            <button type="button" class="btn custom-btn" id="spend">Снять с счета</button>
          </p>
          <h4 class="head">История операций:</h4>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px">
           <table class="table table-striped w-100 text-center">
            <thead>
              <tr>
                <th scope="col">№</th>
                <th scope="col">Тип операции</th>
                <th scope="col">Дата</th>
                <th scope="col">Сумма операции (в &#8381;)</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="(transaction, index) in transactions" :key="transaction.id">
                <td>{{ index + 1 }}</td>
                <td>{{ transaction.type }}</td>
                <td>{{ formatDate(transaction.createdAt) }}</td>
                <td>{{ formatBalance(transaction.amount) }}</td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="4">Нет операций</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 150px"></div>
  </main>
  <Footer />
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import User from '@/components/User.vue'
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Wallet',
  components: {
    Header,
    Footer,
    User,
  },
  data() {
    return {
      transactions: [],
      amount: 0,
      error: '',
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchOperations() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL('http://localhost:8080/api/balance/transactions')
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.transactions = await response.json()
          console.log(this.transactions)
        } else if (response.status === 401 || response.status === 403) {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          this.$router.push('/login')
        } else {
          this.error = 'Ошибка загрузки фотографий: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
      }
    },
    formatBalance(value) {
      if (!value) return '0.00'
      return parseFloat(value).toFixed(2)
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' '
    },
    async replenishBalance() {
      if (!this.amount || this.amount <= 0) {
        this.error = 'Введите корректную сумму'
        return
      }
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      console.log(this.user.id)
      console.log(this.amount)
      const formData = new FormData()
      formData.append("userId",this.user.id)
      formData.append("amount",this.amount)
      console.log(...formData)
      try {
        const response = await fetch(`http://localhost:8080/api/balance/replenish`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          this.error = ''
          this.closeDialog('#replenish')
          await this.fetchUserProfile() 
          await this.fetchOperations() 
          this.amount = 0
        } else {
          const errorText = await response.text()
          this.error = `Ошибка обновления объявления: ${errorText}`
        }
      } catch (e) {
        this.error = 'Ошибка сервера при обновлении объявления'
        console.error('Исключение:', e)
      }
    },
    showDialog(dialogwindow) {
      document.querySelector(dialogwindow).showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialog(dialogwindow) {
      this.error = ''
      this.previewImage = null
      document.querySelector(dialogwindow).close()
    },
  },
  mounted() {
    this.fetchUserProfile(),
    this.fetchOperations()
  },
}
</script>
<style scoped>
.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
.popup {
  height: 70%;
}
.preview {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#preview {
  max-width: 100%;
  max-height: 450px;
  object-fit: contain;
}
</style>