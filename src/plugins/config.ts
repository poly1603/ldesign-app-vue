/**
 * 应用配置插件
 *
 * 提供集中式应用配置管理：
 * - 统一管理应用级配置项
 * - 支持远程配置加载和轮询更新
 * - 配置变更事件通知
 * - 点号路径读写
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { ConfigManager } from '@ldesign/config-core'
import { createConfigPlugin } from '@ldesign/config-vue'

/**
 * 应用默认配置
 */
const defaultConfig = {
  app: {
    name: 'LDesign App',
    version: '1.0.0',
    description: 'LDesign 企业级后台管理系统',
  },
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 10000,
    retryCount: 3,
  },
  ui: {
    sidebarCollapsed: false,
    showFooter: false,
    showTabs: false,
    animationDuration: 300,
    pageSize: 20,
  },
  feature: {
    enableWebSocket: true,
    enableTracker: true,
    enableErrorReport: true,
    enablePerformanceMonitor: false,
  },
}

/**
 * 创建应用配置引擎插件
 */
export function createConfigEnginePlugin() {
  return definePlugin({
    name: 'config',
    version: '1.0.0',

    async install(context) {
      const { app } = context as any
      if (!app) return

      // 创建配置管理器
      const configPlugin = createConfigPlugin({
        initial: defaultConfig,
        separator: '.',
      })

      app.use(configPlugin)

      if (import.meta.env.DEV) {
        console.log('[Config Plugin] 应用配置已初始化', {
          keys: Object.keys(defaultConfig),
        })
      }
    },
  })
}

// 导出默认配置，方便类型引用
export type AppConfig = typeof defaultConfig
