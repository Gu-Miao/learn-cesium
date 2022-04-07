import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

window.CESIUM_BASE_URL = import.meta.env.BASE_URL

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
