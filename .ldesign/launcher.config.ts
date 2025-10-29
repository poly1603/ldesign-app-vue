import { defineConfig } from '@ldesign/launcher'

// launcher 会自动检测并加载 Vue 插件，无需手动配置
export default defineConfig({
  resolve: {
    alias: [
      // 基本别名
      { find: '@', replacement: './src' },
    ],
  },

  server: {
    port: 3001,
    host: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue'],
        },
      },
    },
  },

  launcher: {
    autoRestart: true,
    logLevel: 'info',
  }
})

