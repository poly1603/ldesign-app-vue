/**
 * LEAP API 模块
 *
 * 导出所有 LEAP RPC 相关的 API 定义
 */

// 认证相关 API
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
} from './auth'

// LEAP 请求核心模块
export {
  leapLoginRequest,
  leapGetSidRequest,
  leapRpcRequest,
  decodeLeapResponse,
  leapConfig,
  getRandomId,
  getUuid,
} from './request'

// 类型重新导出
export type {
  LoginParams,
  LoginResult,
  UserInfo,
  MenuItem,
} from './auth'
