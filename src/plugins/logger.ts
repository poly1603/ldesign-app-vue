/**
 * Logger 日志插件配置
 */
import { createLoggerEnginePlugin } from '@ldesign/logger-vue/plugins'
import { LogLevel } from '@ldesign/logger-core'

/**
 * 创建日志插件
 */
export function createLoggerPlugin() {
  return createLoggerEnginePlugin({
    name: 'LDesignApp',
    level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN,
    enableErrorTracking: true,
    // 关闭性能监控以避免与 Engine 内部性能监控冲突
    enablePerformanceMonitoring: false,
    enableRouterTracking: true,
    enableVueErrorHandler: import.meta.env.DEV,
    enableVueWarnHandler: import.meta.env.DEV,
    debug: false,
  })
}

