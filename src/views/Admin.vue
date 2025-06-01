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
                  <option v-for="cat in category" :key="cat.id" v-value="cat.name">{{ cat.name}}</option>
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

    <div class="holder" style="overflow-y: hidden">
      <dialog class="delpopup" style="overflow-y: hidden" id="deleting">
        <div class="content" style="overflow-y: hidden">
          <h1 style="text-align: center">Удалить категорию</h1>
          <div class="text-center">
            <p style="font-size: 25px; text-align: left">
              Вы уверены, что хотите удалить категорию? После удаления вернуть его будет
              невозможно!
            </p>
            <button type="button" class="btn custom-btn" @click="deleteCategory(currentCategoryId)">
              Удалить категорию
            </button>
            <button type="button" class="btn custom-btn" @click="closeDialogDelete('#deleting')">
              Отмена
            </button>
          </div>
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
        <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px; overflow-x: hidden;" ref="adsTable">
          <table class="table table-striped w-100" id="adsTable">
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
              <tr v-for="(ad, index) in ads" :key="ad.id" @click="openEditDialog(ad)">
                <td>{{ index + 1 }}</td>
                <td>{{ ad.title }}</td>
                <td>{{ ad.category }}</td>
                <td>{{ ad.price }}</td>
                <td>{{ formatDate(ad.createdAt) }}</td>
                <td style="white-space: wrap;">{{ ad.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center" style="margin-top: 15px;" v-if="isLoading">
          <p>Загрузка...</p>
        </div>
      </div>
  
        <div class="col-md-5">
          <h1 class="head">Заказы:</h1>
          <div style="margin: 10px 0 12px 0">
            <input id="all" type="button" class="btn custom-btn" value="Все" @click="filterOrders('all')"></input>
            <input id="active" type="button" class="btn custom-btn" value="Активно" @click="filterOrders('Активно')"></input>
            <input id="finished" type="button" class="btn custom-btn" value="Завершено" @click="filterOrders('Завершено')"></input>
            <input id="declined" type="button" class="btn custom-btn" value="Отклонено" @click="filterOrders('Отклонено')"></input>
          </div>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px" ref="ordersTable">
            <table class="table table-striped w-100" id="ordersTable">
              <thead>
                <tr>
                  <th scope="col" style="font-size: 15px;">№</th>
                  <th scope="col" style="font-size: 15px;">Исполнитель</th>
                  <th scope="col" style="font-size: 15px;">Заказчик</th>
                  <th scope="col" style="font-size: 15px;">Сумма (&#8381;)</th>
                  <th scope="col" style="font-size: 15px;">Дата</th>
                  <th scope="col" style="font-size: 15px;">Статус</th>
                </tr>
              </thead>
              <tbody >
                <tr v-for="(order, index) in orders" :key="order.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ order.performer.username }}</td>
                  <td>{{ order.client.username }}</td>
                  <td>{{ order.ad.price }}</td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td >{{ order.status }}</td>
                </tr>
                <!-- Остальные строки -->
              </tbody>
            </table>
          </div>
          <div class="text-center" style="margin-top: 15px;" v-if="isLoadingOrders">
            <p>Загрузка...</p>
          </div>
        </div>
      
      <div class="row" style="display: flex; justify-content: center;">
        <div v-if="user?.role === 'ADMIN'" class="col-md-5">
          <h1 class="head">Пользователи:</h1>
          <input class="custom-text" type="text" id="myInput" style="margin: 10px 0 15px 0" onkeyup="finding()" placeholder="Поиск по никнейму или почте" v-model="userSearchQuery" @input="searchUser">
          <select id="filter" class="select" name="filter" style="width:150px; padding-left: 5px;" v-model="userSearchType">
            <option value="username" selected="selected">Никнейм</option>
            <option value="email">Почта</option>
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
                <tr v-for="(user, index) in users" :key="user.id" @click="showDialog">
                  <td>{{ index + 1}}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>{{ user.balance || '0.00' }}</td>
                  <td style="white-space: wrap;"> {{ user.role }}</td>
                </tr>
                <!-- Остальные строки -->
              </tbody>
            </table>
          </div>
        </div>
  
        <div v-if="user?.role === 'ADMIN'" class="col-md-5">
          <h1 class="head">Модераторы:</h1>
          <input class="custom-text" type="text" id="myInput" style="margin: 10px 0 15px 0" onkeyup="finding()" placeholder="Поиск по никнейму или почте" v-model="moderSearchQuery" @input="searchModer">
          <select id="filter" class="select" name="filter" style="width:150px; padding-left: 5px;" v-model="moderSearchType">
            <option value="username" selected="selected">Никнейм</option>
            <option value="email">Почта</option>
          </select>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px">
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
                <tr v-for="(moder, index) in moders" :key="moder.id" @click="showDialog">
                  <td>{{ index + 1}}</td>
                  <td>{{ moder.username }}</td>
                  <td>{{ moder.email }}</td>
                  <td>{{ formatDate(moder.createdAt) }}</td>
                  <td>{{ moder.balance || '0.00' }}</td>
                  <td style="white-space: wrap;"> {{ moder.role }}</td>
                </tr>
                <!-- Остальные строки -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row" style="display: flex; justify-content: center;">
        <div v-if="user?.role === 'ADMIN'" class="col-md-5">
          <h1 class="head">Категории услуг:</h1>
          <input class="custom-text" type="text" id="myInput" style="margin: 10px 0 15px 0" placeholder="Поиск по названию" v-model="categorySearchQuery" @input="searchCategory">
          <button type="button" class="btn custom-btn" style="height: 35px;" @click="createСategory">Создать категорию</button>
          <div class="table-responsive table-scroll mb-0 styling" data-mdb-perfect-scrollbar="true" style="position: relative; height: 550px">
            <table class="table table-striped w-100" id="myTable">
              <thead>
                <tr>
                  <th scope="col" style="font-size: 15px;">ID</th>
                  <th scope="col" style="font-size: 15px;">Название услуги</th>
                  <th scope="col" style="font-size: 15px;">Создан</th>
                  <!-- <th scope="col" style="font-size: 15px;">На счету (&#8381;)</th>
                  <th scope="col" style="font-size: 15px;">Роль</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cat, index) in category" :key="cat.id" @click="showDialogDelete('#deleting', cat.id)">
                  <td>{{ index + 1 }}</td>
                  <td>{{ cat.name }}</td>
                  <td>{{ formatDate(cat.createdAt) }}</td>
                </tr>
                <!-- Остальные строки -->
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <div style="height: 150px;"></div>
    </div>
    </main>
    <Footer />
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { mapActions, mapState } from 'pinia'
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
      users: [], 
      userSearchQuery: '',
      userSearchType: 'username',
      moders: [], 
      moderSearchQuery: '',
      moderSearchType: 'username',
      category: [],
      categorySearchQuery: '',
      currentCategoryId: null,
      orders: [],
      orderSearchTitle: '',
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
      currentPage: 0,
      totalPages: 0,
      pageSize: 15,
      currentSortBy: 'createdAt',
      currentOrder: 'asc',
      isLoading: false,
      currentPageOrders: 0,
      totalPagesOrders: 0,
      pageSizeOrders: 15,
      currentSortByOrders: 'createdAt',
      currentOrderOrders: 'asc',
      isLoadingOrders: false,
      orderStatusFilter: 'all',
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['fetchUserProfile']),
    async fetchAllAds(sortBy = this.currentSortBy, order = this.currentOrder, query = '', type = this.searchType, page = this.currentPage) {
      if (this.isLoading) return
      this.isLoading = true
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        this.isLoading = false
        return
      }
      try {
        const url = new URL(`${this.apiBaseUrl}/all`)
        url.searchParams.append('sortBy', sortBy)
        url.searchParams.append('order', order)
        url.searchParams.append('page', page)
        url.searchParams.append('size', this.pageSize)
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
          const data = await response.json()
          this.totalPages = data.totalPages
          if (page === 0) {
            this.ads = data.content
          } else {
            this.ads = [...this.ads, ...data.content]
          }
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
      } finally {
        this.isLoading = false
      }
    },
    async fetchAllUsers(sortBy = 'createdAt', order = 'desc', query = '', type = this.userSearchType) {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL('http://localhost:8080/api/user/all')
        url.searchParams.append('sortBy', sortBy)
        url.searchParams.append('order', order)
        if (query && type === 'username') {
          url.searchParams.append('username', query)
        } else if (query && type === 'email') {
          url.searchParams.append('email', query)
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.users = await response.json()
          this.users = this.users.map((user) => ({
            ...user,
            photo: this.checkPhoto(user.avatarUrl),
          }))
        } else if (response.status === 401 || response.status === 403) {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          this.$router.push('/login')
        } else {
          this.error = 'Ошибка загрузки пользователей: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
      }
    },
    async fetchAllModers(sortBy = 'createdAt', order = 'desc', query = '', type = this.moderSearchType) {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const url = new URL('http://localhost:8080/api/user/moder')
        url.searchParams.append('sortBy', sortBy)
        url.searchParams.append('order', order)
        if (query && type === 'username') {
          url.searchParams.append('username', query)
        } else if (query && type === 'email') {
          url.searchParams.append('email', query)
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.moders = await response.json()
          this.moders = this.moders.map((moder) => ({
            ...moder,
            photo: this.checkPhoto(moder.avatarUrl),
          }))
        } else if (response.status === 401 || response.status === 403) {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          this.$router.push('/login')
        } else {
          this.error = 'Ошибка загрузки пользователей: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
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
    async fetchAllOrders(sortBy = this.currentSortByOrders, order = this.currentOrderOrders, title = this.orderSearchTitle, page = this.currentPageOrders) {
      if (this.isLoadingOrders) return
      this.isLoadingOrders = true
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        this.isLoadingOrders = false
        return
      }
      try {
        const url = new URL(`http://localhost:8080/api/orders/all`)
        url.searchParams.append('sortBy', sortBy)
        url.searchParams.append('order', order)
        url.searchParams.append('page', page)
        url.searchParams.append('size', this.pageSizeOrders)
        if (title) {
          url.searchParams.append('title', title)
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          this.totalPagesOrders = data.totalPages
          let orders = data.content
          if (this.orderStatusFilter !== 'all') {
            orders = orders.filter(order => order.status === this.orderStatusFilter)
          }
          if (page === 0) {
            this.orders = orders
          } else {
            this.orders = [...this.orders, ...orders]
          }
          this.orders = this.orders.map((order) => ({
            ...order,
            photo: this.checkPhoto(order.ad?.photo),
          }))
        } else if (response.status === 401 || response.status === 403) {
          this.error = 'Сессия истекла или доступ запрещен'
          localStorage.removeItem('jwt')
          this.$router.push('/login')
        } else {
          this.error = 'Ошибка загрузки заказов: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера'
        console.error('Исключение:', e)
      } finally {
        this.isLoadingOrders = false
      }
    },
    async createСategory() {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      const formData = new FormData()
      formData.append('name', this.categorySearchQuery)
      try {
        const response = await fetch(`http://localhost:8080/api/category/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        if (response.ok) {
          const category = await response.json()
          this.categorySearchQuery = '';
          this.fetchAllCategory('createdAt', 'asc')
        } else {
          const errorText = await response.text()
          this.error = 'Ошибка создания категории: ' + response.status + ' - ' + errorText
          console.error('Ошибка сервера:', errorText)
        }
      } catch (e) {
        this.error = 'Ошибка сервера при создании объявления'
        console.error('Исключение:', e)
      }
    },
    async deleteCategory(CategoryId) {
      const token = localStorage.getItem('jwt')
      if (!token) {
        this.error = 'Вы не авторизованы'
        this.$router.push('/login')
        return
      }
      try {
        const response = await fetch(`http://localhost:8080/api/category/delete/${CategoryId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          this.error = ''
          this.closeDialogDelete('#deleting')
          await this.fetchAllCategory() // Обновляем список объявлений
        } else if (response.status === 403) {
          this.error = 'Доступ запрещен'
        } else if (response.status === 404) {
          this.error = 'Категория не найдена'
        } else {
          this.error = 'Ошибка удаления категории: ' + response.status
        }
      } catch (e) {
        this.error = 'Ошибка сервера при удалении категории'
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
    showDialogDelete(dialogwindow, id) {
      this.currentCategoryId = id
      document.querySelector(dialogwindow).showModal()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    closeDialogDelete(dialogwindow) {
      this.error = ''
      this.previewImage = null
      this.currentCategoryId = null
      document.querySelector(dialogwindow).close()
    },
    search() {
      this.currentPage = 0
      this.fetchAllAds(this.currentSortBy, this.currentOrder, this.searchQuery, this.searchType, 0)
    },
    searchUser() {
      this.fetchAllUsers('createdAt', 'asc', this.userSearchQuery, this.userSearchType)
    },
    searchModer() {
      this.fetchAllModers('createdAt', 'asc', this.moderSearchQuery, this.moderSearchType)
    },
    searchCategory() {
      this.fetchAllCategory('createdAt', 'asc', this.categorySearchQuery)
    },
    filterOrders(status) {
      this.orderStatusFilter = status
      this.currentPageOrders = 0
      this.fetchAllOrders(this.currentSortByOrders, this.currentOrderOrders, this.orderSearchTitle, 0)
    },
    loadMore() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        this.fetchAllAds(this.currentSortBy, this.currentOrder, this.searchQuery, this.searchType, this.currentPage)
      }
    },
    loadMoreOrders() {
      if (this.currentPageOrders < this.totalPagesOrders - 1) {
        this.currentPageOrders++
        this.fetchAllOrders(this.currentSortByOrders, this.currentOrderOrders, this.orderSearchTitle, this.currentPageOrders)
      }
    },
  },
  mounted() {
    this.fetchAllAds("createdAt", "asc")
    this.fetchAllUsers('createdAt', 'asc')
    this.fetchAllModers('createdAt', 'asc')
    this.fetchAllCategory('createdAt', 'asc')
    this.fetchAllOrders('createdAt', 'asc')
    this.fetchUserProfile()

    const adsTable = this.$refs.adsTable
    if (adsTable) {
      let isScrolling = false
      adsTable.addEventListener('scroll', () => {
        if (isScrolling) return
        isScrolling = true
        const scrollPosition = adsTable.scrollTop + adsTable.clientHeight
        const tableHeight = adsTable.scrollHeight
        const threshold = 50
        if (
          scrollPosition >= tableHeight - threshold &&
          !this.isLoading &&
          this.currentPage < this.totalPages - 1
        ) {
          this.loadMore()
        }
        setTimeout(() => {
          isScrolling = false
        }, 200)
      })
    }

    const ordersTable = this.$refs.ordersTable
    if (ordersTable) {
      let isScrollingOrders = false
      ordersTable.addEventListener('scroll', () => {
        if (isScrollingOrders) return
        isScrollingOrders = true
        const scrollPosition = ordersTable.scrollTop + ordersTable.clientHeight
        const tableHeight = ordersTable.scrollHeight
        const threshold = 400
        if (
          scrollPosition >= tableHeight - threshold &&
          !this.isLoadingOrders &&
          this.currentPageOrders < this.totalPagesOrders - 1
        ) {
          this.loadMoreOrders()
        }
        setTimeout(() => {
          isScrollingOrders = false
        }, 200)
      })
    }
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