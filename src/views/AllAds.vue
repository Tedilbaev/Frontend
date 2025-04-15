<template>
  <Header />
  <main>
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
              <!-- <div > -->
              <button type="button" class="btn custom-btn" @click="fetchAllAds('title', 'asc')">
                А-Я
              </button>
              <button
                type="button"
                class="btn custom-btn"
                @click="fetchAllAds('createdAt', 'desc')"
              >
                Сначала новые
              </button>
              <button type="button" class="btn custom-btn" @click="fetchAllAds('price', 'asc')">
                Сначала дешевые
              </button>
              <!-- </div> -->
              <!-- <div> -->
              <button type="button" class="btn custom-btn" @click="fetchAllAds('title', 'desc')">
                Я-А
              </button>
              <button type="button" class="btn custom-btn" @click="fetchAllAds('createdAt', 'asc')">
                Сначала старые
              </button>
              <button type="button" class="btn custom-btn" @click="fetchAllAds('price', 'desc')">
                Сначала дорогие
              </button>
              <!-- </div> -->
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
                v-if="ad.location == searchQuery"
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
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchAllAds(sortBy = 'createdAt', order = 'desc', title = this.searchTitle) {
      const token = localStorage.getItem('jwt')
      console.log('Токен для объявлений:', token)
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL(`${this.apiBaseUrl}/all`)
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
          this.ads = await response.json()
          this.ads = this.ads.map((ad) => ({
            ...ad,
            photo: this.checkPhoto(ad.photo),
          }))
          console.log('Объявления:', this.ads)
        } else if (response.status === 401 || response.status === 403) {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          this.$router.push('/login')
        } else {
          this.error = 'Ошибка загрузки объявлений: ' + response.status
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
        console.log('Серверный URL фото:', fullUrl)
        return fullUrl
      }

      console.log('Локальный URL фото:', photoUrl)
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
    searchByTitle() {
      this.fetchAllAds('createdAt', 'desc', this.searchTitle)
    },
  },
  created() {
    this.fetchCities()
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchAllAds('createdAt', 'desc')
  },
}
</script>
