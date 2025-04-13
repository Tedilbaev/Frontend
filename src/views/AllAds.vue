<template>
  <Header />
  <main>
    <div class="container" id="app">
      <div class="row">
        <User />

        <div class="col-md-9">
          <h1 class="head">Все объявления:</h1>
          <label for="city">Введите город поиска</label>
          <p>
            <input
              type="text"
              class="custom-text"
              id="city"
              name="city"
              placeholder="Например: Астрахань"
            />
          </p>
          <div class="create-line"></div>
          <form style="height: 30px">
            <p class="head" style="font-weight: bold">
              Cортировка:
              <button type="button" class="btn custom-btn">Без сортировки</button>
              <button type="button" class="btn custom-btn">А-Я</button>
              <button type="button" class="btn custom-btn">Я-А</button>
              <input
                type="text"
                class="custom-text"
                placeholder="Поиск"
                style="margin-left: 15px"
              />
              <button type="button" class="btn custom-btn">Искать</button>
            </p>
          </form>
          <div class="table-order" v-if="ads && ads.length > 0">
            <div v-for="ad in ads" :key="ad.id" class="order" style="position: relative">
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
                <h5 class="text-center" style="margin: 0 auto">{{ ad.title }}</h5>
                <h6 style="margin-top: 5px; text-align: center">
                  Город: {{ ad.location || 'Не указан' }}
                </h6>
                <div id="text-order">
                  <p>Тип услуги: {{ ad.category || 'Не указана' }}</p>
                  <p>Цена: {{ ad.price }} рублей</p>
                  <p>Дата объявления: {{ formatDate(ad.createdAt) }}</p>
                  <p
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 4;
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
      apiBaseUrl: 'http://localhost:8080/api/user',
      serverBaseUrl: 'http://localhost:8080',
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchAllAds() {
      const token = localStorage.getItem('jwt')
      console.log('Токен для объявлений:', token)
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const response = await fetch(`${this.apiBaseUrl}/all-ads`, {
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
            photo: this.checkPhoto(ad.photo, '/images/default.png'),
          }))
          console.log('Объявления пользователя:', this.ads)
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
    checkPhoto(photoUrl, defaultUrl) {
      if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'null') {
        return defaultUrl
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
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchAllAds()
  },
}
</script>
