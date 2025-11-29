/**
 * 错误处理插件配置
 *
 * 提供全局错误捕获、错误边界和错误上报功能
 *
 * @example
 * ```ts
 * // 在组件中使用 ErrorBoundary
 * <ErrorBoundary @error="handleError">
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // 使用 composable
 * const { captureError, addBreadcrumb } = useErrorHandler()
 * ```
 */

import { createErrorEnginePlugin } from '@ldesign/error-vue/plugins'
import type { ErrorEnginePluginOptions } from '@ldesign/error-vue/plugins'

/**
 * 错误插件配置
 */
const errorPluginOptions: ErrorEnginePluginOptions = {
  pluginName: 'error',
  pluginVersion: '1.0.0',
  debug: import.meta.env.DEV,
  appName: 'LDesign App',
  enabled: true,
  catcher: {
    // 忽略的错误模式
    ignorePatterns: [
      /ResizeObserver loop/i,
      /Script error/i,
    ],
    // 最大面包屑数量
    maxBreadcrumbs: 50,
    // 错误回调
    onError: (error) => {
      // 开发模式下输出到控制台
      if (import.meta.env.DEV) {
        console.error('[ErrorCatcher]', error)
      }
    },
  },
  reporter: {
    // 开发环境或未配置 endpoint 时禁用上报
    enabled: !import.meta.env.DEV && !!import.meta.env.VITE_ERROR_REPORT_URL,
    // 上报地址（生产环境配置）
    endpoint: import.meta.env.VITE_ERROR_REPORT_URL || '/api/errors',
    // 批量大小
    batchSize: 10,
    // 批量间隔
    batchInterval: 5000,
    // 采样率（生产环境可降低）
    sampleRate: import.meta.env.DEV ? 1 : 0.5,
    // 最大重试次数
    maxRetries: 3,
    // 禁用离线缓存（开发环境不需要）
    enableOfflineCache: !import.meta.env.DEV,
  },
  // Vue 错误回调
  onVueError: (error) => {
    console.error('[Vue Error]', error.message, error.componentInfo?.name)
  },
}

/**
 * 创建错误处理 Engine 插件
 * @returns Engine 插件
 */
export function createErrorHandlerPlugin() {
  return createErrorEnginePlugin(errorPluginOptions)
}

// 导出组件和 composables 供直接使用
export { ErrorBoundary, useErrorHandler } from '@ldesign/error-vue'

