<template>
  <main>
    <div class="btn-up btn-up_hide" @click="scrollToTop"></div>
    <Header />
    <div class="container">
      <div class="row">
        <User />
        <div class="col-md-9">
          <h1 class="head">Мои объявления:</h1>
          <p>
            <button type="button" class="btn custom-btn" @click="showDialog">
              Разместить объявление
            </button>
          </p>
          <div class="create-line"></div>
          <form style="height: 70px">
            <div id="qqqq">
              <!-- <div > -->
              <button type="button" class="btn custom-btn" @click="sortAds('title', 'asc')">
                А-Я
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('title', 'desc')">
                Я-А
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('createdAt', 'desc')">
                Сначала новые
              </button>
              <!-- </div> -->
              <!-- <div> -->
              <button type="button" class="btn custom-btn" @click="sortAds('createdAt', 'asc')">
                Сначала старые
              </button>
              <button type="button" class="btn custom-btn" @click="sortAds('price', 'desc')">
                Сначала дорогие
              </button>
              <!-- </div> -->
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
          <div class="table-order" v-if="ads && ads.length > 0">
            <div
              v-for="ad in ads"
              :key="ad.id"
              class="order"
              style="position: relative"
              @click="goToAd(ad.id)"
            >
              <img
                v-if="ad.photo"
                :src="checkPhoto(ad.photo)"
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
          <div class="table-order" v-else>
            <p>У вас пока нет объявлений.</p>
          </div>
        </div>
      </div>

      <dialog class="popup" style="overflow-y: hidden">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Создать объявление</h1>
          <div class="row">
            <div class="col-md-6">
              <label for="nameOrder">Введите название объявления</label>
              <p>
                <input
                  type="text"
                  id="nameOrder"
                  placeholder="Например: Ремонт машин"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="50"
                  v-model="newAd.title"
                />
              </p>
              <label for="noteOrder">Введите описание для вашего объявления</label>
              <p>
                <textarea
                  class="custom-text wrap-text"
                  id="noteOrder"
                  rows="14"
                  cols="10"
                  wrap="soft"
                  style="width: 100%"
                  v-model="newAd.description"
                ></textarea>
              </p>
              <label for="priceOrder">Введите цену на услугу (Цена в рублях)</label>
              <p>
                <input
                  type="text"
                  id="priceOrder"
                  placeholder="Например: 2000"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="10"
                  v-model="newAd.price"
                />
              </p>
              <label for="categoryOrder">Выберите категорию вашего объявления</label>
              <p>
                <select id="categoryOrder" class="select" v-model="newAd.category">
                  <option v-for="cat in category" :key="cat.id" v-value="cat.name">
                    {{ cat.name }}
                  </option>
                </select>
              </p>
              <label for="your-picture">Прикрепите Ваше фото</label>
              <p>
                <input
                  type="file"
                  id="your-picture"
                  accept=".jpg, .jpeg, .png"
                  @change="handleFileChange"
                />
              </p>
            </div>
            <div class="col-md-6">
              <div
                style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 450px"
              >
                <div
                  class="preview"
                  id="previewContainer"
                  style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <img
                    id="preview"
                    :src="previewImage || '/images/default.png'"
                    alt="Предпросмотр"
                    style="max-width: 100%; max-height: 100%; object-fit: contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center" style="align-items: center; justify-content: center">
            <button type="button" class="btn custom-btn" @click="createAd">
              Создать объявление
            </button>
            <button type="button" class="btn custom-btn" @click="closeDialog">Отмена</button>
          </div>
        </div>
      </dialog>
    </div>
    <div style="height: 120px; z-index: 19"></div>
    <Footer />
  </main>
</template>

<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import User from '@/components/User.vue'
import defaultImage from '@/assets/images/default.png'

export default {
  name: 'MyAds',
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
      newAd: {
        title: '',
        description: '',
        price: '',
        category: '',
        photo: null,
      },
      category: [],
      previewImage: null,
      defaultImage,
      searchTitle: '',
      currentPage: 0,
      totalPages: 0,
      currentSortBy: 'createdAt',
      currentOrder: 'desc',
      isLoading: false,
    }
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchUserAds(
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
      this.fetchUserAds(sortBy, order, this.searchTitle, 0)
    },
    searchByTitle() {
      this.currentPage = 0
      this.fetchUserAds(this.currentSortBy, this.currentOrder, this.searchTitle, 0)
    },
    loadMore() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        this.fetchUserAds()
      }
    },
    async fetchAllCategory(sortBy = 'createdAt', order = 'desc', query = '') {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL('http://localhost:8080/api/category/all')
        url.searchParams.append('sortBy', sortBy)
        url.searchParams.append('order', order)
        if (query) {
          url.searchParams.append('name', query)
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.category = await response.json()
        } else if (response.status === 401 || response.status === 403) {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          this.$router.push('/login')
        } else {
          this.error = 'Ошибка загрузки категорий: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
      }
    },
    async createAd() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }

      const formData = new FormData()
      formData.append('title', this.newAd.title)
      formData.append('description', this.newAd.description)
      formData.append('price', this.newAd.price)
      formData.append('category', this.newAd.category)
      formData.append('location', 'Астрахань')
      if (this.newAd.photo) {
        formData.append('photo', this.newAd.photo)
      }
      try {
        const response = await fetch(`${this.apiBaseUrl}/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        console.log('Статус ответа:', response.status)
        if (response.ok) {
          const newAd = await response.json()
          this.ads.push({
            ...newAd,
            photo: this.checkPhoto(newAd.photo),
          })
          console.log('Новое объявление:', newAd)
          console.log('URL фото:', this.checkPhoto(newAd.photo))
          this.closeDialog()
          this.fetchUserAds('createdAt', 'desc')
        } else {
          const errorText = await response.text()
          this.error = 'Ошибка создания объявления: ' + response.status + ' - ' + errorText
          console.error('Ошибка сервера:', errorText)
        }
      } catch (e) {
        this.error = 'Ошибка сервера при создании объявления'
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
    closeDialog() {
      document.querySelector('dialog').close()
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.newAd.photo = file
        const reader = new FileReader()
        reader.onload = (event) => {
          this.previewImage = event.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.previewImage = null
      }
    },
    showDialog() {
      document.querySelector('dialog').showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
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
    goToAd(adId) {
      this.$router.push({ name: 'MyAdInfo', params: { id: adId } })
    },
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchUserAds()
    this.fetchAllCategory('createdAt', 'asc')
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

<style>
#app {
  min-height: 100vh !important;
  overflow: hidden !important;
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
