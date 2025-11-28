/**
 * 引擎插件配置
 */
import { createCacheEnginePlugin } from '@ldesign/cache'
import { createColorEnginePlugin } from '@ldesign/color-vue/plugins'
import { createDeviceEnginePlugin } from '@ldesign/device-vue/plugins'
import { createHttpEnginePlugin } from '@ldesign/http-vue'
import { createI18nEnginePlugin } from '@ldesign/i18n-vue/plugins'
import { createRouterEnginePlugin } from '@ldesign/router-vue/plugins'
import { createSizeEnginePlugin } from '@ldesign/size-vue/plugins'
import { createStoreEnginePlugin } from '@ldesign/store-vue'
import httpClient from '../api/http'
import messages from '../locales'
import { routes } from '../router'

/**
 * 创建所有引擎插件
 */
export function createEnginePlugins() {
  return [
    // I18n 国际化插件
    createI18nEnginePlugin({
      locale: 'zh-CN',
      fallbackLocale: 'en-US',
      messages,
      cache: true,
      cacheSize: 100,
      performance: true,
      preloadLocales: ['zh-CN', 'en-US'],
      persistence: {
        enabled: true,
        key: 'ldesign-app-locale',
      },
      globalProperties: true,
      globalComponents: true,
    }),

    // 路由插件
    createRouterEnginePlugin({
      routes,
      mode: 'history',
    }),

    // 颜色主题插件
    createColorEnginePlugin({
      primaryColor: 'brand-primary',
      mode: 'light',
      persistence: {
        enabled: true,
        key: 'ldesign-app-theme',
      },
      customPresets: [
        {
          name: 'brand-primary',
          label: '品牌主色',
          color: '#FF6B6B',
          description: '公司品牌主色调',
          order: 1,
        },
        {
          name: 'brand-secondary',
          label: '品牌辅色',
          color: '#4ECDC4',
          description: '公司品牌辅助色',
          order: 2,
        },
      ],
      globalProperties: true,
      globalComponents: true,
    }),

    // 尺寸管理插件
    createSizeEnginePlugin({
      baseSize: 'brand-default',
      scale: 1.25,
      unit: 'px',
      customPresets: [
        {
          name: 'brand-compact',
          label: '品牌紧凑',
          description: '品牌定制的紧凑尺寸系统',
          order: 1,
          config: {
            baseSize: 14,
            scale: 1.2,
            unit: 'px',
            lineHeight: 1.5,
          },
        },
        {
          name: 'brand-default',
          label: '品牌默认',
          description: '品牌定制的默认尺寸系统',
          order: 2,
          config: {
            baseSize: 16,
            scale: 1.25,
            unit: 'px',
            lineHeight: 1.6,
          },
        },
      ],
      persistence: {
        enabled: true,
        key: 'ldesign-app-size',
      },
      globalProperties: true,
      globalComponents: true,
    }),

    // HTTP 请求插件
    createHttpEnginePlugin({
      client: httpClient,
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
    }),

    // 设备信息插件
    createDeviceEnginePlugin({
      enableResize: true,
      enableOrientation: true,
      modules: ['network', 'battery'],
      debug: import.meta.env.DEV,
    }),

    // 缓存管理插件
    createCacheEnginePlugin({
      defaultTTL: 5 * 60 * 1000, // 5分钟默认过期时间
      engines: {
        memory: {
          maxItems: 5000,
          evictionStrategy: 'LRU',
        },
      },
      debug: import.meta.env.DEV,
    }),

    // 状态管理插件
    createStoreEnginePlugin({
      persist: true,
      persistOptions: {
        storage: 'localStorage',
        keyPrefix: 'ldesign-app-store:',
      },
      devtools: import.meta.env.DEV,
      debug: import.meta.env.DEV,
      globalProperties: true,
    }),
  ]
}
