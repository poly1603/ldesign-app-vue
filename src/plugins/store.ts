/**
 * 状态管理插件配置
 */
import { createStoreEnginePlugin } from '@ldesign/store-vue'

/**
 * 创建状态管理插件
 */
export function createStorePlugin() {
  return createStoreEnginePlugin({
    persist: true,
    persistOptions: {
      storage: 'localStorage',
      keyPrefix: 'ldesign-app-store:',
    },
    devtools: import.meta.env.DEV,
    // debug 模式会输出大量日志，仅在需要时开启
    debug: false,
    globalProperties: true,
  })
}

