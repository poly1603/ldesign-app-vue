/**
 * 开发环境应用配置
 *
 * 此配置会与基础配置（app.config.ts）深度合并
 * 开发环境特点：
 * - 启用调试功能
 * - 启用 Mock 数据
 * - 详细的日志输出
 * - 本地 API 地址
 */
export default {
  /**
   * 应用基本信息
   */
  app: {
    name: 'LDesign App (开发) - ✅ 热更新成功',
    description: 'LDesign 应用示例 - 开发环境 - 热更新功能正常工作',
    environment: 'development',
    testField: '热更新测试字段',
    timestamp: new Date().toISOString(),
    hmrTest: '这是通过热更新添加的新字段！',
    test: '132323',
    a: '1',
  },
}
