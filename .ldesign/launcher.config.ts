/**
 * LDesign Launcher 配置文件
 *
 * 用于配置开发服务器、构建选项等
 *
 * @see https://github.com/ldesign/launcher#readme
 */

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@ldesign/launcher'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 计算 monorepo 根目录
const monorepoRoot = resolve(__dirname, '../../..')
console.log('📁 Monorepo 根目录:', monorepoRoot)

export default defineConfig({
  /**
   * 开发服务器配置
   * launcher 会自动检测 Vue 3 框架，无需手动配置
   */
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    cors: true,
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
    ],
  },

  /**
   * 路径别名配置
   *
   * 配置 @ldesign 包的源码映射，实现开发模式下的实时更新
   * 修改包源码后无需重新构建，保存即可看到效果
   *
   * 注意：
   * 1. 使用正则表达式匹配子路径导入（如 @ldesign/router-vue/plugins）
   * 2. 别名顺序很重要：更具体的规则要放在前面
   *
   * 🔴 当前已禁用 @ldesign 包的 alias，使用打包产物进行测试
   */
  resolve: {
    alias: [
      // 项目内部 alias
      { find: '@', replacement: resolve(__dirname, '../src') },

      // ✅ 启用源码 alias，支持开发模式热更新
      // Engine 引擎包（支持子路径导入）
      { find: /^@ldesign\/engine-core\/(.+)$/, replacement: `${monorepoRoot}/packages/engine/packages/core/src/$1` },
      { find: '@ldesign/engine-core', replacement: `${monorepoRoot}/packages/engine/packages/core/src/index.ts` },
      { find: /^@ldesign\/engine-vue3\/(.+)$/, replacement: `${monorepoRoot}/packages/engine/packages/vue3/src/$1` },
      { find: '@ldesign/engine-vue3', replacement: `${monorepoRoot}/packages/engine/packages/vue3/src/index.ts` },

      // Router 路由包（支持子路径导入）
      { find: /^@ldesign\/router-core\/(.+)$/, replacement: `${monorepoRoot}/packages/router/packages/core/src/$1` },
      { find: '@ldesign/router-core', replacement: `${monorepoRoot}/packages/router/packages/core/src/index.ts` },
      { find: /^@ldesign\/router-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/router/packages/vue/src/$1` },
      { find: '@ldesign/router-vue', replacement: `${monorepoRoot}/packages/router/packages/vue/src/index.ts` },

      // I18n 国际化包（支持子路径导入）
      { find: /^@ldesign\/i18n-core\/(.+)$/, replacement: `${monorepoRoot}/packages/i18n/packages/core/src/$1` },
      { find: '@ldesign/i18n-core', replacement: `${monorepoRoot}/packages/i18n/packages/core/src/index.ts` },
      { find: /^@ldesign\/i18n-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/i18n/packages/vue/src/$1` },
      { find: '@ldesign/i18n-vue', replacement: `${monorepoRoot}/packages/i18n/packages/vue/src/index.ts` },

      // Color 颜色主题包（支持子路径导入）
      { find: /^@ldesign\/color-core\/(.+)$/, replacement: `${monorepoRoot}/packages/color/packages/core/src/$1` },
      { find: '@ldesign/color-core', replacement: `${monorepoRoot}/packages/color/packages/core/src/index.ts` },
      { find: /^@ldesign\/color-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/color/packages/vue/src/$1` },
      { find: '@ldesign/color-vue', replacement: `${monorepoRoot}/packages/color/packages/vue/src/index.ts` },

      // Size 尺寸配置包（支持子路径导入）
      { find: /^@ldesign\/size-core\/(.+)$/, replacement: `${monorepoRoot}/packages/size/packages/core/src/$1` },
      { find: '@ldesign/size-core', replacement: `${monorepoRoot}/packages/size/packages/core/src/index.ts` },
      { find: /^@ldesign\/size-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/size/packages/vue/src/$1` },
      { find: '@ldesign/size-vue', replacement: `${monorepoRoot}/packages/size/packages/vue/src/index.ts` },

      // HTTP 请求包（支持子路径导入）
      { find: /^@ldesign\/http-core\/(.+)$/, replacement: `${monorepoRoot}/packages/http/packages/core/src/$1` },
      { find: '@ldesign/http-core', replacement: `${monorepoRoot}/packages/http/packages/core/src/index.ts` },
      { find: /^@ldesign\/http-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/http/packages/vue/src/$1` },
      { find: '@ldesign/http-vue', replacement: `${monorepoRoot}/packages/http/packages/vue/src/index.ts` },

      // Device 设备检测包（支持子路径导入）
      { find: /^@ldesign\/device-core\/(.+)$/, replacement: `${monorepoRoot}/packages/device/packages/core/src/$1` },
      { find: '@ldesign/device-core', replacement: `${monorepoRoot}/packages/device/packages/core/src/index.ts` },
      { find: /^@ldesign\/device-vue\/(.+)$/, replacement: `${monorepoRoot}/packages/device/packages/vue/src/$1` },
      { find: '@ldesign/device-vue', replacement: `${monorepoRoot}/packages/device/packages/vue/src/index.ts` },
    ],
  },
})
