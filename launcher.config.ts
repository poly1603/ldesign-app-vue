import { defineConfig } from '@ldesign/launcher'
import vue from '@vitejs/plugin-vue'

/**
 * Launcher 配置文件
 * 使用 @ldesign/launcher 启动 Vue 应用
 */
export default defineConfig({
  // 项目根目录
  root: '.',

  // 公共资源目录
  publicDir: 'public',

  // Vite 插件配置
  plugins: [
    vue()
  ],

  // 路径别名配置
  resolve: {
    alias: [
      { find: '@ldesign/engine-core', replacement: '../../packages/engine/packages/core/src' },
      { find: '@ldesign/engine-vue', replacement: '../../packages/engine/packages/vue/src' },
    ],
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },

  // 开发服务器配置
  server: {
    port: 5172,
    open: true,
    cors: true,
  },

  // 预览服务器配置
  preview: {
    port: 4172,
    open: true,
  },

  // 优化配置 - 排除 engine 包避免预构建
  optimizeDeps: {
    exclude: ['@ldesign/engine-core', '@ldesign/engine-vue'],
  },

  // SSR 配置 - 强制内联 engine 包
  ssr: {
    noExternal: ['@ldesign/engine-core', '@ldesign/engine-vue'],
  },
})

