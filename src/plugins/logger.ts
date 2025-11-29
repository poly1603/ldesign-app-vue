/**
 * Logger 日志插件配置
 * @description 配置增强的日志系统，支持美化控制台输出和开发模式日志桥接
 */
import { createLoggerEnginePlugin } from '@ldesign/logger-vue/plugins'
import {
  ConsoleTransport,
  DevBridgeTransport,
  LogLevel,
} from '@ldesign/logger-core'

/** 是否为开发环境 */
const isDev = import.meta.env.DEV

/**
 * 创建日志插件
 * @description 创建配置了增强控制台输出和开发桥接的日志插件
 */
export function createLoggerPlugin() {
  // 创建增强的控制台传输器
  const consoleTransport = new ConsoleTransport({
    level: isDev ? LogLevel.DEBUG : LogLevel.WARN,
    colors: true,
    timestamp: true,
    showBadges: isDev, // 开发模式显示徽章
    showIcons: isDev, // 开发模式显示图标
    useGroup: isDev, // 开发模式使用分组
    prettyData: isDev, // 开发模式美化数据输出
    isDev,
  })

  // 创建传输器列表
  const transports = [consoleTransport]

  // 开发模式添加桥接传输器（用于与 launcher 通信）
  if (isDev) {
    const devBridgeTransport = new DevBridgeTransport({
      level: LogLevel.DEBUG,
      wsUrl: 'ws://localhost:9527/__dev_logger',
      autoReconnect: true,
      batchSize: 20,
      batchInterval: 500,
    })
    transports.push(devBridgeTransport)
  }

  return createLoggerEnginePlugin({
    name: 'LDesignApp',
    level: isDev ? LogLevel.DEBUG : LogLevel.WARN,
    transports,
    enableErrorTracking: true,
    // 关闭性能监控以避免与 Engine 内部性能监控冲突
    enablePerformanceMonitoring: false,
    enableRouterTracking: true,
    enableVueErrorHandler: isDev,
    enableVueWarnHandler: isDev,
    debug: false,
  })
}

