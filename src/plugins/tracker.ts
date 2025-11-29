/**
 * 用户行为追踪插件配置
 *
 * 提供用户行为追踪、操作记录和数据分析功能
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 使用 v-track 指令 -->
 *   <button v-track="'button_click'">点击</button>
 *   <button v-track="{ name: 'submit', data: { form: 'login' } }">提交</button>
 * </template>
 *
 * <script setup>
 * // 使用 composable
 * const { track, setUserId } = useTracker()
 *
 * // 手动追踪
 * track('custom_event', { key: 'value' })
 *
 * // 设置用户 ID
 * setUserId('user_123')
 * </script>
 * ```
 */

import { createTrackerEnginePlugin } from '@ldesign/tracker-vue/plugins'
import type { TrackerEnginePluginOptions } from '@ldesign/tracker-vue/plugins'

/**
 * 追踪插件配置
 */
const trackerPluginOptions: TrackerEnginePluginOptions = {
  pluginName: 'tracker',
  pluginVersion: '1.0.0',
  debug: import.meta.env.DEV,
  // 是否启用
  enabled: true,
  // 应用名称
  appName: 'LDesign App',
  // 采样率
  sampleRate: import.meta.env.DEV ? 1 : 0.5,
  // 批量发送间隔
  batchInterval: 5000,
  // 批量大小
  batchSize: 20,
  // 上报地址（生产环境配置）
  endpoint: import.meta.env.VITE_TRACKER_URL || '',
  // 自动收集配置
  autoPageView: true,
  autoClick: true,
  autoScroll: true,
  autoInput: false, // 输入追踪默认关闭，避免隐私问题
  // 敏感字段
  sensitiveFields: ['password', 'pwd', 'secret', 'token', 'card', 'cvv'],
  // 忽略的选择器
  ignoreSelectors: [
    '[data-track-ignore]',
    '.no-track',
  ],
  // 注册 v-track 指令
  registerDirective: true,
  // 事件回调
  onTrack: (event) => {
    // 开发模式下输出到控制台
    if (import.meta.env.DEV) {
      console.log('[Tracker]', event.type, event.name, event.data)
    }
  },
}

/**
 * 创建追踪 Engine 插件
 * @returns Engine 插件
 */
export function createTrackerPlugin_() {
  return createTrackerEnginePlugin(trackerPluginOptions)
}

// 导出 composables 供直接使用
export { useTracker, vTrack } from '@ldesign/tracker-vue'

