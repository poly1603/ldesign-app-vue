/**
 * 权限插件配置
 */
import { createPermissionEnginePlugin } from '@ldesign/permission-vue'
import { useAuth } from '../composables/useAuth'

/**
 * 创建权限插件
 */
export function createPermissionPlugin() {
  return createPermissionEnginePlugin({
    // 超级管理员角色
    superRole: 'super_admin',
    // 超级权限标识
    superPermission: '*',
    // 启用缓存
    enableCache: true,
    // 缓存过期时间（5分钟）
    cacheTTL: 300000,
    // 缓存大小限制
    cacheMaxSize: 500,

    // 预定义角色
    roles: [
      {
        id: 'super_admin',
        name: '超级管理员',
        description: '拥有所有权限',
        permissions: ['*'],
        isSuper: true,
      },
      {
        id: 'admin',
        name: '管理员',
        description: '系统管理员',
        permissions: [
          'user:*',
          'role:*',
          'system:read',
          'system:config',
        ],
        inherits: [],
      },
      {
        id: 'editor',
        name: '编辑者',
        description: '内容编辑人员',
        permissions: [
          'article:read',
          'article:create',
          'article:update',
          'media:read',
          'media:upload',
        ],
        inherits: [],
      },
      {
        id: 'viewer',
        name: '访客',
        description: '只读访问',
        permissions: [
          'article:read',
          'media:read',
        ],
        inherits: [],
      },
    ],

    // 权限数据提供者（从认证系统获取）
    permissionProvider: () => {
      const auth = useAuth()
      const info = auth.userInfo.value
      // 从用户信息中提取权限列表
      if (!info) return []
      return (info as any).permissions ?? (info as any).perms ?? []
    },

    // 角色数据提供者（从认证系统获取）
    roleProvider: () => {
      const auth = useAuth()
      const info = auth.userInfo.value
      // 从用户信息中提取角色列表
      if (!info) return []
      return (info as any).roles ?? (info as any).role ? [(info as any).role] : []
    },

    // 是否设置路由守卫
    setupRouterGuard: true,
    // 未授权重定向路由
    unauthorizedRoute: '/403',
    // 登录页路由
    loginRoute: '/login',
    // 白名单路由
    whiteList: [
      '/login',
      '/register',
      '/forgot-password',
      '/404',
      '/403',
      '/500',
    ],
  })
}

