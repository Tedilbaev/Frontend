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
                  <option v-for="cat in category" :key="cat.id" v-value="cat.name">
                    {{ cat.name }}
                  </option>
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

          <div class="carousel-container">
            <div class="carousel">
              <template v-if="allPhotos.length > 0">
                <div v-for="(photo, index) in allPhotos" :key="index" class="photo-container">
                  <img
                    :src="checkPhoto(photo.url)"
                    class="image-order"
                    :alt="'Фото объявления ' + (index + 1)"
                    @click="showLightbox(photo.url)"
                  />
                  <button class="delete-photo-btn" @click.stop="deletePhoto(photo.id)">
                    ×
                  </button>
                </div>
              </template>
              <img
                v-else
                :src="defaultImage"
                class="image-order"
                @click="showLightbox(defaultImage)"
                alt="Фото по умолчанию"
              />
            </div>
          </div>

          <div class="photo-management">
            <input
              type="file"
              id="add-photos"
              accept=".jpg, .jpeg, .png"
              multiple
              @change="handleNewPhotos"
              style="display: none"
            />
            <label for="add-photos" class="btn custom-btn">Добавить фото</label>
          </div>
         
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
          <div>
            <div class="comments-section">
              <h2>Комментарии</h2>
              <div class="comment-form">
                <textarea 
                  v-model="newComment" 
                  placeholder="Напишите ваш комментарий..."
                  rows="3"
                ></textarea>
                <button class="btn custom-btn" @click="addComment" :disabled="!newComment.trim()">Добавить</button>
              </div>
              <div class="comments-list">
                <div 
                  v-for="(comment, index) in comments" 
                  :key="index" 
                  class="comment"
                >
                  <div class="comment-content">
                    <span v-if="comment.user.id == user.id" class="comment-user" style="font-weight: 600;">Вы</span>
                    <span v-else class="comment-user" style="font-weight: 600;">{{comment.user.username}}</span>
                    <span class="comment-date" style="margin-left: 15px;">{{ formatDate(comment.createdAt) }}</span>
                    <p>{{ comment.textComment }}</p>
                  </div>
                  <button 
                    v-if="comment.user.id == user.id"
                    @click="deleteComment(comment.id)"
                    class="delete-btn"
                    title="Удалить комментарий"
                  >
                    ×
                  </button>
                </div>
                
                <p v-if="comments.length === 0" class="no-comments">Пока нет комментариев...</p>
              </div>
            </div>
          </div>
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
      currentPhotoIndex: 0,
      photos: [],
      newPhotos: [], // Сюда закидывай новые фотки
      category: [],
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
      newComment: '',
      comments: []
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    allPhotos() {
      const combined = []
      if (this.ad.photo) {
        combined.push({
          id: this.ad.id,
          url: this.ad.photo,
          isMain: true,
        })
      }
      if (this.photos.length > 0) {
        this.photos.forEach((photo) => {
          if (!this.ad.photo || photo.photo !== this.ad.photo) {
            combined.push({
              id: photo.id,
              url: photo.photo,
              isMain: false,
            })
          }
        })
      }
      return combined
    },
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
        this.fetchAllPhoto()
        this.fetchAllComments()
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
    async fetchAllPhoto() {
      const token = localStorage.getItem('jwt')
      console.log(this.ad.id)
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL('http://localhost:8080/api/photos/adPhotos')
        url.searchParams.append('adId', this.ad.id)
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.photos = await response.json()
          console.log(this.photos)
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
    async createPhoto() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      if (!this.newPhotos || this.newPhotos.length === 0) {
        this.error = 'Нет файлов для загрузки'
        return
      }
      const formData = new FormData()
      formData.append('adId', this.ad.id)
      this.newPhotos.forEach((file) => {
        formData.append('photo', file)
      })
      try {
        const response = await fetch(`${this.serverBaseUrl}/api/photos/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        if (response.ok) {
          await this.fetchAllPhoto()
          this.newPhotos = []
          this.error = ''
        } else {
          const errorData = await response.json().catch(() => null)
          this.error = `Ошибка: ${errorData?.message || response.statusText}`
        }
      } catch (e) {
        this.error = 'Ошибка соединения'
        console.error('Upload error:', e)
      }
    },
    async deletePhoto(photoId) {
      console.log(photoId)
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const response = await fetch(`http://localhost:8080/api/photos/delete/${photoId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.error = ''
          // this.closeDialog('#deleting')
          this.fetchAd()
        } else if (response.status === 403) {
          this.error = 'Вы не можете удалить эту фотографию'
        } else if (response.status === 404) {
          this.error = 'Фотография не найдена'
        } else {
          this.error = 'Ошибка удаления фотографии: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера при удалении фотографии'
        console.error('Исключение:', e)
      }
    },
    handleNewPhotos(e) {
      const files = e.target.files
      if (files && files.length > 0) {
        this.newPhotos = Array.from(files)
        this.createPhoto()
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
    async fetchAllComments() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL('http://localhost:8080/api/comments/all')
        console.log(this.ad.id)
        url.searchParams.append('adId', this.ad.id)
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.comments = await response.json()
          console.log(this.comments)
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
    async addComment() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      const formData = new FormData()
      formData.append('textComment', this.newComment)
      formData.append('adId', this.ad.id)
      try {
        const response = await fetch(`http://localhost:8080/api/comments/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        console.log('Статус ответа:', response.status)
        if (response.ok) {
          this.newComment = ''
          this.fetchAllComments()
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
    async deleteComment(commentId) {
      console.log(commentId)
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const response = await fetch(`http://localhost:8080/api/comments/delete/${commentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.error = ''
          this.fetchAd()
          this.fetchAllComments()
        } else if (response.status === 403) {
          this.error = 'Вы не можете удалить этот комментарий'
        } else if (response.status === 404) {
          this.error = 'Комментарий не найден'
        } else {
          this.error = 'Ошибка удаления комментария: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера при удалении комментария'
        console.error('Исключение:', e)
      }
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
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
    },
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchAd()
    this.fetchAllCategory('createdAt', 'asc')
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

.carousel-container {
  width: 100%;
  margin: 0 auto;
  padding: 10px 0;
}

.carousel {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px;
  scroll-snap-type: x mandatory;
}

.photo-container {
  position: relative;
  flex: 0 0 auto;
  scroll-snap-align: center;
}

.image-order {
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #2b8025;
  cursor: pointer;
 }

.delete-photo-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background-color: rgba(252, 252, 252, 0.966);
  color: rgb(0, 0, 0);
  border: 1px solid black ;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.delete-photo-btn:hover {
  background-color: rgba(255, 0, 0, 0.9);
  color: white;
}

.photo-management {
  margin-top: 20px;
  text-align: left;
}

.comments-section {
  max-width: 100%;
  margin: 0 auto;
  /* padding: 20px; */
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #2b8025;
  border-radius: 20px;
  resize: vertical;

}

.comment-form button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.comments-list {
  border-top: 1px solid #eee;
  padding-top: 2px;
}

.comment {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  border-radius: 20px;
  border: 1px solid #2b8025;
  position: relative;
}

.comment-content p {
  margin: 0 0 5px 0;
  color: #333;
}

.comment-date {
  font-size: 12px;
  color: #888;
}

.no-comments {
  text-align: center;
  font-size: large;
}

.delete-btn {
  border: 1px solid #2b8025;
  border-radius: 15px;
}
.delete-btn:hover {
  background-color: red;
  color: white;
  transition: .3s ease-in-out;
}
</style>
