/**
 * 尺寸管理插件配置
 */
import { createSizeEnginePlugin } from '@ldesign/size-vue/plugins'

/**
 * 创建尺寸管理插件
 */
export function createSizePlugin() {
  return createSizeEnginePlugin({
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
  })
}

