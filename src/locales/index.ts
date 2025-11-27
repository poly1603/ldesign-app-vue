import enUS from './en-US'
/**
 * 国际化语言包
 */
import zhCN from './zh-CN'

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export const availableLocales = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en-US', name: 'English' },
]

export default messages
