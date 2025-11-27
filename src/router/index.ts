/**
 * 路由配置
 */

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/theme',
    name: 'theme',
    component: () => import('../views/Theme.vue'),
    meta: { title: '主题管理' },
  },
  {
    path: '/size',
    name: 'size',
    component: () => import('../views/Size.vue'),
    meta: { title: '尺寸管理' },
  },
  {
    path: '/http',
    name: 'http',
    component: () => import('../views/Http.vue'),
    meta: { title: 'HTTP 请求' },
  },
  {
    path: '/device',
    name: 'device',
    component: () => import('../views/Device.vue'),
    meta: { title: '设备信息' },
  },
  {
    path: '/cache',
    name: 'cache',
    component: () => import('../views/Cache.vue'),
    meta: { title: '缓存管理' },
  },
]
