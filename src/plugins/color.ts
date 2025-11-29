/**
 * 颜色主题插件配置
 */
import { createColorEnginePlugin } from '@ldesign/color-vue/plugins'

/**
 * 创建颜色主题插件
 */
export function createColorPlugin() {
  return createColorEnginePlugin({
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
  })
}

