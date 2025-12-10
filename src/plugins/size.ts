/**
 * 尺寸管理插件配置
 * 
 * 支持的功能：
 * - 多尺寸预设切换和持久化
 * - 尺寸变化回调 (onSizeChange)
 * - 初始化完成钩子 (onReady)
 * - 尺寸选择器配置 (sizeSwitcher)
 */
import { createSizeEnginePlugin } from '@ldesign/size-vue/plugins'
import type { SizePresetTheme } from '@ldesign/size-core'

// Size 插件上下文类型
interface SizePluginContext {
  applyPreset: (preset: string) => void
  getCurrentPreset: () => SizePresetTheme | null
  setBaseSize: (size: number) => void
  getBaseSize: () => number
  setScale: (scale: number) => void
  getScale: () => number
  getPresets: () => SizePresetTheme[]
  compute: (level: number) => number
  adapter: any
}

/**
 * 创建尺寸管理插件
 */
export function createSizePlugin() {
  return createSizeEnginePlugin({
    // ========== 基础配置 ==========
    baseSize: 'brand-default',
    scale: 1.25,
    unit: 'px',

    // ========== 自定义预设 ==========
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
      {
        name: 'brand-large',
        label: '品牌大号',
        description: '品牌定制的大尺寸系统',
        order: 3,
        config: {
          baseSize: 18,
          scale: 1.333,
          unit: 'px',
          lineHeight: 1.7,
        },
      },
    ],

    // ========== 持久化配置 ==========
    persistence: {
      enabled: true,
      key: 'ldesign-size',
      storage: 'localStorage',
    },

    // ========== 尺寸选择器配置 ==========
    // sizeSwitcher: {
    //   disabledPresets: [], // 禁用的预设
    //   useOnlyCustom: false, // 是否只使用自定义预设
    // },

    // ========== Vue 集成配置 ==========
    globalProperties: true,
    globalComponents: true,

    // ========== 事件回调 ==========
    onSizeChange: (preset: SizePresetTheme, oldPreset: SizePresetTheme | null) => {
      console.log(`[Size Plugin] 尺寸切换: ${oldPreset?.name || 'none'} -> ${preset.name}`)
      // 可以在这里同步到服务器
      // await api.updateUserSize(preset.name)
    },

    onReady: (context: SizePluginContext) => {
      const currentPreset = context.getCurrentPreset()
      console.log('[Size Plugin] 初始化完成, 当前预设:', currentPreset?.name)
      // 可以在这里从服务器加载用户尺寸偏好
      // const userPreset = await api.getUserSize()
      // if (userPreset) {
      //   context.applyPreset(userPreset)
      // }
    },
  })
}

