<template>
  <Header />
  <main>
    <div class="btn-up btn-up_hide" @click="scrollToTop"></div>
    <div class="container" id="app">
      <div class="row">
        <User />

        <div class="col-md-9">
          <h1 class="head">Мои заказы:</h1>
          <input type="radio" value="all" checked class="radiobutton" name="type-ord" />Все
          <input type="radio" value="active" class="radiobutton" name="type-ord" />Активные
          <input type="radio" value="finished" class="radiobutton" name="type-ord" />Завершенные
          <div class="create-line"></div>
          <form style="height: 70px">
            <div id="qqqq">
              <!-- <div > -->
              <button type="button" class="btn custom-btn" @click="fetchUserOrders('title', 'asc')">
                А-Я
              </button>
              <button
                type="button"
                class="btn custom-btn"
                @click="fetchUserOrders('title', 'desc')"
              >
                Я-А
              </button>
              <button
                type="button"
                class="btn custom-btn"
                @click="fetchUserOrders('createdAt', 'desc')"
              >
                Сначала новые
              </button>
              <!-- </div> -->
              <!-- <div> -->
              <button
                type="button"
                class="btn custom-btn"
                @click="fetchUserOrders('createdAt', 'asc')"
              >
                Сначала старые
              </button>
              <button
                type="button"
                class="btn custom-btn"
                @click="fetchUserOrders('price', 'desc')"
              >
                Сначала дорогие
              </button>
              <!-- </div> -->
              <button type="button" class="btn custom-btn" @click="fetchUserOrders('price', 'asc')">
                Сначала дешевые
              </button>
            </div>
            <div id="pppp">
              <input
                type="text"
                class="custom-text"
                placeholder="Поиск"
                style="margin-left: 10px"
                v-model="searchTitle"
                @input="searchByTitle"
              />
            </div>
          </form>
          <div class="table-order" v-if="orders && orders.length > 0">
            <div v-for="order in orders" :key="order.id" class="order" style="position: relative">
              <img
                v-if="order.ad.photo"
                :src="checkPhoto(order.ad.photo)"
                class="image-order"
                width="410"
                height="410"
                alt="Фото объявления"
                style="object-fit: fill; max-width: 100%; max-height: 100%"
              />
              <img
                v-else
                src="@/assets/images/default.png"
                class="image-order"
                width="410"
                height="410"
                alt="Фото по умолчанию"
              />
              <div class="order-info">
                <h5 class="text-center">{{ order.ad.title }}</h5>
                <h6 style="text-align: center">Город: {{ order.ad.location || 'Не указан' }}</h6>
                <div id="text-order">
                  <p>Тип услуги: {{ order.ad.category || 'Не указана' }}</p>
                  <p>Цена: {{ order.ad.price }} рублей</p>
                  <p>Дата заказа: {{ formatDate(order.createdAt) }}</p>
                  <p>Статус: {{ order.status }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="table-order" v-else>
            <p>У вас пока нет заказов.</p>
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
  name: 'MyOrders',
  components: {
    Header,
    Footer,
    User,
  },
  data() {
    return {
      orders: [],
      error: '',
      apiBaseUrl: 'http://localhost:8080/api/orders',
      serverBaseUrl: 'http://localhost:8080',
      searchTitle: '',
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchUserOrders(sortBy = 'createdAt', order = 'desc', title = this.searchTitle) {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL(`${this.apiBaseUrl}/my`)
        url.searchParams.append('sortBy', sortBy)
        url.searchParams.append('order', order)
        if (title) {
          url.searchParams.append('title', title)
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.orders = await response.json()
          this.orders = this.orders.map((order) => ({
            ...order,
            photo: this.checkPhoto(order.ad.photo),
          }))
          console.log(this.orders)
        } else if (response.status === 401 || response.status === 403) {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          this.$router.push('/login')
        } else {
          this.error = 'Ошибка загрузки заказа: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
      }
    },
    checkPhoto(photoUrl) {
      if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'null') {
        return this.defaultImage
      }
      if (photoUrl.startsWith('/userData/')) {
        const fullUrl = `${this.serverBaseUrl}${photoUrl}`
        return fullUrl
      }
      return photoUrl
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    },
    searchByTitle() {
      this.fetchUserOrders('createdAt', 'desc', this.searchTitle)
    },
    handleScroll() {
      const btnUp = document.querySelector('.btn-up')
      if (window.scrollY > 300) {
        btnUp.classList.remove('btn-up_hide')
      } else {
        btnUp.classList.add('btn-up_hide')
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchUserOrders()
    window.addEventListener('scroll', this.handleScroll)
    const btnUp = document.querySelector('.btn-up')
    if (btnUp) {
      btnUp.addEventListener('click', this.scrollToTop)
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    const btnUp = document.querySelector('.btn-up')
    if (btnUp) {
      btnUp.removeEventListener('click', this.scrollToTop)
    }
  },
}
</script>
