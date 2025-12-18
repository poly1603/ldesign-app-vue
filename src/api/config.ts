/**
 * API 配置
 *
 * 定义应用的服务器和 API 接口
 */

import {
  defineRestfulServer,
  defineLeapServer,
  defineRestfulApi,
  defineLeapApi,
  createCrudApis,
} from '@ldesign/api-vue'

// ============================================================================
// 服务器配置
// ============================================================================

/**
 * JSONPlaceholder RESTful API 服务器
 */
export const jsonApiServer = defineRestfulServer(
  'jsonApi',
  import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }
)

/**
 * LPOM LEAP 服务器（办公自动化系统）
 *
 * 用于调用 LEAP RPC 接口
 */
export const lpomServer = defineLeapServer(
  'lpom',
  import.meta.env.VITE_LEAP_BASE_URL || 'https://pm.longrise.cn',
  {
    timeout: 30000,
    leap: {
      systemPrefix: '/LPOM',
      rpcPath: '/LEAP/Service/RPC/RPC.DO',
      sysName: 'longriseOA',
      sysArea: 42,
      defaultService: 'leap',
      // 从 sessionStorage 获取会话信息
      getSid: () => sessionStorage.getItem('LSID') || '',
      getLid: () => sessionStorage.getItem('Lid') || '',
    },
  }
)

/**
 * LROA LEAP 服务器（审批系统）
 */
export const lroaServer = defineLeapServer(
  'lroa',
  import.meta.env.VITE_LEAP_BASE_URL || 'https://pm.longrise.cn',
  {
    timeout: 30000,
    leap: {
      systemPrefix: '/LROA',
      sysName: 'approval',
      sysArea: 42,
      getSid: () => sessionStorage.getItem('LSID') || '',
      getLid: () => sessionStorage.getItem('Lid') || '',
    },
  }
)

/**
 * 所有服务器列表
 */
export const servers = [jsonApiServer, lpomServer, lroaServer]

// ============================================================================
// RESTful API 定义
// ============================================================================

/**
 * 用户接口类型
 */
export interface User {
  id: number
  name: string
  username: string
  email: string
  phone?: string
  website?: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

/**
 * 文章接口类型
 */
export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

/**
 * 用户 CRUD API
 */
export const userApis = createCrudApis<User>('jsonApi', 'user', '/users')

/**
 * 文章 CRUD API
 */
export const postApis = createCrudApis<Post>('jsonApi', 'post', '/posts')

/**
 * 获取用户文章 API
 */
export const getUserPostsApi = defineRestfulApi<{ userId: number }, Post[]>(
  'jsonApi',
  'getUserPosts',
  'GET',
  '/users/:userId/posts'
)
  .describe('获取用户的所有文章')
  .pathParams('userId')
  .build()

// ============================================================================
// LEAP API 定义
// ============================================================================

/**
 * 工作日数据类型
 */
export interface MonthWorkdayData {
  days: number[]
  workdays: number
  holidays: string[]
}

/**
 * 获取月工作日 API
 */
export const getMonthWorkdayApi = defineLeapApi<
  { month: string; u?: number; i?: number },
  MonthWorkdayData
>('lpom', 'getMonthWorkday', 'loap_monthworkday')
  .describe('获取指定月份的工作日信息')
  .build()

/**
 * 用户信息类型
 */
export interface LeapUserInfo {
  userId: string
  userName: string
  deptId: string
  deptName: string
  roles: string[]
}

/**
 * 获取当前用户信息 API
 */
export const getCurrentUserApi = defineLeapApi<void, LeapUserInfo>(
  'lpom',
  'getCurrentUser',
  'app_getCurrentUser'
)
  .describe('获取当前登录用户信息')
  .build()

/**
 * 模块操作列表类型
 */
export interface ModuleOperation {
  id: string
  name: string
  code: string
  enabled: boolean
}

/**
 * 获取模块操作列表 API
 */
export const getModuleOperationsApi = defineLeapApi<
  { n: string; g?: boolean; r?: boolean },
  ModuleOperation[]
>('lpom', 'getModuleOperations', 'app_getLogicModuleOperations')
  .describe('获取逻辑模块的操作列表')
  .build()

// ============================================================================
// 导出所有 API
// ============================================================================

export const apis = [
  // RESTful APIs
  userApis.list,
  userApis.get,
  userApis.create,
  userApis.update,
  userApis.delete,
  postApis.list,
  postApis.get,
  postApis.create,
  postApis.update,
  postApis.delete,
  getUserPostsApi,
  // LEAP APIs
  getMonthWorkdayApi,
  getCurrentUserApi,
  getModuleOperationsApi,
]
