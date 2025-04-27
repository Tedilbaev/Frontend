<template>
  <Header />
  <main>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="popup" style="overflow-y: hidden" id="changeAcc">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Изменить аккаунт</h1>
          <div class="row">
            <div class="col-md-6">
              <label for="name">Введите новое имя пользователя (до 20 символов):</label>
              <p>
                <input
                  v-model="profile.username"
                  type="text"
                  id="name"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="20"
                />
              </p>
              <label for="city">Введите ваш населенный пункт:</label>
              <p>
                <input
                  v-model="profile.location"
                  class="custom-text"
                  id="city"
                  style="width: 100%"
                />
              </p>
              <label for="userdescription">Напишите о себе:</label>
              <p>
                <textarea
                  v-model="profile.description"
                  class="custom-text wrap-text"
                  id="userdescription"
                  rows="14"
                  cols="10"
                  wrap="soft"
                  style="width: 100%"
                ></textarea>
              </p>
              <label for="phone">Введите или измените ваш номер телефона:</label>
              <p>
                <input v-model="profile.phone" class="custom-text" id="phone" style="width: 100%" />
              </p>
              <label for="email">Введите или измените вашу электронную почту:</label>
              <p>
                <input v-model="profile.email" class="custom-text" id="email" style="width: 100%" />
              </p>
            </div>
            <div class="col-md-6">
              <div
                style="
                  width: 100%;
                  border-radius: 10px;
                  border: 1px solid #2b8025;
                  height: 450px;
                  margin-top: 25px;
                "
              >
                <div class="preview" id="previewContainer">
                  <img
                    :src="previewImage || '/images/default.png'"
                    id="preview"
                    alt="Предпросмотр"
                    style="max-width: 100%; max-height: 100%; object-fit: contain"
                  />
                </div>
              </div>
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
          </div>
          <div class="text-center">
            <button type="button" class="btn custom-btn" @click="updateProfile">
              Изменить аккаунт
            </button>
            <button type="button" class="btn custom-btn" @click="closeDialogAcc">Отмена</button>
          </div>
          <p v-if="error" style="color: red; text-align: center">{{ error }}</p>
        </div>
      </dialog>
    </div>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="delpopup" style="overflow-y: hidden" id="changePass">
        <div class="content" style="overflow-y: hidden">
          <h3 style="text-align: center">Изменить пароль</h3>
          <div class="text-center">
            <label for="oldPassword">Введите ваш старый пароль:</label>
            <p>
              <input
                v-model="password.oldPassword"
                type="password"
                id="oldPassword"
                class="custom-text"
              />
            </p>
            <label for="newPassword">Введите новый пароль:</label>
            <p>
              <input
                v-model="password.newPassword"
                type="password"
                id="newPassword"
                class="custom-text"
              />
            </p>
            <label for="checkPassword">Подтвердите пароль:</label>
            <p>
              <input
                v-model="password.confirmPassword"
                type="password"
                id="checkPassword"
                class="custom-text"
              />
            </p>
            <button type="button" class="btn custom-btn" @click="changePassword">
              Изменить пароль
            </button>
            <button type="button" class="btn custom-btn" @click="closeDialogChangePass">
              Отмена
            </button>
          </div>
          <p v-if="error" style="color: red; text-align: center">{{ error }}</p>
        </div>
      </dialog>
    </div>
    <div id="app" class="container">
      <div class="row">
        <User />
        <div class="col-md-9">
          <h1 class="head">Аккаунт:</h1>
          <div v-if="user">
            <h3 class="head">{{ user.username }}</h3>
            <img
              v-if="user.avatarUrl"
              :src="checkPhoto(user.avatarUrl)"
              class="image-round margin"
              width="200"
              height="200"
              alt="Аватар"
              @click="showLightbox(user.avatarUrl)"
            />
            <img
              v-else
              src="@/assets/images/default.png"
              class="image-round margin"
              width="200"
              height="200"
              alt="Аватар по умолчанию"
              @click="showLightbox('@/assets/images/default.png')"
            />
            <p class="margin" style="font-size: 25px; font-weight: 500">
              Местоположение: {{ user.location || 'Не указано' }}
            </p>
            <p style="font-size: 25px">Описание: {{ user.description || 'Не указано' }}</p>
            <h3>Контактная информация:</h3>
            <p style="font-size: 25px">{{ user.phone || 'Не указан' }}</p>
            <p style="font-size: 25px">{{ user.email }}</p>
            <p>
              <button type="button" class="btn custom-btn" @click="showDialogAcc">
                Изменить аккаунт
              </button>
              <button type="button" class="btn custom-btn" @click="showDialogPass">
                Изменить пароль
              </button>
            </p>
          </div>
          <div v-else>
            <p>Загрузка данных...</p>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 150px"></div>
    <VueEasyLightbox
      :visible="lightboxVisible"
      :imgs="[currentImage]"
      :index="0"
      @hide="lightboxVisible = false"
    />
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
  name: 'Account',
  components: {
    Header,
    Footer,
    User,
  },
  data() {
    return {
      lightboxVisible: false,
      currentImage: '',
      profile: {
        username: '',
        email: '',
        location: '',
        description: '',
        phone: '',
        avatar: null,
      },
      password: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      previewImage: null,
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
    showLightbox(imageUrl) {
      this.currentImage = this.checkPhoto(imageUrl)
      this.lightboxVisible = true
    },
    checkPhoto(photoUrl, defaultUrl = '@/assets/images/default.png') {
      if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'null') {
        return defaultUrl
      }
      if (photoUrl.startsWith('/userData/')) {
        return `${this.serverBaseUrl}${photoUrl}`
      }
      return photoUrl
    },
    showDialogAcc() {
      this.profile = {
        username: this.user?.username || '',
        email: this.user?.email || '',
        location: this.user?.location || '',
        description: this.user?.description || '',
        phone: this.user?.phone || '',
        avatar: null,
      }
      this.previewImage = this.checkPhoto(this.user?.avatarUrl)
      document.getElementById('changeAcc').showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialogAcc() {
      this.error = ''
      this.previewImage = null
      document.getElementById('changeAcc').close()
    },
    showDialogPass() {
      this.password = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
      this.error = ''
      document.getElementById('changePass').showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialogChangePass() {
      this.error = ''
      document.getElementById('changePass').close()
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.profile.avatar = file
        const reader = new FileReader()
        reader.onload = (event) => {
          this.previewImage = event.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.previewImage = null
      }
    },
    async updateProfile() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }

      const formData = new FormData()
      if (this.profile.username) formData.append('username', this.profile.username)
      if (this.profile.email) formData.append('email', this.profile.email)
      if (this.profile.location) formData.append('location', this.profile.location)
      if (this.profile.description) formData.append('description', this.profile.description)
      if (this.profile.phone) formData.append('phone', this.profile.phone)
      if (this.profile.avatar) {
        formData.append('avatar', this.profile.avatar)
      }

      try {
        const response = await fetch(`${this.apiBaseUrl}/update`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          await this.fetchUserProfile()
          this.closeDialogAcc()
        } else {
          const errorText = await response.text()
          this.error = `Ошибка обновления профиля: ${errorText}`
        }
      } catch (e) {
        this.error = 'Ошибка сервера при обновлении профиля'
        console.error('Исключение:', e)
      }
    },
    async changePassword() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }

      if (this.password.newPassword !== this.password.confirmPassword) {
        this.error = 'Пароли не совпадают'
        return
      }
      const formData = new FormData()
      formData.append('oldPassword', this.password.oldPassword)
      formData.append('newPassword', this.password.newPassword)
      formData.append('confirmPassword', this.password.confirmPassword)

      try {
        const response = await fetch(`${this.apiBaseUrl}/password`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          this.closeDialogChangePass()
        } else {
          const errorText = await response.text()
          this.error = `Ошибка смены пароля: ${errorText}`
        }
      } catch (e) {
        this.error = 'Ошибка сервера при смене пароля'
        console.error('Исключение:', e)
      }
    },
  },
  mounted() {
    this.fetchUserProfile()
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
.delpopup {
  height: 37%;
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
