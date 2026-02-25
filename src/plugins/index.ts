/**
 * 引擎插件配置
 *
 * 本文件负责整合所有插件，各插件的具体配置请查看对应文件：
 * - i18n.ts       - 国际化插件
 * - router.ts     - 路由插件
 * - color.ts      - 颜色主题插件
 * - size.ts       - 尺寸管理插件
 * - http.ts       - HTTP 请求插件
 * - device.ts     - 设备信息插件
 * - cache.ts      - 缓存管理插件
 * - store.ts      - 状态管理插件
 * - logger.ts     - 日志插件
 * - error.ts      - 错误处理插件
 * - tracker.ts    - 用户行为追踪插件
 * - template.ts   - 模板插件
 * - auth.ts       - 认证插件
 * - permission.ts - 权限插件
 * - bookmark.ts   - 书签插件
 * - websocket.ts  - WebSocket 实时通信插件
 * - validate.ts   - 表单校验插件
 * - event.ts      - 事件总线插件
 * - storage.ts    - 统一存储插件
 * - config.ts     - 应用配置插件
 * - theme.ts      - 设计令牌插件
 */
import { createI18nPlugin } from './i18n'
import { createRouterPlugin } from './router'
import { createColorPlugin } from './color'
import { createSizePlugin } from './size'
import { createHttpPlugin } from './http'
import { createApiEnginePlugin } from './api'
import { createDevicePlugin } from './device'
import { createCachePlugin } from './cache'
import { createStorePlugin } from './store'
import { createLoggerPlugin } from './logger'
import { createErrorHandlerPlugin } from './error'
import { createTrackerPlugin_ } from './tracker'
import { createTemplatePlugin } from './template'
import { createAuthEnginePlugin } from './auth'
import { createPermissionPlugin } from './permission'
import { createBookmarkPlugin } from './bookmark'
import { createWebSocketPlugin } from './websocket'
import { createValidateEnginePlugin } from './validate'
import { createEventEnginePlugin } from './event'
import { createStorageEnginePlugin } from './storage'
import { createConfigEnginePlugin } from './config'
import { createThemeEnginePlugin } from './theme'

/**
 * 创建所有引擎插件
 *
 * 插件加载顺序很重要，依赖关系如下：
 * 1. config - 应用配置（最底层，其他插件可能读取配置）
 * 2. event - 事件总线（基础通信机制）
 * 3. i18n - 国际化（基础功能，其他插件可能需要）
 * 4. router - 路由（页面导航基础）
 * 5. color - 颜色主题
 * 6. theme - 设计令牌（与 color 互补）
 * 7. size - 尺寸管理
 * 8. http - HTTP 请求
 * 9. device - 设备信息
 * 10. storage - 统一存储
 * 11. cache - 缓存管理
 * 12. store - 状态管理
 * 13. logger - 日志（依赖路由进行跟踪）
 * 14. error - 错误处理（依赖日志）
 * 15. tracker - 用户行为追踪
 * 16. template - 模板（可能依赖其他插件）
 * 17. validate - 表单校验
 * 18. auth - 认证（依赖 router 进行守卫）
 * 19. permission - 权限（依赖 auth 获取用户权限）
 * 20. bookmark - 书签
 * 21. websocket - WebSocket 实时通信（依赖 http 插件）
 */
export function createEnginePlugins() {
  return [
    createConfigEnginePlugin(),
    createEventEnginePlugin(),
    createI18nPlugin(),
    createRouterPlugin(),
    createColorPlugin(),
    createThemeEnginePlugin(),
    createSizePlugin(),
    createHttpPlugin(),
    createApiEnginePlugin(),
    createDevicePlugin(),
    createStorageEnginePlugin(),
    createCachePlugin(),
    createStorePlugin(),
    createLoggerPlugin(),
    createErrorHandlerPlugin(),
    createTrackerPlugin_(),
    createTemplatePlugin(),
    createValidateEnginePlugin(),
    createAuthEnginePlugin(),
    createPermissionPlugin(),
    createBookmarkPlugin(),
    createWebSocketPlugin({
      autoCleanup: true,
      cleanupInterval: 60000, // 1 分钟
      maxConnections: 10,
      debug: import.meta.env.DEV,
    }),
  ]
}

// 导出各插件创建函数，方便单独使用
export {
  createConfigEnginePlugin,
  createEventEnginePlugin,
  createI18nPlugin,
  createRouterPlugin,
  createColorPlugin,
  createThemeEnginePlugin,
  createSizePlugin,
  createHttpPlugin,
  createApiEnginePlugin,
  createDevicePlugin,
  createStorageEnginePlugin,
  createCachePlugin,
  createStorePlugin,
  createLoggerPlugin,
  createErrorHandlerPlugin,
  createTrackerPlugin_,
  createTemplatePlugin,
  createValidateEnginePlugin,
  createAuthEnginePlugin,
  createPermissionPlugin,
  createBookmarkPlugin,
  createWebSocketPlugin,
}

// 导出错误处理组件和 composables
export { ErrorBoundary, useErrorHandler } from './error'

// 导出追踪 composables 和指令
export { useTracker, vTrack } from './tracker'

// 导出 WebSocket 相关
export { injectWebSocketManager } from './websocket'

// 导出事件总线类型
export type { AppEvents } from './event'

// 导出配置类型
export type { AppConfig } from './config'
