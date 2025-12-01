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
 */
import { createI18nPlugin } from './i18n'
import { createRouterPlugin } from './router'
import { createColorPlugin } from './color'
import { createSizePlugin } from './size'
import { createHttpPlugin } from './http'
import { createDevicePlugin } from './device'
import { createCachePlugin } from './cache'
import { createStorePlugin } from './store'
import { createLoggerPlugin } from './logger'
import { createErrorHandlerPlugin } from './error'
import { createTrackerPlugin_ } from './tracker'
import { createTemplatePlugin } from './template'
import { createAuthEnginePlugin } from './auth'
import { createPermissionPlugin } from './permission'

/**
 * 创建所有引擎插件
 *
 * 插件加载顺序很重要，依赖关系如下：
 * 1. i18n - 国际化（基础功能，其他插件可能需要）
 * 2. router - 路由（页面导航基础）
 * 3. color - 颜色主题
 * 4. size - 尺寸管理
 * 5. http - HTTP 请求
 * 6. device - 设备信息
 * 7. cache - 缓存管理
 * 8. store - 状态管理
 * 9. logger - 日志（依赖路由进行跟踪）
 * 10. error - 错误处理（依赖日志）
 * 11. tracker - 用户行为追踪
 * 12. template - 模板（可能依赖其他插件）
 * 13. auth - 认证（依赖 router 进行守卫）
 * 14. permission - 权限（依赖 auth 获取用户权限）
 */
export function createEnginePlugins() {
  return [
    createI18nPlugin(),
    createRouterPlugin(),
    createColorPlugin(),
    createSizePlugin(),
    createHttpPlugin(),
    createDevicePlugin(),
    createCachePlugin(),
    createStorePlugin(),
    createLoggerPlugin(),
    createErrorHandlerPlugin(),
    createTrackerPlugin_(),
    createTemplatePlugin(),
    createAuthEnginePlugin(),
    createPermissionPlugin(),
  ]
}

// 导出各插件创建函数，方便单独使用
export {
  createI18nPlugin,
  createRouterPlugin,
  createColorPlugin,
  createSizePlugin,
  createHttpPlugin,
  createDevicePlugin,
  createCachePlugin,
  createStorePlugin,
  createLoggerPlugin,
  createErrorHandlerPlugin,
  createTrackerPlugin_,
  createTemplatePlugin,
  createAuthEnginePlugin,
  createPermissionPlugin,
}

// 导出错误处理组件和 composables
export { ErrorBoundary, useErrorHandler } from './error'

// 导出追踪 composables 和指令
export { useTracker, vTrack } from './tracker'
