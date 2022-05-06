import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { allCases } from '@/views/cases'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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

router.beforeEach((_, __, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
