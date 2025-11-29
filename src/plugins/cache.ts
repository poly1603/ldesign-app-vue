/**
 * 缓存管理插件配置
 */
import { createCacheEnginePlugin } from '@ldesign/cache'

/**
 * 创建缓存管理插件
 */
export function createCachePlugin() {
  return createCacheEnginePlugin({
    defaultTTL: 5 * 60 * 1000, // 5分钟默认过期时间
    engines: {
      memory: {
        maxItems: 5000,
        evictionStrategy: 'LRU',
      },
    },
    // debug 模式会输出大量日志，仅在需要时开启
    debug: false,
  })
}

