/**
 * 认证插件配置
 *
 * 提供用户认证、Token 管理、权限验证等功能
 * 集成 LEAP 系统 (SZWSLD) 认证接口
 *
 * @module plugins/auth
 */

import { definePlugin } from '@ldesign/engine-vue3'
import { createAuthPlugin } from '@ldesign/auth-vue'
import {
  loginByPassword,
  fetchUserInfo,
  logout,
  isLoggedIn,
  clearSession,
  getSid,
  type LoginParams,
  type UserInfo,
} from '../api/leap/auth'

/**
 * 创建认证插件
 *
 * 功能：
 * - 用户登录/登出（集成 LEAP 系统）
 * - Session 管理
 * - 路由守卫
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

    // 登录处理器 - 集成 LEAP 系统
    onLogin: async (credentials) => {
      console.log('[Auth] LEAP 登录请求:', credentials.username)

      try {
        const result = await loginByPassword({
          username: credentials.username,
          password: credentials.password,
          captcha: (credentials as any).captcha || '',
        })

        if (result.type === 'success') {
          // 获取用户信息
          const userInfo = await fetchUserInfo()

          return {
            success: true,
            user: {
              id: userInfo?.userid || '',
              username: userInfo?.detail?.name || credentials.username,
              nickname: userInfo?.fullName || userInfo?.detail?.fullname || '',
              email: '',
              avatar: userInfo?.photo || userInfo?.detail?.photo || '',
              roles: userInfo?.roles?.map(r => r.name || '') || [],
              permissions: [],
              // 保存原始用户信息
              _raw: userInfo,
            },
            token: {
              accessToken: getSid(),
              refreshToken: '',
              expiresIn: 86400, // LEAP 系统 session 通常持续更长
            },
          }
        }

        return {
          success: false,
          error: {
            code: result.code,
            message: result.message,
          },
        }
      } catch (e) {
        console.error('[Auth] 登录错误:', e)
        return {
          success: false,
          error: {
            code: 'LOGIN_ERROR',
            message: '登录失败，请重试',
          },
        }
      }
    },

    // 刷新 Token 处理器 - LEAP 系统使用 session，不需要刷新 token
    onRefreshToken: async () => {
      // LEAP 系统使用服务端 session，不需要刷新 token
      return {
        accessToken: getSid(),
        refreshToken: '',
        expiresIn: 86400,
      }
    },

    // 获取用户信息处理器 - 从 LEAP 系统获取
    onFetchUser: async () => {
      console.log('[Auth] 获取 LEAP 用户信息')

      if (!isLoggedIn()) {
        return null as any
      }

      try {
        const userInfo = await fetchUserInfo()

        if (userInfo && userInfo.userid) {
          return {
            id: userInfo.userid,
            username: userInfo.detail?.name || '',
            nickname: userInfo.fullName || userInfo.detail?.fullname || '',
            email: '',
            avatar: userInfo.photo || userInfo.detail?.photo || '',
            roles: userInfo.roles?.map(r => r.name || '') || [],
            permissions: [],
            _raw: userInfo,
          }
        }

        // 用户信息无效，清除 session
        clearSession()
        return null as any
      } catch (e) {
        console.error('[Auth] 获取用户信息失败:', e)
        clearSession()
        return null as any
      }
    },

  })

  return definePlugin({
    name: 'auth',
    version: '1.0.0',

    install(context) {
      console.log('[Auth Plugin] 安装中（LEAP 集成）...')
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

// 导出 LEAP 认证相关类型
export type { LoginParams, UserInfo }

