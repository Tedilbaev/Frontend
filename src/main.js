import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueEasyLightbox from 'vue-easy-lightbox'

import '@/lib/bootstrap/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@/assets/footer.css'
import '@/assets/header.css'
import '@/assets/effects.css'
import '@/assets/pageup.css'
import '@/assets/admin.css'

const app = createApp(App)
app.use(VueEasyLightbox)
app.use(createPinia())
app.use(router)
app.mount('#app')
