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
  szwsldServer,
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
  LeapUserInfo as LegacyLeapUserInfo,
  ModuleOperation,
} from './config'

// 导出 LEAP API
export {
  getMonthWorkdayApi,
  getCurrentUserApi,
  getModuleOperationsApi,
} from './config'

// 导出 SZWSLD LEAP API
export {
  // API 函数
  fetchSid,
  getCaptchaUrl,
  loginByPassword,
  fetchUserInfo,
  fetchMenuList,
  logout,
  // Session 管理
  getSid,
  getLid,
  saveSid,
  saveLid,
  saveUserInfo,
  getUserInfoFromStorage,
  clearSession,
  isLoggedIn,
  // API 集合
  authApis,
} from './leap'

// LEAP 类型
export type {
  LoginParams,
  LoginResult,
  UserInfo as LeapUserInfo,
  MenuItem as LeapMenuItem,
} from './leap'

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
