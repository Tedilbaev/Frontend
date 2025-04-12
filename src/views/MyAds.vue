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
          <div style="height: 30px">
            <p class="head" style="font-weight: bold">
              Сортировка:
              <button type="button" class="btn custom-btn">Все</button>
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
          </div>
          <div class="table-order" v-if="ads && ads.length > 0">
            <div v-for="ad in ads" :key="ad.id" class="order" style="position: relative">
              <img
                v-if="ad.photo"
                :src="ad.photo"
                class="image-order"
                width="410"
                height="410"
                alt="Фото объявления"
                style="object-fit:fill; max-width: 100%; max-height: 100%;"
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
                <h6 style="margin-top: 5px; text-align: center;">Город: {{ ad.location || 'Не указан' }}</h6>
                <div id="text-order">
                  <p>Тип услуги: {{ ad.category || 'Не указана' }}</p>
                  <p>Цена: {{ ad.price }} рублей</p>
                  <p>Дата объявления: {{ formatDate(ad.createdAt) }}</p>
                  <p style="display: -webkit-box;
                  -webkit-line-clamp: 4;
                  -webkit-box-orient: vertical; 
                  overflow: hidden;
                  word-break:keep-all;">
                  Описание: {{ ad.description }}</p>
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
                  <option value="Сантехника">Сантехника</option>
                  <option value="Электроника">Электроника</option>
                  <option value="IT">IT</option>
                  <option value="Бытовая техника">Бытовая техника</option>
                  <option value="Услуга по найму">Услуга по найму</option>
                  <option value="Другое">Другое</option>
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
      apiBaseUrl: 'http://localhost:8080/api/user',
      serverBaseUrl: 'http://localhost:8080',
      newAd: {
        title: '',
        description: '',
        price: '',
        category: '',
        photo: null,
      },
      previewImage: null,
    }
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchUserAds() {
      const token = localStorage.getItem('jwt')
      console.log('Токен для объявлений:', token)
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const response = await fetch(`${this.apiBaseUrl}/my-ads`, {
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
        console.log('Выбран файл:', this.newAd.photo.name)
      } else {
        console.log('Файл не выбран')
      }

      try {
        const response = await fetch(`${this.apiBaseUrl}/create-ad`, {
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
            photo: this.checkPhoto(newAd.photo, '/images/default.png'),
          })
          console.log('Новое объявление:', newAd)
          console.log('URL фото:', this.checkPhoto(newAd.photo, '/images/default.png'))
          this.closeDialog()
          this.resetForm()
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
    resetForm() {
      this.newAd = {
        title: '',
        description: '',
        price: '',
        category: '',
        photo: null,
      }
      this.previewImage = null
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
    this.fetchUserAds()
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
