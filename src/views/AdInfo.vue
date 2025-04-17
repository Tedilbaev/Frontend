<template>
    <Header />
    <main>
    <div class="container">
        <div class="row">
            <User />
            <div class="col-md-9">
                <div class="margin"></div>
                <h2 class="head">{{ ad.title }}</h2>
                <!-- <div style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 450px;"> -->
                    <img
                        v-if="ad.photo"
                        :src="checkPhoto(ad.photo)"
                        class="image-order"
                        alt="Фото объявления"
                        @click="showLightbox(ad.photo)"
                        style="object-fit: fill; max-width: 80%; max-height: 50%; border-radius: 10px; border: 1px solid #2b8025;"
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
                <!-- </div> -->
                <p style="font-size: 25px; font-weight:500;">Город: {{ ad.location || 'Не указан' }}</p>
                <p style="font-size: 25px; font-weight:500;">Категория: {{ ad.category || 'Не указана' }}</p>
                <p style="font-size: 25px;">{{ ad.description }}</p>
                <p style="font-size: 35px; font-weight:500;">{{ ad.price }} &#8381;</p>
                <p style="font-size: 25px;">Автор:
                    <div style="background-color: white; box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2); padding-left: 10px; border-radius: 20px; width: 50%; font-size: 22px; color: black;">
                        <a href="" style="width: 100%; display: inline-block; text-decoration: none; color: black;">
                            <img 
                                :src="checkPhoto(ad.user.avatarUrl)" 
                                class="image-round margin" 
                                width="50" 
                                height="50">  {{ ad.user.username }} </a>
                        </div>
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
    <div style="height: 150px;"></div>
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
          avatarUrl: ''
        }
      },
      loading: false,
      error: null,
      serverBaseUrl: 'http://localhost:8080',
      apiBaseUrl: 'http://localhost:8080/api/ads',
      defaultImage,
      lightboxVisible: false,
      currentImage: '',
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
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки объявления')
        }
        
        this.ad = await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Ошибка:', error)
      } finally {
        this.loading = false
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