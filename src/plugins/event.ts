/**
 * 事件总线插件配置
 *
 * 提供全局事件总线，用于跨组件/跨模块通信：
 * - 支持通配符事件匹配
 * - 支持事件历史记录和回放
 * - 组件卸载时自动清理订阅
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { EventBus } from '@ldesign/event-core'
import { createEventPlugin } from '@ldesign/event-vue'

/**
 * 应用级事件类型定义
 *
 * 在此统一定义跨模块通信的事件类型，确保类型安全
 */
export interface AppEvents {
  /** 用户登录成功 */
  'auth:login': { userId: string; username: string }
  /** 用户退出登录 */
  'auth:logout': void
  /** 用户信息更新 */
  'auth:userUpdated': { userId: string }
  /** 全局通知 */
  'notification:show': { type: 'info' | 'success' | 'warning' | 'error'; title: string; content?: string }
  /** 主题变更 */
  'theme:changed': { mode: string; color?: string }
  /** 菜单折叠状态变更 */
  'menu:collapsed': { collapsed: boolean }
  /** 路由导航 */
  'router:navigate': { path: string; query?: Record<string, string> }
}

/**
 * 创建事件总线引擎插件
 */
export function createEventEnginePlugin() {
  const bus = new EventBus<AppEvents>({
    maxHistory: 200,
    wildcard: true,
    separator: ':',
  })

  return definePlugin({
    name: 'event-bus',
    version: '1.0.0',

    async install(context) {
      const { app } = context as any
      if (!app) return

      // 安装 Vue 插件
      app.use(createEventPlugin(bus as any))

      if (import.meta.env.DEV) {
        console.log('[EventBus Plugin] 全局事件总线已初始化')
      }
    },

    async uninstall() {
      bus.destroy()
    },
  })
}

// 导出事件总线类型
export type { AppEvents }
