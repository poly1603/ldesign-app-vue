/**
 * 路由配置
 * 本地工作空间路由 + 动态路由支持
 */

export const routes = [
  // ============ 基础路由 ============
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  
  // ============ 外观设置 ============
  {
    path: '/theme',
    name: 'Theme',
    component: () => import('../views/Theme.vue'),
    meta: { title: '主题管理' },
  },
  {
    path: '/size',
    name: 'Size',
    component: () => import('../views/Size.vue'),
    meta: { title: '尺寸管理' },
  },
  
  // ============ 系统功能 ============
  {
    path: '/http',
    name: 'Http',
    component: () => import('../views/Http.vue'),
    meta: { title: 'HTTP 请求' },
  },
  {
    path: '/device',
    name: 'Device',
    component: () => import('../views/Device.vue'),
    meta: { title: '设备信息' },
  },
  {
    path: '/cache',
    name: 'Cache',
    component: () => import('../views/Cache.vue'),
    meta: { title: '缓存管理' },
  },
  {
    path: '/crypto',
    name: 'Crypto',
    component: () => import('../views/CryptoDemo.vue'),
    meta: { title: '加密功能' },
  },
  {
    path: '/logger',
    name: 'Logger',
    component: () => import('../views/Logger.vue'),
    meta: { title: '日志系统' },
  },
  {
    path: '/store',
    name: 'Store',
    component: () => import('../views/StoreDemo.vue'),
    meta: { title: '状态管理' },
  },
  
  // ============ 组件展示 ============
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/MenuDemo.vue'),
    meta: { title: '菜单组件' },
  },
  {
    path: '/breadcrumb',
    name: 'Breadcrumb',
    component: () => import('../views/BreadcrumbDemo.vue'),
    meta: { title: '面包屑组件' },
  },
  {
    path: '/bookmark',
    name: 'Bookmark',
    component: () => import('../views/BookmarkDemo.vue'),
    meta: { title: '书签组件' },
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('../views/NotificationDemo.vue'),
    meta: { title: '通知组件' },
  },
  
  // ============ LEAP 接口 ============
  {
    path: '/leap',
    name: 'Leap',
    component: () => import('../views/LeapDemo.vue'),
    meta: { title: 'LEAP 接口' },
  },
  
  // ============ 404 ============
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/Home.vue'),
    meta: { title: '页面不存在' },
  },
]
