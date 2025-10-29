import { defineConfig } from '@ldesign/launcher'

// 生产环境特定配置
export default defineConfig({
  build: {
    minify: true,
    sourcemap: false,
  },

  launcher: {
    logLevel: 'warn',
  }
})

