/**
 * LDesign Launcher 配置文件
 *
 * 用于配置开发服务器、构建选项等
 *
 * @see https://github.com/ldesign/launcher#readme
 */

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AliasConfig } from '@ldesign/launcher'
import { defineConfig, devLoggerPlugin } from '@ldesign/launcher'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DEV_LOGGER_PORT = Number(process.env.VITE_DEV_LOGGER_PORT || '9529')

const SZWSLD_PROXY_TARGET = process.env.VITE_SZWSLD_PROXY_TARGET
  || process.env.VITE_SZWSLD_BASE_URL
  || 'http://localhost:8084'

// 计算 monorepo 根目录
const monorepoRoot = resolve(__dirname, '../../..')
console.log('📁 Monorepo 根目录:', monorepoRoot)

export default defineConfig({
  /**
   * Vite 插件配置
   * 添加开发日志插件，启用 WebSocket 服务器接收浏览器日志
   */
  plugins: [
    devLoggerPlugin({
      port: DEV_LOGGER_PORT,
      path: '/__dev_logger',
      logDir: resolve(__dirname, '../logs'),
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      filePrefix: 'dev',
      enableConsole: true,
      enabled: false,
    }),
  ],

  /**
   * 开发服务器配置
   * launcher 会自动检测 Vue 3 框架，无需手动配置
   */
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    cors: true,
    proxy: {
      '/SZWSLD': {
        target: SZWSLD_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      '/SZVSF': {
        target: SZWSLD_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  /**
   * 预览服务器配置
   */
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
  },

  /**
   * 构建配置
   */
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    target: 'esnext', // 支持顶层 await
  },

  /**
   * 依赖优化配置
   * 排除 @ldesign 包，使用源码直接开发
   */
  optimizeDeps: {
    exclude: [
      '@ldesign/auth-core',
      '@ldesign/auth-vue',
      '@ldesign/engine-core',
      '@ldesign/engine-vue3',
      '@ldesign/router-core',
      '@ldesign/router-vue',
      '@ldesign/i18n-core',
      '@ldesign/i18n-vue',
      '@ldesign/color-core',
      '@ldesign/color-vue',
      '@ldesign/size-core',
      '@ldesign/size-vue',
      '@ldesign/http-core',
      '@ldesign/http-vue',
      '@ldesign/device-core',
      '@ldesign/device-vue',
      '@ldesign/error-core',
      '@ldesign/error-vue',
      '@ldesign/tracker-core',
      '@ldesign/tracker-vue',
      '@ldesign/api-core',
      '@ldesign/api-vue',
      '@ldesign/permission-core',
      '@ldesign/permission-vue',
      '@ldesign/validate-core',
      '@ldesign/validate-vue',
      '@ldesign/event-core',
      '@ldesign/event-vue',
      '@ldesign/storage-core',
      '@ldesign/storage-vue',
      '@ldesign/websocket-core',
      '@ldesign/websocket-vue',
      '@ldesign/config-core',
      '@ldesign/config-vue',
      '@ldesign/theme-core',
      '@ldesign/theme-vue',
    ],
  },

  /**
   * 路径别名配置
   *
   * 使用新的 stage 模式配置别名：
   * - stage: 'dev' - 仅在开发模式生效，使用源码支持 HMR 热更新
   * - stage: 'build' - 仅在构建模式生效
   * - stage: 'all' - 在所有模式下生效
   *
   * 配置策略：
   * 1. 项目内部别名（@）- 所有模式生效
   * 2. @ldesign 包别名 - 仅开发模式生效，构建时使用 node_modules 中的打包产物
   *
   * 注意：
   * - 使用正则表达式匹配子路径导入（如 @ldesign/router-vue/plugins）
   * - 别名顺序很重要：更具体的规则（正则）要放在前面
   */
  resolve: {
    alias: ([
      // ==================== 项目内部别名 ====================
      { find: '@', replacement: resolve(__dirname, '../src'), stage: 'all' as const },

      // ==================== @ldesign 包别名（按字母顺序） ====================

      // Auth 认证包
      { find: /^@ldesign\/auth-core\/(.+)$/, replacement: `${monorepoRoot}/packages/auth/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/auth-core', replacement: `${monorepoRoot}/packages/auth/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/auth-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/auth/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/auth-vue', replacement: `${monorepoRoot}/packages/auth/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Bookmark 书签包
      { find: /^@ldesign\/bookmark-core\/(.+)$/, replacement: `${monorepoRoot}/packages/bookmark/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/bookmark-core', replacement: `${monorepoRoot}/packages/bookmark/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/bookmark-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/bookmark/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/bookmark-vue', replacement: `${monorepoRoot}/packages/bookmark/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Cache 缓存包（使用构建产物，无源码别名）
      // @ldesign/cache 包已构建，直接使用 node_modules 中的产物

      // Color 颜色主题包
      { find: /^@ldesign\/color-core\/(.+)$/, replacement: `${monorepoRoot}/packages/color/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/color-core', replacement: `${monorepoRoot}/packages/color/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/color-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/color/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/color-vue', replacement: `${monorepoRoot}/packages/color/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Crypto 加密包
      { find: /^@ldesign\/crypto-core\/(.+)$/, replacement: `${monorepoRoot}/packages/crypto/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/crypto-core', replacement: `${monorepoRoot}/packages/crypto/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/crypto-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/crypto/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/crypto-vue', replacement: `${monorepoRoot}/packages/crypto/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Device 设备检测包
      { find: /^@ldesign\/device-core\/(.+)$/, replacement: `${monorepoRoot}/packages/device/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/device-core', replacement: `${monorepoRoot}/packages/device/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/device-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/device/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/device-vue', replacement: `${monorepoRoot}/packages/device/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Engine 引擎包
      { find: /^@ldesign\/engine-core\/(.+)$/, replacement: `${monorepoRoot}/packages/engine/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/engine-core', replacement: `${monorepoRoot}/packages/engine/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/engine-vue3\/(.+)$/, replacement: `${monorepoRoot}/packages/engine/packages/vue3/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/engine-vue3', replacement: `${monorepoRoot}/packages/engine/packages/vue3/src/index.ts`, stage: 'dev' as const },

      // HTTP 请求包
      { find: /^@ldesign\/http-core\/(.+)$/, replacement: `${monorepoRoot}/packages/http/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/http-core', replacement: `${monorepoRoot}/packages/http/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/http-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/http/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/http-vue', replacement: `${monorepoRoot}/packages/http/packages/vue/src/index.ts`, stage: 'dev' as const },

      // I18n 国际化包
      { find: /^@ldesign\/i18n-core\/(.+)$/, replacement: `${monorepoRoot}/packages/i18n/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/i18n-core', replacement: `${monorepoRoot}/packages/i18n/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/i18n-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/i18n/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/i18n-vue', replacement: `${monorepoRoot}/packages/i18n/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Logger 日志包
      { find: /^@ldesign\/logger-core\/(.+)$/, replacement: `${monorepoRoot}/packages/logger/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/logger-core', replacement: `${monorepoRoot}/packages/logger/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/logger-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/logger/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/logger-vue', replacement: `${monorepoRoot}/packages/logger/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Error 错误处理包
      { find: /^@ldesign\/error-core\/(.+)$/, replacement: `${monorepoRoot}/packages/error/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/error-core', replacement: `${monorepoRoot}/packages/error/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/error-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/error/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/error-vue', replacement: `${monorepoRoot}/packages/error/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Tracker 用户行为追踪包
      { find: /^@ldesign\/tracker-core\/(.+)$/, replacement: `${monorepoRoot}/packages/tracker/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/tracker-core', replacement: `${monorepoRoot}/packages/tracker/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/tracker-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/tracker/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/tracker-vue', replacement: `${monorepoRoot}/packages/tracker/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Notification 通知包
      { find: /^@ldesign\/notification-core\/(.+)$/, replacement: `${monorepoRoot}/packages/notification/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/notification-core', replacement: `${monorepoRoot}/packages/notification/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/notification-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/notification/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/notification-vue', replacement: `${monorepoRoot}/packages/notification/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Permission 权限包
      { find: /^@ldesign\/permission-core\/(.+)$/, replacement: `${monorepoRoot}/packages/permission/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/permission-core', replacement: `${monorepoRoot}/packages/permission/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/permission-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/permission/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/permission-vue', replacement: `${monorepoRoot}/packages/permission/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Router 路由包
      { find: /^@ldesign\/router-core\/(.+)$/, replacement: `${monorepoRoot}/packages/router/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/router-core', replacement: `${monorepoRoot}/packages/router/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/router-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/router/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/router-vue', replacement: `${monorepoRoot}/packages/router/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Size 尺寸配置包
      { find: /^@ldesign\/size-core\/(.+)$/, replacement: `${monorepoRoot}/packages/size/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/size-core', replacement: `${monorepoRoot}/packages/size/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/size-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/size/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/size-vue', replacement: `${monorepoRoot}/packages/size/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Store 状态管理包
      { find: /^@ldesign\/store-core\/(.+)$/, replacement: `${monorepoRoot}/packages/store/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/store-core', replacement: `${monorepoRoot}/packages/store/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/store-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/store/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/store-vue', replacement: `${monorepoRoot}/packages/store/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Template 模板包
      { find: /^@ldesign\/template-core\/(.+)$/, replacement: `${monorepoRoot}/packages/template/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/template-core', replacement: `${monorepoRoot}/packages/template/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/template-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/template/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/template-vue', replacement: `${monorepoRoot}/packages/template/packages/vue/src/index.ts`, stage: 'dev' as const },

      // API 接口管理包
      { find: /^@ldesign\/api-core\/(.+)$/, replacement: `${monorepoRoot}/packages/api/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/api-core', replacement: `${monorepoRoot}/packages/api/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/api-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/api/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/api-vue', replacement: `${monorepoRoot}/packages/api/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Validate 表单校验包
      { find: /^@ldesign\/validate-core\/(.+)$/, replacement: `${monorepoRoot}/packages/validate/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/validate-core', replacement: `${monorepoRoot}/packages/validate/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/validate-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/validate/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/validate-vue', replacement: `${monorepoRoot}/packages/validate/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Event 事件总线包
      { find: /^@ldesign\/event-core\/(.+)$/, replacement: `${monorepoRoot}/packages/event/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/event-core', replacement: `${monorepoRoot}/packages/event/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/event-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/event/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/event-vue', replacement: `${monorepoRoot}/packages/event/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Storage 统一存储包
      { find: /^@ldesign\/storage-core\/(.+)$/, replacement: `${monorepoRoot}/packages/storage/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/storage-core', replacement: `${monorepoRoot}/packages/storage/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/storage-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/storage/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/storage-vue', replacement: `${monorepoRoot}/packages/storage/packages/vue/src/index.ts`, stage: 'dev' as const },

      // WebSocket 通信包
      { find: /^@ldesign\/websocket-core\/(.+)$/, replacement: `${monorepoRoot}/packages/websocket/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/websocket-core', replacement: `${monorepoRoot}/packages/websocket/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/websocket-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/websocket/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/websocket-vue', replacement: `${monorepoRoot}/packages/websocket/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Config 配置管理包
      { find: /^@ldesign\/config-core\/(.+)$/, replacement: `${monorepoRoot}/packages/config/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/config-core', replacement: `${monorepoRoot}/packages/config/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/config-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/config/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/config-vue', replacement: `${monorepoRoot}/packages/config/packages/vue/src/index.ts`, stage: 'dev' as const },

      // Theme 设计令牌包
      { find: /^@ldesign\/theme-core\/(.+)$/, replacement: `${monorepoRoot}/packages/theme/packages/core/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/theme-core', replacement: `${monorepoRoot}/packages/theme/packages/core/src/index.ts`, stage: 'dev' as const },
      { find: /^@ldesign\/theme-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/theme/packages/vue/src/$1`, stage: 'dev' as const },
      { find: '@ldesign/theme-vue', replacement: `${monorepoRoot}/packages/theme/packages/vue/src/index.ts`, stage: 'dev' as const },
    ] satisfies AliasConfig[]) as any,
  },
})
