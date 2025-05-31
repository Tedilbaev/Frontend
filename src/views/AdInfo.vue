<template>
  <Header />
  <main>
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
          <p style="font-size: 25px">{{ ad.description }}</p>
          <p style="font-size: 35px; font-weight: 500">{{ ad.price }} &#8381;</p>
          <button 
            v-if="isFromMyOrders" 
            type="button" 
            class="btn custom-btn" 
            style="height: 40px" 
            @click="payOrder"
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
      check: false
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
      return this.$route.query.from === 'myorder';
    },
    isFromAllAds() {
      return this.$route.query.from === 'allads';
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
    showLightbox(imageUrl) {
      this.currentImage = this.checkPhoto(imageUrl)
      this.lightboxVisible = true
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