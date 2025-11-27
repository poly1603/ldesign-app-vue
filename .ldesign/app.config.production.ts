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
 */
export default {
  /**
   * 应用基本信息
   */
  app: {
    name: 'LDesign App',
    description: 'LDesign 应用示例 - 生产环境',
    environment: 'production',
  },
}
