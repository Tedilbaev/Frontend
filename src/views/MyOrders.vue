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
              <button type="button" class="btn custom-btn" @click="sortOrders('title', 'asc')">
                А-Я
              </button>
              <button type="button" class="btn custom-btn" @click="sortOrders('title', 'desc')">
                Я-А
              </button>
              <button type="button" class="btn custom-btn" @click="sortOrders('createdAt', 'desc')">
                Сначала новые
              </button>
              <button type="button" class="btn custom-btn" @click="sortOrders('createdAt', 'asc')">
                Сначала старые
              </button>
              <button type="button" class="btn custom-btn" @click="sortOrders('price', 'desc')">
                Сначала дорогие
              </button>
              <button type="button" class="btn custom-btn" @click="sortOrders('price', 'asc')">
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
            <div
              v-for="order in orders"
              :key="order.id"
              class="order"
              style="position: relative"
              @click="goToOrder(order.ad.id)"
            >
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
      check: true,
      currentPage: 0,
      totalPages: 0,
      currentSortBy: 'createdAt',
      currentOrder: 'desc',
      isLoading: false,
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchUserOrders(
      sortBy = this.currentSortBy,
      order = this.currentOrder,
      title = this.searchTitle,
      page = this.currentPage,
    ) {
      if (this.isLoading) return

      this.isLoading = true
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
        url.searchParams.append('page', page)
        url.searchParams.append('size', 12)
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
          const data = await response.json()
          this.totalPages = data.totalPages

          if (page === 0) {
            this.orders = data.content
          } else {
            this.orders = [...this.orders, ...data.content]
          }

          this.orders = this.orders.map((order) => ({
            ...order,
            photo: this.checkPhoto(order.ad.photo),
          }))
          console.log(this.orders)
        } else {
          this.error = 'Ошибка загрузки заказа: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
      } finally {
        this.isLoading = false
      }
    },
    sortOrders(sortBy, order) {
      this.currentSortBy = sortBy
      this.currentOrder = order
      this.currentPage = 0
      this.fetchUserOrders(sortBy, order, this.searchTitle, 0)
    },
    searchByTitle() {
      this.currentPage = 0
      this.fetchUserOrders(this.currentSortBy, this.currentOrder, this.searchTitle, 0)
    },
    loadMore() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        this.fetchUserOrders()
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
    goToOrder(adId) {
      this.$router.push({
        name: 'AdInfo',
        params: { id: adId },
        query: { from: 'myorders' },
      })
    },
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchUserOrders()
    window.addEventListener('scroll', this.handleScroll)
    let isScrolling = false
    window.addEventListener('scroll', () => {
      if (isScrolling) return
      isScrolling = true
      const scrollPosition = window.innerHeight + window.scrollY
      const pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const threshold = 400
      if (
        scrollPosition >= pageHeight - threshold &&
        !this.isLoading &&
        this.currentPage < this.totalPages - 1
      ) {
        this.loadMore()
      }

      isScrolling = false
    })
  },
}
</script>
