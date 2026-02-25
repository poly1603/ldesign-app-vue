/**
 * 设计令牌（Design Tokens）插件配置
 *
 * 与 color 插件互补协作：
 * - color 插件：专注 CSS 主题色变量（primary/success/warning/error 等色彩体系）
 * - theme 插件：管理完整的设计令牌系统（颜色/尺寸/间距/圆角/阴影/字体排版）
 *
 * 应用场景：
 * - 统一管理品牌设计规范
 * - 动态切换设计令牌预设
 * - CSS 变量自动注入
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { ThemeManager } from '@ldesign/theme-core'
import { createThemePlugin } from '@ldesign/theme-vue'

/**
 * 品牌设计令牌预设
 */
const brandPreset = {
  name: 'brand',
  light: {
    colors: {
      primary: '#1677ff',
      primaryLight: '#4096ff',
      primaryDark: '#0958d9',
      secondary: '#722ed1',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      info: '#1677ff',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#1f1f1f',
      textSecondary: '#8c8c8c',
      border: '#d9d9d9',
      divider: '#f0f0f0',
    },
    sizes: { xs: '24px', sm: '32px', md: '40px', lg: '48px', xl: '56px' },
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' },
    radius: { none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
      md: '0 4px 6px -1px rgba(0,0,0,0.1)',
      lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
      xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontFamilyMono: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
      fontSizeXs: '12px', fontSizeSm: '14px', fontSizeMd: '16px',
      fontSizeLg: '18px', fontSizeXl: '20px', fontSize2xl: '24px',
      fontWeightNormal: '400', fontWeightMedium: '500', fontWeightBold: '600',
      lineHeightTight: '1.25', lineHeightNormal: '1.5', lineHeightRelaxed: '1.75',
    },
  },
  dark: {
    colors: {
      primary: '#4096ff',
      primaryLight: '#69b1ff',
      primaryDark: '#1677ff',
      secondary: '#9254de',
      success: '#73d13d',
      warning: '#ffc53d',
      error: '#ff7875',
      info: '#4096ff',
      background: '#141414',
      surface: '#1f1f1f',
      text: '#ffffffd9',
      textSecondary: '#ffffff73',
      border: '#424242',
      divider: '#303030',
    },
  },
}

/**
 * 创建设计令牌引擎插件
 */
export function createThemeEnginePlugin() {
  const manager = new ThemeManager({
    mode: 'light', // 跟随 color 插件的模式，不独立管理
  })

  // 注册品牌预设
  manager.registerPreset(brandPreset as any)

  return definePlugin({
    name: 'theme-tokens',
    version: '1.0.0',

    async install(context) {
      const { app } = context as any
      if (!app) return

      // 安装 Vue 插件
      const themePlugin = createThemePlugin({
        mode: 'light',
      })
      app.use(themePlugin)

      // 使用已配置的 manager 覆盖默认实例
      app.provide('ldesign-theme', manager)
      app.config.globalProperties.$theme = manager

      // 应用品牌预设
      manager.applyPreset('brand')

      if (import.meta.env.DEV) {
        console.log('[Theme Plugin] 设计令牌已初始化', {
          mode: manager.getMode(),
          resolvedMode: manager.getResolvedMode(),
        })
      }
    },
  })
}
