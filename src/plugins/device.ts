/**
 * 设备信息插件配置
 */
import { createDeviceEnginePlugin } from '@ldesign/device-vue/plugins'

/**
 * 创建设备信息插件
 */
export function createDevicePlugin() {
  return createDeviceEnginePlugin({
    enableResize: true,
    enableOrientation: true,
    modules: ['network', 'battery'],
    // debug 模式会输出大量日志，仅在需要时开启
    debug: false,
  })
}

