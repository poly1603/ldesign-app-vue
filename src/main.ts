/**
 * 应用入口文件
 */
import { createVueEngine } from '@ldesign/engine-vue3'
import App from './App.vue'
import { createEnginePlugins } from './plugins'
import './style.css'

// 创建引擎并配置插件
// @ts-ignore - 开发环境使用源码导致类型问题
const engine = createVueEngine({
  name: 'LDesign App',
  debug: true,
  app: {
    rootComponent: App,
  },
  plugins: createEnginePlugins(),
})

// 挂载应用
await engine.mount('#app')

// 监听语言变化事件
engine.events.on('i18n:localeChanged', (payload) => {
  console.log('🌐 [i18n] Locale changed:', payload)
})

// 开发环境调试
if (import.meta.env.DEV) {
  // 暴露引擎到 window
  (window as any).engine = engine

  // 暴露各个服务方便调试
  const serviceNames = ['i18n', 'color', 'size', 'http', 'device']

  serviceNames.forEach((name) => {
    const service = (engine.api as any).get(name)
    if (service) {
      (window as any)[name] = service
      console.log(`✅ ${name.charAt(0).toUpperCase() + name.slice(1)} service initialized`)

      // 输出设备信息
      if (name === 'device' && service.getDeviceInfo) {
        console.log('📱 Device info:', service.getDeviceInfo())
      }
    }
  })
}
