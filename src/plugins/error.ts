/**
 * 错误处理插件配置
 *
 * 提供全局错误捕获、错误边界和错误上报功能
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 方法 1：使用 v-error-boundary 指令（最简单） -->
 *   <div v-error-boundary>
 *     <RiskyComponent />
 *   </div>
 *
 *   <!-- 方法 2：使用 overlay 模式 -->
 *   <div v-error-boundary="'overlay'">
 *     <RiskyComponent />
 *   </div>
 *
 *   <!-- 方法 3：使用 ErrorBoundary 组件 -->
 *   <ErrorBoundary mode="overlay" @error="handleError">
 *     <MyComponent />
 *   </ErrorBoundary>
 * </template>
 *
 * <script setup>
 * // 使用 composable
 * const { captureError, addBreadcrumb } = useErrorHandler()
 *
 * // 使用全局 Toast
 * const { showError } = useGlobalErrorToast()
 * </script>
 * ```
 */

import { createErrorEnginePlugin } from '@ldesign/error-vue/plugins'
import type { ErrorEnginePluginOptions } from '@ldesign/error-vue/plugins'
import { getTrackerInstance } from '@ldesign/tracker-vue/plugins'

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
  // 全局 Toast 配置
  toast: {
    enabled: true,
    showVueErrors: true,      // Vue 组件错误自动显示 Toast
    showGlobalErrors: false,  // 全局 JS 错误不显示 Toast（避免过多提示）
    maxToasts: 5,
    defaultDuration: 5000,
    position: 'top-right',
  },
  // Tracker 集成：错误上报时自动带上用户操作记录
  trackerIntegration: {
    enabled: true,
    getTracker: () => getTrackerInstance() as any,
    maxEvents: 20,            // 最近 20 条用户操作
    includeTypes: ['click', 'navigation', 'page_view', 'input', 'scroll'],
    includeEventData: true,
  },
  // 注册 v-error-boundary 指令
  registerDirective: true,
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
export {
  ErrorBoundary,
  ErrorOverlay,
  ErrorToastContainer,
  useErrorHandler,
  useGlobalErrorToast,
  vErrorBoundary,
} from '@ldesign/error-vue'

