/**
 * 缓存管理插件配置
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { createCachePlugin as createCacheVuePlugin, CacheStrategy } from '@ldesign/cache-vue'

/**
 * 创建缓存管理引擎插件
 *
 * 注意：@ldesign/cache-vue 导出的 createCachePlugin 是一个 Vue 插件工厂，
 * 这里通过 definePlugin 包装为 Engine 插件，确保 PluginManager 收到的
 * 是包含 name/version/install 的标准引擎插件对象。
 */
export function createCachePlugin() {
  const vuePlugin = createCacheVuePlugin({
    defaultTTL: 5 * 60 * 1000, // 5分钟默认过期时间
    maxSize: 5000,
    strategy: CacheStrategy.LRU,
    enableStats: true,
  })

  return definePlugin({
    name: 'cache',
    version: '1.0.0',

    async install(context) {
      const { app } = context as any
      if (!app) return

      app.use(vuePlugin)
    },
  })
}

