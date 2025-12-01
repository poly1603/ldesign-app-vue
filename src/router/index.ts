/**
 * 路由配置
 *
 * 路由元信息说明：
 * - title: 页面标题
 * - requiresAuth: 是否需要认证（默认 true）
 * - permissions: 需要的权限列表
 * - roles: 需要的角色列表
 */

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
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
    meta: { title: '缂撳瓨绠＄悊' },
  },
  {
    path: '/crypto',
    name: 'crypto',
    component: () => import('../views/CryptoDemo.vue'),
    meta: { title: '加密功能' },
  },
  {
    path: '/store',
    name: 'store',
    component: () => import('../views/StoreDemo.vue'),
    meta: { title: '状态管理' },
  },
  {
    path: '/dependencies',
    name: 'dependencies',
    component: () => import('../views/DependencyManagement.vue'),
    meta: { title: '依赖管理' },
  },
  {
    path: '/logger',
    name: 'logger',
    component: () => import('../views/Logger.vue'),
    meta: { title: '日志系统' },
  },
  {
    path: '/notification',
    name: 'notification',
    component: () => import('../views/NotificationDemo.vue'),
    meta: { title: '通知系统' },
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('../views/LayoutDemo.vue'),
    meta: { title: '布局系统' },
  },
]
