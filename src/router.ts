import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { allCases } from '@/views/cases'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('./views/Error.vue')
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    ...allCases
  ]
})

export default router
