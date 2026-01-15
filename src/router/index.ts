/**
 * 路由配置
 * 本地工作空间路由 + 动态路由支持
 */

export const routes = [
  // ============ 基础路由 ============
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeEntry.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },

  // ============ 404 ============
  {
    path: '/404',
    name: 'NotFoundPage',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面不存在', requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面不存在' },
  },
]
