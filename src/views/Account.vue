<template>
  <Header />
  <main>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="popup" style="overflow-y: hidden" id="changeAcc">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Изменить аккаунт</h1>
          <div class="row">
            <div class="col-md-6">
              <label for="name">Введите новое имя пользователя (До 20 символов): </label>
              <p>
                <input
                  type="text"
                  name="name"
                  id="name"
                  class="custom-text"
                  style="width: 100%"
                  maxlength="20"
                />
              </p>
              <label for="city">Введите ваш населенный пункт<sup>*</sup>: </label>
              <p>
                <input
                  class="custom-text"
                  name="city"
                  id="city"
                  wrap="soft"
                  style="width: 100%"
                >
                </ш>
              </p>
              <label for="userdescription">Напишите о себе:</label>
              <p>
                <textarea
                  class="custom-text wrap-text"
                  name="userdescription"
                  id="userdescription"
                  rows="14"
                  cols="10"
                  wrap="soft"
                  style="width: 100%"
                ></textarea>
              </p>
              <label for="phone">Введите или измените ваш номер телефона:</label>
              <p>
                <input
                  class="custom-text"
                  name="phone"
                  id="phone"
                  wrap="soft"
                  style="width: 100%"
                >
              </p>
              <label for="email">Введите или измените вашу электронную почту:</label>
              <p>
                <input
                  class="custom-text"
                  name="email"
                  id="email"
                  wrap="soft"
                  style="width: 100%"
                >
              </p>
            </div>
            <div class="col-md-6">
              <div
                style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 80%; margin-top: 25px"
              >
                <div class="preview" id="previewContainer">
                  <img id="preview" src="#" alt="Предпросмотр" />
                </div>
              </div>
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
          </div>
          <div class="text-center" style="align-items: center; justify-content: center">
            <button type="button" class="btn custom-btn" @click="closeDialogAcc">Изменить аккаунт</button> <!--здесь пока закрытие окна-->
            <button type="button" class="btn custom-btn" @click="closeDialogAcc">Отмена</button>
          </div>
        </div>
      </dialog>
    </div>
    <div class="holder" style="overflow-y: hidden">
      <dialog class="delpopup" style="overflow-y: hidden" id="changePass">
        <div class="content" style="overflow-y: hidden">
          <h3 style="text-align: center">Изменить пароль</h3>
          <div class="text-center" >
            <label for="login">Введите ваш логин:</label>
            <p>
              <input
                v-model="email"
                type="text"
                id="login"
                placeholder="Например: ivanivanov@mail.ru"
                class="custom-text"
                @click="hideError"
              />
            </p>
            <label for="oldPassword">Введите ваш старый пароль:</label>
            <p>
              <input
                v-model="password"
                type="oldPassword"
                id="oldPassword"
                class="custom-text"
                @click="hideError"
              />
            </p>
            <label for="newPassword">Введите новый пароль:</label>
            <p>
              <input
                v-model="password"
                type="newPassword"
                id="newPassword"
                class="custom-text"
                @click="hideError"
              />
            </p>
            <label for="checkPassword">Подтвердите пароль:</label>
            <p>
              <input
                v-model="password"
                type="checkPassword"
                id="checkPassword"
                class="custom-text"
                @click="hideError"
              />
            </p>
            <button type="button" class="btn custom-btn" @click="closeDialogChangePass">Изменить пароль</button>
            <button type="button" class="btn custom-btn" @click="closeDialogChangePass">Отмена</button>
          </div>
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
              :src="user.avatarUrl"
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
              @click="showLightbox(require('@/assets/images/default.png'))"
            />
            <p class="margin" style="font-size: 25px; font-weight: 500">
              Местоположение: {{ user.location }}
            </p>
            <p style="font-size: 25px">Описание: {{ user.description }}</p>
            <h3>Контактная информация:</h3>
            <p style="font-size: 25px">{{ user.phone }}</p>
            <p style="font-size: 25px">{{ user.email }}</p>
            <p>
              <button type="button" class="btn custom-btn" @click="showDialogAcc">Изменить аккаунт</button>
              <button type="button" class="btn custom-btn" @click="showDialogPass">Изменить пароль</button>
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
  data() {
    return {
      lightboxVisible: false,
      currentImage: '',
    }
  },
  name: 'Account',
  components: {
    Header,
    Footer,
    User,
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    showLightbox(imageUrl) {
      this.currentImage = imageUrl
      this.lightboxVisible = true
    },
    showDialogAcc() {
      document.getElementById('changeAcc').showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialogAcc() {
      document.getElementById('changeAcc').close()
    },
    showDialogPass() {
      document.getElementById('changePass').showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialogChangePass() {
      document.getElementById('changePass').close()
    },
  },
  mounted() {
    this.fetchUserProfile()
    
  },

}
</script>
