/**
 * 开发环境应用配置
 *
 * 此配置会与基础配置（app.config.ts）深度合并
 * 开发环境特点：
 * - 启用调试功能
 * - 启用 Mock 数据
 * - 详细的日志输出
 * - 本地 API 地址
 *
 * @see https://github.com/ldesign/launcher#app-config
 */
import { defineConfig } from '@ldesign/engine-vue3'

export default defineConfig({
  /**
   * 应用基本信息（覆盖基础配置）
   */
  app: {
    name: 'LDesign App (开发)',
    description: 'LDesign 应用示例 - 开发环境',
  },

  /**
   * 当前环境标识
   */
  environment: 'development',

  /**
   * 开发环境 API 配置
   */
  api: {
    baseUrl: 'http://localhost:8080/api',
  },

  /**
   * 开发环境功能开关
   */
  features: {
    debug: true,
    mock: true,
  },

  /**
   * 开发环境日志配置
   */
  log: {
    level: 'debug',
    console: true,
  },
})
