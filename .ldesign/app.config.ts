/**
 * 应用基础配置
 *
 * 此配置会被自动注入到应用中，可通过 import.meta.env.appConfig 访问
 * 支持 HMR 热更新
 *
 * @see https://github.com/ldesign/launcher#app-config
 */
import { defineConfig } from '@ldesign/engine-vue3'

export default defineConfig({
  /**
   * 应用基本信息
   */
  app: {
    name: 'LDesign App',
    version: '1.0.0',
    description: 'LDesign 应用示例',
    author: 'LDesign Team',
    homepage: 'https://ldesign.example.com',
  },

  /**
   * API 配置
   */
  api: {
    baseUrl: '/api',
    timeout: 30000,
  },

  /**
   * 功能开关
   */
  features: {
    debug: false,
    mock: false,
  },

  /**
   * 主题配置
   */
  theme: {
    mode: 'auto',
    primaryColor: '#1890ff',
  },
})
