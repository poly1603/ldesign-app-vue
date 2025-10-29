import { defineConfig } from '@ldesign/launcher'

// 开发环境特定配置
export default defineConfig({
  server: {
    open: true,
  },

  launcher: {
    logLevel: 'debug',
    hooks: {
      beforeStart: () => {
        console.log('🚀 正在启动 Vue 开发服务器...')
      },
      afterStart: () => {
        console.log('✅ Vue 开发服务器启动成功！')
      }
    }
  }
})

