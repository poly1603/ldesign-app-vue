/**
 * API 管理插件配置
 *
 * 将 @ldesign/api-vue 集成到引擎插件体系中，预注册服务器和 API 定义，
 * 并复用应用级 HTTP 客户端（src/api/http.ts）。
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { createApiPlugin } from '@ldesign/api-vue'
import { servers, apis } from '../api'
import httpClient from '../api/http'

/**
 * 创建 API 引擎插件
 */
export function createApiEnginePlugin() {
  return definePlugin({
    name: 'api',
    version: '1.0.0',
    install(context) {
      const { app } = context as any
      if (!app)
        return

      app.use(createApiPlugin({
        servers,
        apis,
        // 使用统一的 HTTP 客户端，避免 ApiManager 再创建一套独立客户端
        httpClientFactory: async () => httpClient,
      }))
    },
  })
}
