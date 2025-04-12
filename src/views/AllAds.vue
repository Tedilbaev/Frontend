<template>
  <Header />
  <main>
    <div class="container" id="app">
      <div class="row">
        <User />

        <div class="col-md-9">
          <h1 class="head">Все объявления:</h1>
          <label for="city">Введите город поиска</label>
          <p>
            <input
              type="text"
              class="custom-text"
              id="city"
              name="city"
              placeholder="Например: Астрахань"
            />
          </p>
          <div class="create-line"></div>
          <form style="height: 30px">
            <p class="head" style="font-weight: bold">
              Cортировка:
              <button type="button" class="btn custom-btn">Без сортировки</button>
              <button type="button" class="btn custom-btn">А-Я</button>
              <button type="button" class="btn custom-btn">Я-А</button>
              <input
                type="text"
                class="custom-text"
                placeholder="Поиск"
                style="margin-left: 15px"
              />
              <button type="button" class="btn custom-btn">Искать</button>
            </p>
          </form>
          <div class="table-order">
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo2.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги сантехника</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: Сантехника, Электроника, Лабы недорого</p>
                  <p>Цена: 500.00 рублей</p>
                  <p>Дата объявления: 16.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo4.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo5.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo6.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
            <div class="order" style="position: relative">
              <img src="@/assets/images/photo3.jpg" class="image-order" width="410" height="410" />
              <div class="order-info">
                <h5 class="text-center" style="margin: 0 auto">Услуги электрика</h5>
                <p style="margin: 0 0 0 0">Город: Астрахань</p>
                <div id="text-order">
                  <p>Тип услуги: да, нет, посмотрим, не знаю</p>
                  <p>Цена: 50000.00 рублей</p>
                  <p>Дата объявления: 18.03.2025</p>
                  <p>Статус: Не выполнено</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

export default {
  name: 'AllAds',
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
  },
  mounted() {
    this.fetchUserProfile()
  },
}
</script>
