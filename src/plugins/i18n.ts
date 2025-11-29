/**
 * I18n 国际化插件配置
 */
import { createI18nEnginePlugin } from '@ldesign/i18n-vue/plugins'
import messages from '../locales'

/**
 * 创建 I18n 国际化插件
 */
export function createI18nPlugin() {
  return createI18nEnginePlugin({
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
  })
}

