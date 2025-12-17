/**
 * API 模块入口
 *
 * 导出所有 API 配置和定义
 */

// 导出服务器配置
export {
  jsonApiServer,
  lpomServer,
  lroaServer,
  servers,
} from './config'

// 导出 RESTful API
export {
  userApis,
  postApis,
  getUserPostsApi,
} from './config'

// 导出类型
export type {
  User,
  Post,
  MonthWorkdayData,
  LeapUserInfo,
  ModuleOperation,
} from './config'

// 导出 LEAP API
export {
  getMonthWorkdayApi,
  getCurrentUserApi,
  getModuleOperationsApi,
} from './config'

// 导出所有 API 列表
export { apis } from './config'

// 重新导出 @ldesign/api-vue 的常用功能
export {
  useApi,
  useLeapApi,
  useRestfulApi,
  useApiManager,
  createLeapCaller,
  createRestfulResource,
} from '@ldesign/api-vue'
