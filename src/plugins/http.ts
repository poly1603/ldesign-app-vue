/**
 * HTTP 请求插件配置
 */
import { createHttpEnginePlugin } from '@ldesign/http-vue'
import httpClient from '../api/http'

/**
 * 创建 HTTP 请求插件
 */
export function createHttpPlugin() {
  return createHttpEnginePlugin({
    client: httpClient,
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
  })
}

