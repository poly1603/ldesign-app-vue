/**
 * 应用入口文件
 */
import { createVueEngine } from '@ldesign/engine-vue3'
import { getLoggerInstance } from '@ldesign/logger-vue/plugins'
import App from './App.vue'
import { createEnginePlugins } from './plugins'
import './style.css'

// 创建引擎并配置插件
// @ts-ignore - 开发环境使用源码导致类型问题
const engine = createVueEngine({
  name: 'LDesign App',
  // 关闭 debug 模式以避免性能监控的慢操作警告
  // 如需调试可临时开启
  debug: false,
  app: {
    rootComponent: App,
  },
  plugins: createEnginePlugins(),
})

// 挂载应用
await engine.mount('#app')

// 获取日志器实例（通过引擎插件创建）
const logger = getLoggerInstance()

// 使用日志器记录应用启动
logger?.info('🚀 LDesign App 已启动', {
  environment: import.meta.env.MODE,
  version: '1.0.0',
})

// 监听语言变化事件
engine.events.on('i18n:localeChanged', (payload) => {
  logger?.info('🌐 语言已变更', payload)
})

// 开发环境调试
if (import.meta.env.DEV) {
  // 暴露引擎和日志器到 window
  ; (window as any).engine = engine
    ; (window as any).logger = logger

  // 暴露各个服务方便调试
  const serviceNames = ['i18n', 'color', 'size', 'http', 'device', 'template', 'logger']

  serviceNames.forEach((name) => {
    const service = (engine.api as any).get(name)
    if (service) {
      ; (window as any)[name] = service
      logger?.debug(`✅ ${name.charAt(0).toUpperCase() + name.slice(1)} service initialized`)

      // 输出设备信息
      if (name === 'device' && service.getDeviceInfo) {
        logger?.debug('📱 Device info', service.getDeviceInfo())
      }
    }
  })

  // 开发环境提示
  logger?.info('💡 开发模式：可通过 window.logger 访问日志器实例')
}
