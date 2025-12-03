/**
 * 状态管理插件配置
 *
 * 使用增强版持久化插件，支持：
 * - 多标签页状态同步
 * - 选择性持久化
 * - 过期时间控制
 * - 性能优化
 */
import { createStoreEnginePlugin, createEnhancedPersistPlugin } from '@ldesign/store-vue'

/**
 * 创建状态管理插件
 */
export function createStorePlugin() {
  // 创建 Store Engine 插件（内部会创建 Pinia 实例）
  const storePlugin = createStoreEnginePlugin({
    persist: false, // 不使用默认持久化插件
    devtools: import.meta.env.DEV,
    debug: false,
    globalProperties: true,
  })

  // 保存原始的 install 方法
  const originalInstall = storePlugin.install

  // 重写 install 方法，在安装后添加增强版持久化插件
  storePlugin.install = async function (context: any) {
    // 先执行原始安装
    await originalInstall.call(this, context)

    // 获取 Pinia 实例并添加增强版持久化插件
    const app = context?.engine?.app || context?.app
    if (app) {
      const pinia = app.config.globalProperties.$pinia
      if (pinia) {
        pinia.use(createEnhancedPersistPlugin({
          storage: 'localStorage',
          keyPrefix: 'ldesign-app-store:',
          debounce: 300, // 300ms 防抖
          debug: import.meta.env.DEV,
          syncTabs: true, // 启用多标签页同步
          defaultTTL: 7 * 24 * 60 * 60 * 1000, // 默认 7 天过期
        }))
      }
    }
  }

  return storePlugin
}

