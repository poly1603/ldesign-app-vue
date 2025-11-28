/**
 * 生产环境应用配置
 *
 * 此配置会与基础配置（app.config.ts）深度合并
 * 生产环境特点：
 * - 关闭调试功能
 * - 关闭 Mock 数据
 * - 最小日志输出
 * - 生产 API 地址
 * - 启用性能优化
 *
 * @see https://github.com/ldesign/launcher#app-config
 */
import { defineConfig } from '@ldesign/engine-vue3'

export default defineConfig({
  /**
   * 应用基本信息（覆盖基础配置）
   */
  app: {
    name: 'LDesign App',
    description: 'LDesign 应用示例 - 生产环境',
  },

  /**
   * 当前环境标识
   */
  environment: 'production',

  /**
   * 生产环境 API 配置
   */
  api: {
    baseUrl: 'https://api.ldesign.example.com',
  },

  /**
   * 生产环境功能开关
   */
  features: {
    debug: false,
    mock: false,
    performance: true,
    errorReporting: true,
  },

  /**
   * 生产环境日志配置
   */
  log: {
    level: 'error',
    console: false,
    report: true,
  },
})
