/**
 * WebSocket 插件配置
 * 
 * 提供全局 WebSocket 管理器，支持多连接管理和消息订阅/发布
 */

import { getWebSocketManager, type WebSocketManagerOptions } from '@ldesign/http-vue'
import type { App } from 'vue'

/**
 * WebSocket 插件选项
 */
export interface WebSocketPluginOptions extends WebSocketManagerOptions {
  /** 是否启用调试模式 */
  debug?: boolean
  /** 是否注册全局属性 */
  globalProperties?: boolean
}

/**
 * 创建 WebSocket 插件
 * 
 * @param options - 插件选项
 * @returns Engine 插件
 * 
 * @example
 * ```typescript
 * import { createEngine } from '@ldesign/engine-vue3'
 * import { createWebSocketPlugin } from './plugins/websocket'
 * 
 * const engine = createEngine()
 * 
 * engine.use(createWebSocketPlugin({
 *   autoCleanup: true,
 *   cleanupInterval: 60000,
 *   maxConnections: 10,
 *   debug: import.meta.env.DEV
 * }))
 * ```
 */
export function createWebSocketPlugin(options: WebSocketPluginOptions = {}) {
  const {
    debug = false,
    globalProperties = true,
    ...managerOptions
  } = options

  return {
    name: 'websocket',
    version: '1.0.0',

    /**
     * 安装插件
     */
    async install(context: { engine?: { app?: App }, app?: App }) {
      const app = context?.engine?.app || context?.app

      if (!app) {
        console.error('[WebSocketPlugin] 无法获取 Vue App 实例')
        return
      }

      // 获取全局 WebSocket 管理器实例
      const manager = getWebSocketManager(managerOptions)

      if (debug) {
        console.log('[WebSocketPlugin] WebSocket 管理器已初始化', {
          autoCleanup: managerOptions.autoCleanup,
          cleanupInterval: managerOptions.cleanupInterval,
          maxConnections: managerOptions.maxConnections,
        })
      }

      // 注册全局属性
      if (globalProperties) {
        app.config.globalProperties.$ws = manager

        if (debug) {
          console.log('[WebSocketPlugin] 全局属性 $ws 已注册')
        }
      }

      // 提供依赖注入
      app.provide('websocket-manager', manager)

      if (debug) {
        console.log('[WebSocketPlugin] WebSocket 插件安装完成')
      }
    },

    /**
     * 卸载插件
     */
    async uninstall() {
      const manager = getWebSocketManager()
      manager.destroy()

      if (debug) {
        console.log('[WebSocketPlugin] WebSocket 管理器已销毁')
      }
    },
  }
}

/**
 * 在组件中注入 WebSocket 管理器
 * 
 * @returns WebSocket 管理器实例
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { injectWebSocketManager } from './plugins/websocket'
 * 
 * const manager = injectWebSocketManager()
 * 
 * // 连接 WebSocket
 * const ws = manager.connect('chat', 'ws://localhost:3000/chat', {
 *   autoReconnect: true
 * })
 * 
 * // 订阅消息
 * const unsubscribe = manager.subscribe('chat', (data) => {
 *   console.log('收到消息:', data)
 * })
 * </script>
 * ```
 */
export function injectWebSocketManager() {
  return getWebSocketManager()
}

// 扩展 Vue 全局属性类型
declare module 'vue' {
  interface ComponentCustomProperties {
    /** WebSocket 管理器 */
    $ws: ReturnType<typeof getWebSocketManager>
  }
}

