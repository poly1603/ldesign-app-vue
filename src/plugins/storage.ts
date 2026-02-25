/**
 * 统一存储插件配置
 *
 * 提供全局存储管理器：
 * - 统一命名空间前缀，避免多应用冲突
 * - 支持 TTL 过期和版本控制
 * - 多适配器（localStorage / sessionStorage / 内存 / Cookie）
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { StorageManager, LocalStorageAdapter } from '@ldesign/storage-core'
import { createStoragePlugin } from '@ldesign/storage-vue'

/**
 * 创建统一存储引擎插件
 */
export function createStorageEnginePlugin() {
  const manager = new StorageManager(new LocalStorageAdapter(), {
    prefix: 'ldesign-app',
    defaultTTL: 7 * 24 * 60 * 60 * 1000, // 默认 7 天过期
    version: 1,
  })

  return definePlugin({
    name: 'storage',
    version: '1.0.0',

    async install(context) {
      const { app } = context as any
      if (!app) return

      // 安装 Vue 插件
      app.use(createStoragePlugin())

      // 注入应用级存储管理器
      app.provide('ldesign-storage', manager)
      app.config.globalProperties.$storage = manager

      if (import.meta.env.DEV) {
        console.log('[Storage Plugin] 统一存储管理器已初始化', {
          prefix: 'ldesign-app',
          defaultTTL: '7 天',
          keys: manager.keys().length,
        })
      }
    },

    async uninstall() {
      // 不清除存储数据，仅释放引用
    },
  })
}

// 导出存储管理器类供组件直接使用
export { StorageManager }
