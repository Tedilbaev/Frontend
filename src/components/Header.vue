<template>
  <header>
    <div id="main" class="duplicate">
      <ul class="nav">
        <div
          style="
            font-family: 'Brush Script MT', cursive;
            color: white;
            font-size: 36px;
            align-self: left;
            border-right: 2px solid white;
            border-radius: 20px;
            padding-right: 15px;
          "
        >
          SafeDeal
        </div>
        <li>
          <router-link to="/myads" title="MyAds">
            <span class="text">Мои объявления</span>
          </router-link>
        </li>
        <li>
          <router-link to="/myorder" title="MyOrders">
            <span class="text">Мои заказы</span>
          </router-link>
        </li>
        <li>
          <router-link to="/allads" title="AllAds">
            <span class="text">Все объявления</span>
          </router-link>
        </li>
        <li>
          <router-link to="/wallet" title="Wallet">
            <span class="text">Кошелек</span>
          </router-link>
        </li>
        <li>
          <router-link to="/account" title="Account">
            <span class="text">Аккаунт</span>
          </router-link>
        </li>
        <li v-if="user?.role === 'ADMIN' || user?.role === 'MODER'">
          <router-link to="/admin" title="Admin">
            <span class="text">Админ-панель</span>
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Header',
  computed: {
    ...mapState(useUserStore, ['user']),
  },
}
</script>
