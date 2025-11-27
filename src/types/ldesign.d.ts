/**
 * @ldesign 包的类型声明
 */

declare module '@ldesign/router-vue/plugins' {
  export function createRouterEnginePlugin(options: any): any
}

declare module '@ldesign/i18n-vue/plugins' {
  export function createI18nEnginePlugin(options: any): any
}

declare module '@ldesign/color-vue/plugins' {
  export function createColorEnginePlugin(options: any): any
}

declare module '@ldesign/size-vue/plugins' {
  export function createSizeEnginePlugin(options: any): any
}

declare module '@ldesign/http-vue' {
  export function createHttpEnginePlugin(options: any): any
}

declare module '@ldesign/device-vue/plugins' {
  export function createDeviceEnginePlugin(options: any): any
}
