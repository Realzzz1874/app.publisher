import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { UserStore } from '@/store/module/user'

const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/Auth.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '/team/:teamId',
        name: 'teamDetail',
        component: () => import('../components/apps/TeamDetail.vue'),
        props: true
      },
      {
        path: '/team/:teamId/app/:appId',
        name: 'appDetail',
        component: () => import('../components/apps/AppDetail.vue'),
        props: true
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...staticRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach(async (to, from, next) => {
  const userStore = UserStore()

  // 访问登录页，如果有 token，则停留在当前页
  if (to.path === '/auth') {
    if (userStore.token) return next(from.fullPath)
    return next()
  }

  // 判断有无 token
  if (!userStore.token) return next({ path: '/auth', replace: true })

  // 正常
  return next()
})

export default router
