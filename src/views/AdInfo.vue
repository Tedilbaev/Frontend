<template>
  <Header />
  <main>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="replenishpopup" style="overflow-y: hidden; height: 25%; top: 30%" id="confirm">
        <div class="content" style="overflow-y: hidden">
          <h3 style="text-align: center">Оплата заказа прошла успешно</h3>
          <div class="text-center">
            <p style="margin-top: 30px">
              <button type="button" class="btn custom-btn" @click="goToAds">Продолжить</button>
            </p>
          </div>
        </div>
      </dialog>
    </div>
    <div class="container">
      <div class="row">
        <User />
        <div class="col-md-9">
          <div class="margin"></div>
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
          <p style="font-size: 25px; font-weight: 500">Город: {{ ad.location || 'Не указан' }}</p>
          <p style="font-size: 25px; font-weight: 500">
            Категория: {{ ad.category || 'Не указана' }}
          </p>
          <p style="font-size: 25px; word-wrap: break-word">{{ ad.description }}</p>
          <p style="font-size: 35px; font-weight: 500">{{ ad.price }} &#8381;</p>
          <button
            v-if="isFromMyOrders"
            type="button"
            class="btn custom-btn"
            style="height: 40px"
            @click="(payOrder(), showDialog('#confirm'))"
          >
            Оплатить заказ
          </button>
          <button
            v-else-if="!isFromAllAds"
            type="button"
            class="btn custom-btn"
            style="height: 40px"
            @click="createOrder"
          >
            Добавить в свои заказы
          </button>
          <div style="font-size: 25px">
            Автор:
            <div
              style="
                background-color: white;
                box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
                padding-left: 10px;
                border-radius: 20px;
                width: 50%;
                font-size: 22px;
                color: black;
              "
            >
              <a
                href=""
                style="width: 100%; display: inline-block; text-decoration: none; color: black"
              >
                <img
                  :src="checkPhoto(ad.user.avatarUrl)"
                  class="image-round margin"
                  width="50"
                  height="50"
                />
                {{ ad.user.username }}
              </a>
            </div>
          </div>
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
  name: 'AdInfo',
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
      currentUser: null,
      photos: [],
      loading: false,
      error: null,
      serverBaseUrl: 'http://localhost:8080',
      apiBaseUrl: 'http://localhost:8080/api/ads',
      defaultImage,
      lightboxVisible: false,
      currentImage: '',
      check: false,
      newComment: '',
      comments: []    
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
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
    isFromMyOrders() {
      return this.$route.query.from === 'myorders'
    },
    isFromAllAds() {
      return this.$route.query.from === 'allads'
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
      } catch (error) {
        this.error = error.message
        console.error('Ошибка:', error)
      } finally {
        this.loading = false
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
    async payOrder() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      this.error = ''
      const formData = new FormData()
      console.log(this.ad.user.id, this.ad.id, this.ad.price, this.user.id)
      formData.append('userId', this.ad.user.id)
      formData.append('orderId', this.ad.id.toString())
      formData.append('amount', this.ad.price.toString())
      const formData1 = new FormData()
      formData1.append('userId', this.user.id)
      formData1.append('orderId', this.ad.id.toString())
      formData1.append('amount', this.ad.price.toString())
      try {
        const response = await fetch(`http://localhost:8080/api/balance/deposit`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        if (response.ok) {
          this.error = ''
          // this.closeDialog('#withdraw')
          await this.fetchUserProfile()
        } else {
          const errorText = await response.text()
          this.error = `Ошибка обновления объявления: ${errorText}`
        }
      } catch (e) {
        this.error = 'Ошибка сервера при обновлении объявления'
        console.error('Исключение:', e)
      }
      try {
        const response1 = await fetch(`http://localhost:8080/api/balance/payment`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData1,
        })
        if (response1.ok) {
          this.error = ''
          // this.closeDialog('#withdraw')
          await this.fetchUserProfile()
        } else {
          const errorText = await response1.text()
          this.error = `Ошибка обновления объявления: ${errorText}`
        }
      } catch (e) {
        this.error = 'Ошибка сервера при обновлении объявления'
        console.error('Исключение:', e)
      }
    },
    async createOrder() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      const formData = new FormData()
      formData.append('adId', this.ad.id)
      formData.append('performerId', this.ad.user.id)
      try {
        const response = await fetch(`http://localhost:8080/api/orders/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        if (response.ok) {
          const order = await response.json()
          this.$router.push('/myorder')
          // this.categorySearchQuery = '';
          // this.fetchAllCategory('createdAt', 'asc')
        } else {
          const errorText = await response.text()
          this.error = 'Ошибка создания заказа: ' + response.status + ' - ' + errorText
          console.error('Ошибка сервера:', errorText)
        }
      } catch (e) {
        this.error = 'Ошибка сервера при создании заказа'
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
    showLightbox(imageUrl) {
      this.currentImage = this.checkPhoto(imageUrl)
      this.lightboxVisible = true
    },
    goToAds() {
      this.$router.push({ name: 'MyOrders' })
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

</style>
