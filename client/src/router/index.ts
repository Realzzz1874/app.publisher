import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/teams'
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('../views/Main.vue'),
      children: [
        {
          path: '/team/:teamId',
          name: 'teamDetail',
          component: () => import('../components/apps/TeamDetail.vue'),
          props: true
        },
        {
          path: '/about',
          name: 'teamAbout',
          component: () => import('../views/AboutView.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/Auth.vue')
    },
    // for test
    {
      path: '/test',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
