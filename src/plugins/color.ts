/**
 * 颜色主题插件配置
 * 
 * 支持以下功能：
 * - colorPicker.disabledPresets: 禁用某些内置主题色
 * - colorPicker.customPresets: 添加自定义主题色
 * - colorPicker.useOnlyCustom: 只使用自定义主题色
 * - modeSwitcher.modes: 配置可用的主题模式
 * - onColorChange: 主题色变化回调 (可用于保存到服务器)
 * - onModeChange: 主题模式变化回调 (可用于保存到服务器)
 * - onReady: 初始化完成钩子 (可用于从服务器获取配置)
 */
import { createColorEnginePlugin } from '@ldesign/color-vue/plugins'

/**
 * 创建颜色主题插件
 */
export function createColorPlugin() {
  return createColorEnginePlugin({
    // 默认配置
    primaryColor: '#1890ff',
    mode: 'auto',
    globalProperties: true,
    globalComponents: true,

    // 主题色选择器配置
    colorPicker: {
      // 禁用某些内置主题色 (通过 name)
      disabledPresets: ['yellow', 'geekblue'],

      // 自定义主题色
      customPresets: [
        {
          name: 'brand',
          color: '#FF6B6B',
          i18n: {
            zh: { label: '品牌红', description: '公司品牌主色调，活力四射' },
            en: { label: 'Brand Red', description: 'Company brand color, energetic' },
          },
        },
        {
          name: 'nature',
          color: '#2E7D32',
          i18n: {
            zh: { label: '自然绿', description: '环保健康，清新自然' },
            en: { label: 'Nature Green', description: 'Eco-friendly and fresh' },
          },
        },
      ],

      // 是否只使用自定义主题色
      // useOnlyCustom: true,
    },

    // 主题模式选择器配置
    modeSwitcher: {
      // 可用的模式 (可以配置只显示部分)
      modes: ['light', 'dark', 'auto'],
    },

    // 事件回调 - 主题色变化
    onColorChange: (color: string, oldColor: string) => {
      console.log('[Color Plugin] 主题色变化:', oldColor, '->', color)
      // TODO: 在这里调用 API 保存到服务器
      // api.saveUserPreference({ themeColor: color })
    },

    // 事件回调 - 主题模式变化
    onModeChange: (mode: string, oldMode: string) => {
      console.log('[Color Plugin] 主题模式变化:', oldMode, '->', mode)
      // TODO: 在这里调用 API 保存到服务器
      // api.saveUserPreference({ themeMode: mode })
    },

    // 初始化完成钩子
    onReady: async (context: any) => {
      const { getColor, getMode } = context
      console.log('[Color Plugin] 初始化完成, 当前主题色:', getColor(), '模式:', getMode())

      // TODO: 从服务器获取用户配置
      // try {
      //   const userTheme = await api.getUserPreference()
      //   if (userTheme.color) context.setColor(userTheme.color)
      //   if (userTheme.mode) context.setMode(userTheme.mode)
      // } catch (e) {
      //   console.warn('获取用户主题配置失败:', e)
      // }
    },
  })
}
