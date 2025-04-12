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
            <button type="button" class="btn custom-btn" id="cancel">Отмена</button>
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
            <button type="button" class="btn custom-btn" id="delete">Удалить объявление</button>
            <button type="button" class="btn custom-btn" id="cancel1">Отмена</button>
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
            <p class="margin" style="font-size: 25px; font-weight: 500">Город: Астрахань</p>
            <p style="font-size: 25px">
              Описание: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
              ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient
              montes, nascetur ridiculus mus.
            </p>
            <h3>Контактная информация:</h3>
            <p style="font-size: 25px">{{ user.phone }}</p>
            <p style="font-size: 25px">{{ user.email }}</p>
            <p>
              <button type="button" class="btn custom-btn" id="dialogbar">Изменить аккаунт</button>
              <button type="button" class="btn custom-btn" id="deletebar">Изменить пароль</button>
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
  },
  mounted() {
    this.fetchUserProfile()
  },
}
</script>
