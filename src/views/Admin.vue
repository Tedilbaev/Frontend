<template>
    <Header />
    <main>
      <div class="holder" style="overflow-y: hidden;">
      <dialog class="popup" style="overflow-y: hidden;" id="dialog">
        <div class="content" style="overflow-y: hidden;">
          <h1 style="text-align: center;">Изменить объявление</h1>
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
                  style="width: 100%;"
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
                  style="width: 100%;"
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
                  style="width: 100%;"
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
              <div style="width: 100%; border-radius: 10px; border: 1px solid #2b8025; height: 450px;">
                <div class="preview" id="previewContainer">
                  <img
                    :src="previewImage || checkPhoto(currentAd.photo)"
                    id="preview"
                    alt="Предпросмотр"
                    style="max-width: 100%; max-height: 100%; object-fit: contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn custom-btn" @click="updateAd">Изменить объявление</button>
            <button type="button" class="btn custom-btn" style="background-color: #d9534f; color: #f2f2f2;" @click="deleteAd(currentAd.id)">Удалить объявление</button>
            <button type="button" class="btn custom-btn" @click="closeDialog">Отмена</button>
          </div>
          <p v-if="error" style="color: red; text-align: center">{{ error }}</p>
        </div>
      </dialog>
    </div>

    <div class="row" style="display: flex; justify-content: center;">
      <div class="col-md-5">
        <h1 class="head">Все объявления:</h1>
        <input class="custom-text" type="text" id="myInput" style="margin: 10px 0 15px 0" placeholder="Поиск по названию или типу" v-model="searchQuery" @input="search">
        <select id="filter" class="select" name="filter" style="width:150px; padding-left: 5px;" v-model="searchType">
          <option value="name" selected="selected">Название</option>
          <option value="type">Тип услуги</option>
        </select>
        <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px">
          <table class="table table-striped w-100" id="myTable">
            <thead>
              <tr>
                <th scope="col" style="font-size: 15px;">№</th>
                <th scope="col" style="font-size: 15px;">Название</th>
                <th scope="col" style="font-size: 15px;">Тип услуги</th>
                <th scope="col" style="font-size: 15px;">Сумма (&#8381;)</th>
                <th scope="col" style="font-size: 15px;">Дата</th>
                <th scope="col" style="font-size: 15px;">Описание</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ad in ads" :key="ad.id" @click="openEditDialog(ad)">
                <td>{{ ad.id }}</td>
                <td>{{ ad.title }}</td>
                <td>{{ ad.category }}</td>
                <td>{{ ad.price }}</td>
                <td>{{ formatDate(ad.createdAt) }}</td>
                <td style="white-space: wrap;">{{ ad.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
        <div class="col-md-5">
          <h1 class="head">Сделки:</h1>
          <div style="margin: 10px 0 12px 0">
            <input id="all" type="button" class="btn custom-btn" value="Все"></input>
            <input id="active" type="button" class="btn custom-btn" value="Активно"></input>
            <input id="finished" type="button" class="btn custom-btn" value="Завершено"></input>
            <input id="declined" type="button" class="btn custom-btn" value="Отклонено"></input>
          </div>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px">
            <table class="table table-striped w-100" id="myTable1">
              <thead>
                <tr>
                  <th scope="col" style="font-size: 15px;">№</th>
                  <th scope="col" style="font-size: 15px;">Пользователь 1</th>
                  <th scope="col" style="font-size: 15px;">Пользователь 2</th>
                  <th scope="col" style="font-size: 15px;">Сумма (&#8381;)</th>
                  <th scope="col" style="font-size: 15px;">Дата</th>
                  <th scope="col" style="font-size: 15px;">Статус</th>
                </tr>
              </thead>
              <tbody >
                <tr >
                  <td>1</td>
                  <td>Услуги сантехника</td>
                  <td>Сантехника</td>
                  <td>5000.00</td>
                  <td>19.06.2004</td>
                  <td>Бла-бла...</td>
                </tr>
                <!-- Остальные строки -->
                <tr>
                  <td>2</td>
                  <td>Услуги электрика</td>
                  <td>Сантехника</td>
                  <td>10000.00</td>
                  <td>19.06.2004</td>
                  <td>Активно</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row" style="display: flex; justify-content: center;">
        <div class="col-md-5">
          <h1 class="head">Пользователи:</h1>
          <input class="custom-text" type="text" id="myInput" style="margin: 10px 0 15px 0" onkeyup="finding()" placeholder="Поиск по названию или типу" v-model="searchQuery" @input="search">
          <select id="filter" class="select" name="filter" style="width:150px; padding-left: 5px;" v-model="searchType">
            <option value="name" selected="selected">Название</option>
            <option value="type">Тип услуги</option>
          </select>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px">
            <table class="table table-striped w-100" id="myTable">
              <thead>
                <tr>
                  <th scope="col" style="font-size: 15px;">ID</th>
                  <th scope="col" style="font-size: 15px;">Никнейм</th>
                  <th scope="col" style="font-size: 15px;">Почта</th>
                  <th scope="col" style="font-size: 15px;">Создан</th>
                  <th scope="col" style="font-size: 15px;">На счету (&#8381;)</th>
                  <th scope="col" style="font-size: 15px;">Роль</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ad in ads" :key="ad.id" @click="showDialog">
                  <td>{{ad.id}}</td>
                  <td>{{ ad.title }}</td>
                  <td>{{ ad.category }}</td>
                  <td>{{ formatDate(ad.createdAt) }}</td>
                  <td>{{ ad.price }}</td>
                  <td style="white-space: wrap;">вмвв</td>
                </tr>
                <!-- Остальные строки -->
              </tbody>
            </table>
          </div>
        </div>
  
        <div class="col-md-5">
          <h1 class="head">Модераторы:</h1>
          <div style="margin: 10px 0 12px 0">
            <input id="all" type="button" class="btn custom-btn" value="Все"></input>
            <input id="active" type="button" class="btn custom-btn" value="Активно"></input>
            <input id="finished" type="button" class="btn custom-btn" value="Завершено"></input>
            <input id="declined" type="button" class="btn custom-btn" value="Отклонено"></input>
          </div>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 350px">
            <table class="table table-striped w-100" id="myTable1">
              <thead>
                <tr>
                  <th scope="col" style="font-size: 15px;">ID</th>
                  <th scope="col" style="font-size: 15px;">Никнейм</th>
                  <th scope="col" style="font-size: 15px;">Почта</th>
                  <th scope="col" style="font-size: 15px;">Создан</th>
                  <th scope="col" style="font-size: 15px;">На счету (&#8381;)</th>
                  <th scope="col" style="font-size: 15px;">Роль</th>
                </tr>
              </thead>
              <tbody >
                <tr >
                  <td>1</td>
                  <td>Услуги сантехника</td>
                  <td>Сантехника</td>
                  <td>5000.00</td>
                  <td>19.06.2004</td>
                  <td>Бла-бла...</td>
                </tr>
                <!-- Остальные строки -->
                <tr>
                  <td>2</td>
                  <td>Услуги электрика</td>
                  <td>Сантехника</td>
                  <td>10000.00</td>
                  <td>19.06.2004</td>
                  <td>Активно</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style="height: 150px;"></div>
    </main>
    <Footer />
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
import defaultImage from '@/assets/images/default.png'

export default {
  name: 'Admin',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      ads: [],
      error: '',
      apiBaseUrl: 'http://localhost:8080/api/ads',
      serverBaseUrl: 'http://localhost:8080',
      searchQuery: '',
      searchType: 'name',
      adForm: {
        title: '',
        description: '',
        price: '',
        category: '',
        photo: null,
      },
      previewImage: null,
      currentAd: { id: null, title: '', description: '', price: '', category: '', photo: '' },
      defaultImage,
    }
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchAllAds(sortBy = 'createdAt', order = 'desc', query = '', type = this.searchType) {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL(`${this.apiBaseUrl}/all`)
        url.searchParams.append('sortBy', sortBy)
        url.searchParams.append('order', order)
        if (query && type === 'name') {
          url.searchParams.append('title', query)
        } else if (query && type === 'type') {
          url.searchParams.append('category', query)
        }

        const response = await fetch(url, {
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
            photo: this.checkPhoto(ad.photo),
          }))
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
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    },
    openEditDialog(ad) {
      this.currentAd = { ...ad }
      this.adForm = {
        title: ad.title,
        description: ad.description || '',
        price: ad.price.toString(),
        category: ad.category || '',
        photo: null,
      }
      this.previewImage = this.checkPhoto(ad.photo)
      document.querySelector('#dialog').showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialog() {
      this.error = ''
      this.previewImage = null
      this.adForm = { title: '', description: '', price: '', category: '', photo: null }
      document.querySelector('#dialog').close()
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
        this.previewImage = this.checkPhoto(this.currentAd.photo)
        this.adForm.photo = null
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
      if (this.adForm.photo) formData.append('photo', this.adForm.photo)

      try {
        const response = await fetch(`${this.apiBaseUrl}/update/${this.currentAd.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          this.error = ''
          this.closeDialog()
          await this.fetchAllAds() // Обновляем список объявлений
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
          this.closeDialog()
          await this.fetchAllAds() // Обновляем список объявлений
        } else if (response.status === 403) {
          this.error = 'Доступ запрещен'
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
    search() {
      this.fetchAllAds('createdAt', 'asc', this.searchQuery, this.searchType)
    },
  },
  mounted() {
    this.fetchAllAds("createdAt", "asc")
  }
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
</style>