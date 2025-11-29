/**
 * 认证插件配置
 *
 * 提供用户认证、Token 管理、权限验证等功能
 *
 * @module plugins/auth
 */

import { definePlugin } from '@ldesign/engine-vue3'
import { createAuthPlugin } from '@ldesign/auth-vue'

/**
 * 创建认证插件
 *
 * 功能：
 * - 用户登录/登出
 * - Token 管理和自动刷新
 * - 路由守卫（可选）
 * - 权限验证
 */
export function createAuthEnginePlugin() {
  // 创建认证插件
  const authPlugin = createAuthPlugin({
    // 登录页路由
    loginRoute: '/login',
    // 登录成功后的默认路由
    defaultRoute: '/',
    // 白名单路由（不需要认证）
    whiteList: [
      '/login',
      '/register',
      '/forgot-password',
      '/404',
      '/403',
    ],
    // 是否自动配置路由守卫
    setupRouterGuard: true,

    // 登录处理器
    onLogin: async (credentials) => {
      // 模拟 API 调用
      console.log('[Auth] 登录请求:', credentials.username)

      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      // 模拟登录成功
      if (credentials.username && credentials.password) {
        return {
          success: true,
          user: {
            id: 1,
            username: credentials.username,
            nickname: credentials.username,
            email: `${credentials.username}@example.com`,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.username,
            roles: ['admin'],
            permissions: [
              'user:read',
              'user:create',
              'user:update',
              'user:delete',
              'system:read',
            ],
          },
          token: {
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            expiresIn: 3600, // 1 小时
          },
        }
      }

      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '用户名或密码错误',
        },
      }
    },

    // 刷新 Token 处理器
    onRefreshToken: async (refreshToken) => {
      console.log('[Auth] 刷新 Token:', refreshToken.substring(0, 20) + '...')

      // 模拟刷新
      await new Promise(resolve => setTimeout(resolve, 200))

      return {
        accessToken: 'mock_new_access_token_' + Date.now(),
        refreshToken: 'mock_new_refresh_token_' + Date.now(),
        expiresIn: 3600,
      }
    },

    // 获取用户信息处理器
    onFetchUser: async () => {
      console.log('[Auth] 获取用户信息')

      // 模拟获取用户信息
      return {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        email: 'admin@example.com',
        roles: ['admin'],
        permissions: ['user:read', 'user:create', 'system:read'],
      }
    },
  })

  return definePlugin({
    name: 'auth',
    version: '1.0.0',

    install(context) {
      console.log('[Auth Plugin] 安装中...')
      const { engine, app } = context

      // 监听引擎事件
      engine.events.on('engine:initialized', () => {
        console.log('[Auth Plugin] 引擎初始化完成')
      })

      // 安装 Vue 插件
      if (app) {
        app.use(authPlugin)
      }
    },
  })
}

// 导出 authPlugin 的类型
export type { AuthPluginOptions } from '@ldesign/auth-vue'

