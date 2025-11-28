/**
 * 预发布环境应用配置
 *
 * 此配置会与基础配置（app.config.ts）深度合并
 * 预发布环境特点：
 * - 接近生产环境
 * - 保留部分调试功能
 * - 使用预发布 API
 * - 用于最终测试
 *
 * @see https://github.com/ldesign/launcher#app-config
 */
import { defineConfig } from '@ldesign/engine-vue3'

export default defineConfig({
  /**
   * 应用基本信息（覆盖基础配置）
   */
  app: {
    name: 'LDesign App (预发布)',
    description: 'LDesign 应用示例 - 预发布环境',
  },

  /**
   * 当前环境标识
   */
  environment: 'staging',

  /**
   * 预发布环境 API 配置
   */
  api: {
    baseUrl: 'https://staging-api.ldesign.example.com',
  },

  /**
   * 预发布环境功能开关
   */
  features: {
    debug: true,
    mock: false,
    performance: true,
  },

  /**
   * 预发布环境日志配置
   */
  log: {
    level: 'warn',
    console: true,
    report: true,
  },
})
