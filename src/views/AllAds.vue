<template>
  <Header />
  <main>
    <div class="btn-up btn-up_hide" @click="scrollToTop"></div>
    <div class="container" id="app">
      <div class="row">
        <User />

        <div class="col-md-9">
          <h1 class="head">Все объявления:</h1>
          <label for="city">Введите город поиска:</label>
          <p>
            <input
              type="text"
              class="custom-text"
              placeholder="Например: Астрахань"
              list="options"
              v-model="searchQuery"
              @input="filterCities"
            />
            <datalist id="options" v-if="filteredCities.length && searchQuery">
              <option
                v-for="city in filteredCities"
                :key="city.city"
                @click="selectCity(city.city)"
              >
                {{ city.city }}
              </option>
            </datalist>
          </p>
          <div class="create-line"></div>
          <form style="height: 70px">
            <div id="qqqq">
              <button type="button" class="btn custom-btn" @click="sortAds('title', 'asc')">
                А-Я
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('title', 'desc')">
                Я-А
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('createdAt', 'desc')">
                Сначала новые
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('createdAt', 'asc')">
                Сначала старые
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('price', 'desc')">
                Сначала дорогие
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('price', 'asc')">
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
          <div class="table-order" v-if="ads && ads.length > 0 && !searchQuery">
            <div
              v-for="ad in ads"
              :key="ad.id"
              class="order"
              style="position: relative"
              @click="goToAd(ad.id)"
            >
              <img
                v-if="ad.photo"
                :src="ad.photo"
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
                <h5 class="text-center">{{ ad.title }}</h5>
                <h6 style="text-align: center">Город: {{ ad.location || 'Не указан' }}</h6>
                <div id="text-order">
                  <p>Тип услуги: {{ ad.category || 'Не указана' }}</p>
                  <p>Цена: {{ ad.price }} рублей</p>
                  <p>Дата объявления: {{ formatDate(ad.createdAt) }}</p>
                  <p
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 4;
                      line-clamp: 4;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                      word-break: keep-all;
                    "
                  >
                    Описание: {{ ad.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="table-order" v-else-if="ads && ads.length > 0 && searchQuery">
            <template v-for="ad in ads" :key="ad.id">
              <div
                v-if="ad.location == searchQuery && this.user.id != ad.user.id"
                class="order"
                style="position: relative"
                @click="goToAd(ad.id)"
              >
                <img
                  v-if="ad.photo"
                  :src="ad.photo"
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
                  <h5 class="text-center">{{ ad.title }}</h5>
                  <h6 style="text-align: center">Город: {{ ad.location || 'Не указан' }}</h6>
                  <div id="text-order">
                    <p>Тип услуги: {{ ad.category || 'Не указана' }}</p>
                    <p>Цена: {{ ad.price }} рублей</p>
                    <p>Дата объявления: {{ formatDate(ad.createdAt) }}</p>
                    <p
                      style="
                        display: -webkit-box;
                        -webkit-line-clamp: 4;
                        line-clamp: 4;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        word-break: keep-all;
                      "
                    >
                      Описание: {{ ad.description }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="table-order" v-else>
            <p>Пока нет объявлений.</p>
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
import defaultImage from '@/assets/images/default.png'

export default {
  name: 'AllAds',
  components: {
    Header,
    Footer,
    User,
  },
  data() {
    return {
      ads: [],
      error: '',
      apiBaseUrl: 'http://localhost:8080/api/ads',
      serverBaseUrl: 'http://localhost:8080',
      cities: [],
      searchQuery: '',
      filteredCities: [],
      defaultImage,
      searchTitle: '',
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
    async fetchAllAds(
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
        const url = new URL(`${this.apiBaseUrl}/all`)
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
          console.log(`Получено ${data.content.length} объявлений.`)

          if (page === 0) {
            this.ads = data.content
          } else {
            this.ads = [...this.ads, ...data.content]
          }

          this.ads = this.ads.map((ad) => ({
            ...ad,
            photo: this.checkPhoto(ad.photo),
          }))
        } else {
          this.error = 'Ошибка загрузки объявлений: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
      } finally {
        this.isLoading = false
      }
    },
    sortAds(sortBy, order) {
      this.currentSortBy = sortBy
      this.currentOrder = order
      this.currentPage = 0
      this.fetchAllAds(sortBy, order, this.searchTitle, 0)
    },
    searchByTitle() {
      this.currentPage = 0
      this.fetchAllAds(this.currentSortBy, this.currentOrder, this.searchTitle, 0)
    },
    loadMore() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        this.fetchAllAds()
      }
    },
    checkPhoto(photoUrl) {
      if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'null') {
        return this.defaultImage
      }

      if (photoUrl.startsWith('/userData/')) {
        return `${this.serverBaseUrl}${photoUrl}`
      }

      return photoUrl
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    },
    async fetchCities() {
      try {
        const response = await fetch(
          'https://gist.githubusercontent.com/gorborukov/0722a93c35dfba96337b/raw/c07da3ce0a429216dca76f96416e0414b7201817/russia',
        )
        this.cities = await response.json()
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      }
    },
    filterCities() {
      if (this.searchQuery) {
        this.filteredCities = this.cities
          .filter((city) => city.city.toLowerCase().includes(this.searchQuery.toLowerCase()))
          .slice(0, 5)
      } else {
        this.filteredCities = []
      }
    },
    selectCity(city) {
      this.searchQuery = city
      this.filteredCities = []
    },
    goToAd(adId) {
      this.$router.push({ name: 'AdInfo', params: { id: adId } })
    },
    handleScroll() {
      const btnUp = document.querySelector('.btn-up')
      if (btnUp) {
        if (window.scrollY > 300) {
          btnUp.classList.remove('btn-up_hide')
        } else {
          btnUp.classList.add('btn-up_hide')
        }
      }
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
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
  created() {
    this.fetchCities()
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchAllAds()
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
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>
