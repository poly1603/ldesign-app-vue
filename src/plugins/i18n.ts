/**
 * I18n 国际化插件配置
 * 
 * 支持的功能：
 * - 多语言切换和持久化
 * - 语言切换回调 (onLocaleChange)
 * - 初始化完成钩子 (onReady)
 * - 语言选择器配置 (localeSwitcher)
 */
import { createI18nEnginePlugin } from '@ldesign/i18n-vue/plugins'
import messages from '../locales'

// I18n 插件上下文类型
interface I18nPluginContext {
  setLocale: (locale: string) => Promise<void>
  getLocale: () => string
  t: (key: string, params?: Record<string, any>) => string
  getAvailableLocales: () => string[]
  addLocale: (locale: string, messages: Record<string, any>) => void
  has: (key: string, locale?: string) => boolean
  instance: any
}

/**
 * 创建 I18n 国际化插件
 */
export function createI18nPlugin() {
  return createI18nEnginePlugin({
    // ========== 基础配置 ==========
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages,

    // ========== 性能配置 ==========
    cache: true,
    cacheSize: 100,
    performance: true,
    preloadLocales: ['zh-CN', 'en-US'],

    // ========== 持久化配置 ==========
    persistence: {
      enabled: true,
      key: 'ldesign-i18n',
      storage: 'localStorage',
    },

    // ========== 语言选择器配置 ==========
    // localeSwitcher: {
    //   disabledLocales: [], // 禁用的语言
    //   customLocales: [],   // 自定义语言选项
    //   style: {
    //     width: '200px',
    //     maxHeight: '300px',
    //   },
    // },

    // ========== Vue 集成配置 ==========
    globalProperties: true,
    globalComponents: true,

    // ========== 事件回调 ==========
    onLocaleChange: async (locale: string, oldLocale: string) => {
      console.log(`[I18n Plugin] 语言切换: ${oldLocale} -> ${locale}`)
      // 可以在这里同步到服务器
      // await api.updateUserLocale(locale)
    },

    onReady: async (context: I18nPluginContext) => {
      console.log('[I18n Plugin] 初始化完成, 当前语言:', context.getLocale())
      // 可以在这里从服务器加载用户语言偏好
      // const userLocale = await api.getUserLocale()
      // if (userLocale) {
      //   await context.setLocale(userLocale)
      // }
    },
  })
}

