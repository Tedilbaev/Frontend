<template>
  <div v-if="user" class="col-md-3">
    <img
      v-if="user.avatarUrl"
      :src="checkPhoto(user.avatarUrl)"
      class="image-round margin"
      width="200"
      height="200"
      alt="Аватар"
      @click="showLightbox(user.avatarUrl)"
      style="cursor: pointer"
    />
    <img
      v-else
      :src="defaultImage"
      class="image-round margin"
      width="200"
      height="200"
      alt="Аватар по умолчанию"
      @click="showLightbox(defaultImage)"
    />
    <h5>{{ user.username }}</h5>
    <h3 class="head">Действия:</h3>
    <p>
      <button
        @click="$router.push('/myads')"
        type="button"
        class="btn l-button"
        :class="{ 'active-button': this.$route.path === '/myads' }"
      >
        Мои объявления
      </button>
    </p>
    <p>
      <button
        @click="$router.push('/myorder')"
        type="button"
        class="btn l-button"
        :class="{ 'active-button': this.$route.path === '/myorder' }"
      >
        Мои заказы
      </button>
    </p>
    <p>
      <button
        @click="$router.push('/allads')"
        type="button"
        class="btn l-button"
        :class="{ 'active-button': this.$route.path === '/allads' }"
      >
        Все объявления
      </button>
    </p>
    <p>
      <button
        @click="$router.push('/wallet')"
        type="button"
        class="btn l-button"
        :class="{ 'active-button': this.$route.path === '/wallet' }"
      >
        Кошелек
      </button>
    </p>
    <p>
      <button
        @click="$router.push('/account')"
        type="button"
        class="btn l-button"
        :class="{ 'active-button': this.$route.path === '/account' }"
      >
        Аккаунт
      </button>
    </p>
    <p>
      <button
        @click="handleLogout"
        type="button"
        class="btn l-button"
        style="color: #f2f2f2; background-color: #d9534f"
      >
        Выйти
      </button>
    </p>
    <VueEasyLightbox
      :visible="lightboxVisible"
      :imgs="[currentImage]"
      :index="0"
      @hide="lightboxVisible = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
import defaultImage from '@/assets/images/default.png'

export default {
  data() {
    return {
      lightboxVisible: false,
      currentImage: '',
      defaultImage: defaultImage,
      serverBaseUrl: 'http://localhost:8080',
    }
  },
  name: 'User',
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    },
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
  },
}
</script>

<style scoped>
.active-button {
  color: #f2f2f2 !important;
  background-color: #2b8025 !important;
}
</style>
