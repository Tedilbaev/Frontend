<template>
  <Header />
  <main>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="popup" style="overflow-y: hidden" id="dialog">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Изменить объявление</h1>
          <div class="row">
            <div class="col-md-6">
              <label for="nameOrder">Введите название объявления</label>
              <p>
                <input
                  v-model="adForm.title"
                  type="text"
                  id="nameOrder"
                  placeholder="Например: Ремонт машин"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="50"
                />
              </p>
              <label for="noteOrder">Введите описание для вашего объявления</label>
              <p>
                <textarea
                  v-model="adForm.description"
                  class="custom-text wrap-text"
                  id="noteOrder"
                  rows="14"
                  cols="10"
                  wrap="soft"
                  style="width: 100%"
                ></textarea>
              </p>
              <label for="priceOrder">Введите цену на услугу (Цена в рублях)</label>
              <p>
                <input
                  v-model="adForm.price"
                  type="text"
                  id="priceOrder"
                  placeholder="Например: 2000"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="10"
                />
              </p>
              <label for="categoryOrder">Выберите категорию вашего объявления</label>
              <p>
                <select v-model="adForm.category" id="categoryOrder" class="select">
                  <option value="Сантехника">Сантехника</option>
                  <option value="Электроника">Электроника</option>
                  <option value="IT">IT</option>
                  <option value="Бытовая техника">Бытовая техника</option>
                  <option value="Услуга по найму">Услуга по найму</option>
                  <option value="Другое">Другое</option>
                </select>
              </p>
              <label for="your-picture">Прикрепите ваше фото</label>
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
                <div class="preview" id="previewContainer">
                  <img
                    :src="previewImage || checkPhoto(ad.photo)"
                    id="preview"
                    alt="Предпросмотр"
                    style="max-width: 100%; max-height: 100%; object-fit: contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn custom-btn" @click="updateAd">
              Изменить объявление
            </button>
            <button type="button" class="btn custom-btn" @click="closeDialog('#dialog')">
              Отмена
            </button>
          </div>
          <p v-if="error" style="color: red; text-align: center">{{ error }}</p>
        </div>
      </dialog>
    </div>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="delpopup" style="overflow-y: hidden" id="deleting">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Удалить объявление</h1>
          <div class="text-center">
            <p style="font-size: 25px; text-align: left">
              Вы уверены, что хотите удалить объявление? После удаления вернуть его будет
              невозможно!
            </p>
            <button type="button" class="btn custom-btn" @click="deleteAd(ad.id)">
              Удалить объявление
            </button>
            <button type="button" class="btn custom-btn" @click="closeDialog('#deleting')">
              Отмена
            </button>
          </div>
        </div>
      </dialog>
    </div>
    <div class="container">
      <div class="row">
        <User />
        <div class="col-md-9">
          <h1 class="head">Мои объявления:</h1>
          <h2 class="head">{{ ad.title }}</h2>

          <!-- <div style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 450px"> -->
          <div class="carousel">
            <img
              v-if="ad.photo"
              :src="checkPhoto(ad.photo)"
              class="image-order"
              alt="Фото объявления"
              @click="showLightbox(ad.photo)"
              style="object-fit: contain; border-radius: 10px; border: 1px solid #2b8025"
            />
            <img
              v-else
              src="@/assets/images/default.png"
              class="image-order"
              width="410"
              height="410"
              @click="showLightbox(defaultImage)"
              alt="Фото по умолчанию"
            />
          </div>
          <div class="slider-container">
            <button class="btn custom-btn" @click="previousSlide">❮ предыдущая фотография</button>
            <button class="btn custom-btn" @click="nextSlide">следующая фотография ❯</button>
          </div>
          <!-- </div> -->
          <p style="font-size: 25px; font-weight: 500">Город: {{ ad.location || 'Не указан' }}</p>
          <p style="font-size: 25px; font-weight: 500">
            Категория: {{ ad.category || 'Не указана' }}
          </p>
          <p style="font-size: 25px; word-wrap: break-word">{{ ad.description }}</p>
          <p style="font-size: 35px; font-weight: 500">{{ ad.price }} &#8381;</p>
          <p>
            <button type="button" class="btn custom-btn" @click="showDialog('#dialog')">
              Изменить объявление
            </button>
            <button type="button" class="btn custom-btn" @click="showDialog('#deleting')">
              Удалить объявление
            </button>
          </p>
        </div>
      </div>
    </div>
    <VueEasyLightbox
      :visible="lightboxVisible"
      :imgs="[currentImage]"
      :index="0"
      @hide="lightboxVisible = false"
    />
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
  name: 'MyAdInfo',
  components: {
    Header,
    Footer,
    User,
  },
  data() {
    return {
      ad: {
        id: null,
        title: '',
        description: '',
        price: 0,
        category: '',
        location: '',
        photo: '',
        user: {
          id: null,
          username: '',
          avatarUrl: '',
        },
      },
      adForm: {
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        photo: null,
      },
      previewImage: null,
      loading: false,
      error: null,
      serverBaseUrl: 'http://localhost:8080',
      apiBaseUrl: 'http://localhost:8080/api/ads',
      defaultImage,
      lightboxVisible: false,
      currentImage: '',
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchAd() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('jwt')
        const response = await fetch(`${this.apiBaseUrl}/${this.$route.params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Ошибка загрузки объявления')
        }

        this.ad = await response.json()
        this.adForm = {
          title: this.ad.title,
          description: this.ad.description || '',
          price: this.ad.price.toString(),
          category: this.ad.category || '',
          location: this.ad.location || '',
          photo: null,
        }
        this.previewImage = this.checkPhoto(this.ad.photo)
      } catch (error) {
        this.error = error.message
        console.error('Ошибка:', error)
      } finally {
        this.loading = false
      }
    },
    async updateAd() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }

      const formData = new FormData()
      if (this.adForm.title) formData.append('title', this.adForm.title)
      if (this.adForm.description) formData.append('description', this.adForm.description)
      if (this.adForm.price) formData.append('price', this.adForm.price)
      if (this.adForm.category) formData.append('category', this.adForm.category)
      if (this.adForm.location) formData.append('location', this.adForm.location)
      if (this.adForm.photo) formData.append('photo', this.adForm.photo)

      try {
        const response = await fetch(`${this.apiBaseUrl}/update/${this.ad.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          this.error = ''
          this.closeDialog('#dialog')
          await this.fetchAd() // Обновляем данные объявления
        } else {
          const errorText = await response.text()
          this.error = `Ошибка обновления объявления: ${errorText}`
        }
      } catch (e) {
        this.error = 'Ошибка сервера при обновлении объявления'
        console.error('Исключение:', e)
      }
    },
    async deleteAd(adId) {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const response = await fetch(`${this.apiBaseUrl}/delete/${adId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.error = ''
          this.closeDialog('#deleting')
          this.$router.push('/myads')
        } else if (response.status === 403) {
          this.error = 'Вы не можете удалить это объявление'
        } else if (response.status === 404) {
          this.error = 'Объявление не найдено'
        } else {
          this.error = 'Ошибка удаления объявления: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера при удалении объявления'
        console.error('Исключение:', e)
      }
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.adForm.photo = file
        const reader = new FileReader()
        reader.onload = (event) => {
          this.previewImage = event.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.previewImage = this.checkPhoto(this.ad.photo)
        this.adForm.photo = null
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
    showLightbox(imageUrl) {
      this.currentImage = this.checkPhoto(imageUrl)
      this.lightboxVisible = true
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
    this.fetchUserProfile()
    this.fetchAd()
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
  height: 75%;
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

.carousel {
  padding: 20px 2px 2px;
  height: 50%;
  width: 100%;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  display: flex;
  gap: 10px;
  scroll-behavior: smooth;
}

.carousel > img {
  scroll-snap-align: center;
}
.slider-container {
  padding-top: 10px;
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  outline: none;
  justify-content: space-between;
}
</style>
