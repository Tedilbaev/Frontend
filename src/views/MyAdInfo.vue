<template>
  <Header />
  <main>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="popup" style="overflow-y: hidden">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Создать объявление</h1>
          <div class="row">
            <div class="col-md-6">
              <label for="nameOrder">Введите название объявления</label>
              <p>
                <input
                  type="text"
                  name="nameOrder"
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
                  class="custom-text wrap-text"
                  name="noteOrder"
                  id="noteOrder"
                  rows="14"
                  cols="10"
                  wrap="soft"
                  style="width: 100%"
                >
                </textarea>
              </p>
              <label for="priceOrder">Введите цену на услугу (Цена в рублях)</label>
              <p>
                <input
                  type="text"
                  name="priceOrder"
                  id="priceOrder"
                  placeholder="Например: 2000"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="10"
                />
              </p>
              <label for="categoryOrder">Выберите категорию вашего объявления</label>
              <p>
                <select id="categoryOrder" class="select" name="Категория">
                  <option value="waterTech">Сантехника</option>
                  <option value="electroTech">Электроника</option>
                  <option value="scepIT">IT</option>
                  <option value="household">Бытовая техника</option>
                  <option value="hire">Услуга по найму</option>
                  <option value="another">Другое</option>
                </select>
              </p>
              <label for="your-picture">Прикрепите Ваше фото</label>
              <p>
                <input
                  type="file"
                  id="your-picture"
                  name="your-picture"
                  accept=".jpg, .jpeg, .png"
                />
              </p>
            </div>
            <div class="col-md-6">
              <div
                style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 450px"
              >
                <div class="preview" id="previewContainer">
                  <img id="preview" src="#" alt="Предпросмотр" />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center" style="align-items: center; justify-content: center">
            <button type="button" class="btn custom-btn" id="change">Изменить объявление</button>
            <button type="button" class="btn custom-btn" id="cancel" @click="closeDialog('dialog')">
              Отмена
            </button>
          </div>
        </div>
      </dialog>
    </div>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="delpopup" style="overflow-y: hidden" id="deleting">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Удалить объявление</h1>
          <div class="text-center" style="align-items: center; justify-content: center">
            <p style="font-size: 25px; text-align: left">
              Вы уверены, что хотите удалить объявление? После удаления вернуть его будет
              невозможно!
            </p>
            <button type="button" class="btn custom-btn" id="delete" @click="deleteAd(ad.id)">
              Удалить объявление
            </button>
            <button
              type="button"
              class="btn custom-btn"
              id="cancel1"
              @click="closeDialog('#deleting')"
            >
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
          <h1 class="head">{{ ad.title }}</h1>
          <div style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 450px">
            <img
              v-if="ad.photo"
              :src="checkPhoto(ad.photo)"
              class="image-order"
              width="410"
              height="410"
              alt="Фото объявления"
              @click="showLightbox(ad.photo)"
              style="object-fit: fill; max-width: 100%; max-height: 100%"
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
          <p style="font-size: 25px; font-weight: 500">Город: {{ ad.location || 'Не указан' }}</p>
          <p style="font-size: 25px; font-weight: 500">
            Категория: {{ ad.category || 'Не указана' }}
          </p>
          <p style="font-size: 25px">{{ ad.description }}</p>
          <p style="font-size: 35px; font-weight: 500">{{ ad.price }} &#8381;</p>
          <p>
            <button
              type="button"
              class="btn custom-btn"
              id="dialogbar"
              @click="showDialog('dialog')"
            >
              Изменить объявление
            </button>
            <button
              type="button"
              class="btn custom-btn"
              id="deletebar"
              @click="showDialog('#deleting')"
            >
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
            Authorization: `Bearer ${token}`,
          },
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
    showDialog(dialogwindow) {
      document.querySelector(dialogwindow).showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialog(dialogwindow) {
      document.querySelector(dialogwindow).close()
    },
  },
  mounted() {
    this.fetchUserProfile()
    this.fetchAd()
  },
}
</script>
