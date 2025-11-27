/**
 * HTTP 客户端配置
 *
 * 配置全局 HTTP 客户端，包括基础 URL、拦截器、错误处理等
 */
import type { HttpClient } from '@ldesign/http-core'
// 明确从 client/factory 导入新版本的 createHttpClient
import { createHttpClient } from '@ldesign/http-core/client/factory'

/**
 * HTTP 客户端实例
 */
let _httpClient: HttpClient | null = null

/**
 * HTTP 客户端初始化 Promise
 */
let _initPromise: Promise<HttpClient> | null = null

/**
 * 获取或创建 HTTP 客户端（单例模式）
 */
async function getHttpClient(): Promise<HttpClient> {
  // 如果已经有客户端实例，直接返回
  if (_httpClient) {
    return _httpClient
  }

  // 如果正在初始化，返回初始化 Promise
  if (_initPromise) {
    return _initPromise
  }

  // 创建新的初始化 Promise
  _initPromise = (async () => {
    // 使用新版本的 createHttpClient，支持单参数调用
    const client = await createHttpClient({
      // 基础配置
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      timeout: 10000,

      // 请求头
      headers: {
        'Content-Type': 'application/json',
      },

      // 指定使用 fetch 适配器
      adapter: 'fetch',
    })

    _httpClient = client
    console.log('✅ [HTTP] Client created successfully')

    // 配置拦截器
    setupInterceptors()

    return client
  })()

  return _initPromise
}

// 立即开始初始化
getHttpClient()

/**
 * HTTP 客户端代理 - 自动等待客户端初始化
 */
const httpClient = new Proxy({} as HttpClient, {
  get(_target, prop, receiver) {
    // 直接返回一个函数，该函数会等待客户端初始化
    if (prop === 'get' || prop === 'post' || prop === 'put' || prop === 'delete' || prop === 'patch' || prop === 'request') {
      return async (...args: any[]) => {
        const client = await getHttpClient()
        const method = (client as any)[prop]
        return method.apply(client, args)
      }
    }

    // 对于其他属性，如果客户端未初始化则抛出错误
    if (!_httpClient) {
      throw new Error(`[HTTP] Client not initialized yet. Cannot access property "${String(prop)}"`)
    }

    // 直接从实际客户端获取属性
    const value = Reflect.get(_httpClient, prop, _httpClient)

    // 如果是函数，绑定到实际客户端
    if (typeof value === 'function') {
      return value.bind(_httpClient)
    }

    return value
  },

  set(_target, prop, value) {
    if (!_httpClient) {
      throw new Error(`[HTTP] Client not initialized yet. Cannot set property "${String(prop)}"`)
    }

    return Reflect.set(_httpClient, prop, value, _httpClient)
  },
})

/**
 * 配置拦截器
 */
function setupInterceptors() {
  if (!_httpClient)
    return

  /**
   * 请求拦截器 - 添加认证 token
   */
  if (_httpClient?.interceptors?.request) {
    _httpClient.interceptors.request.use(
      (config) => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }

        console.log('📤 [HTTP] Request:', config.method?.toUpperCase(), config.url)
        return config
      },
      (error) => {
        console.error('❌ [HTTP] Request error:', error)
        return Promise.reject(error)
      },
    )
  }

  /**
   * 响应拦截器 - 统一处理响应
   */
  if (_httpClient?.interceptors?.response) {
    _httpClient.interceptors.response.use(
      (response) => {
        console.log('📥 [HTTP] Response:', response.status, response.config.url)
        return response
      },
      (error) => {
        console.error('❌ [HTTP] Response error:', error)

        // 统一错误处理
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // 未授权，跳转到登录页
              console.warn('⚠️ [HTTP] Unauthorized, redirecting to login...')
              // window.location.href = '/login'
              break
            case 403:
              console.warn('⚠️ [HTTP] Forbidden')
              break
            case 404:
              console.warn('⚠️ [HTTP] Not found')
              break
            case 500:
              console.error('❌ [HTTP] Server error')
              break
            default:
              console.error('❌ [HTTP] Unknown error:', error.response.status)
          }
        }
        else if (error.request) {
          console.error('❌ [HTTP] Network error')
        }
        else {
          console.error('❌ [HTTP] Request setup error')
        }

        return Promise.reject(error)
      },
    )
  }
}

/**
 * 导出 HTTP 客户端（使用 Proxy 确保安全访问）
 */
export default httpClient
