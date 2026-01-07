/**
 * 认证状态管理 Composable
 *
 * 提供全局认证状态管理，包括：
 * - 用户登录状态
 * - 用户信息
 * - 菜单数据
 * - 登录/登出操作
 */

import { ref, computed, readonly } from 'vue'
import {
  fetchSid,
  getCaptchaUrl,
  loginByPassword,
  fetchUserInfo,
  fetchMenuList,
  logout as apiLogout,
  isLoggedIn as checkIsLoggedIn,
  clearSession,
  getUserInfoFromStorage,
  type LoginParams,
  type LoginResult,
  type UserInfo,
  type MenuItem,
} from '../api/leap/auth'

// ============================================================================
// 响应式状态（单例）
// ============================================================================

/** 用户信息 */
const userInfo = ref<UserInfo | null>(null)

/** 菜单列表 */
const menuList = ref<MenuItem[]>([])

/** 是否已登录 */
const loggedIn = ref(false)

/** 是否正在加载 */
const loading = ref(false)

/** 是否已初始化 */
const initialized = ref(false)

/** 验证码 URL */
const captchaUrl = ref('')

/** 错误信息 */
const error = ref<string | null>(null)

// ============================================================================
// Composable
// ============================================================================

/**
 * 使用认证状态
 */
export function useAuth() {
  // ==========================================================================
  // 计算属性
  // ==========================================================================

  /** 用户名 */
  const username = computed(() => userInfo.value?.fullName || userInfo.value?.detail?.fullname || '')

  /** 用户头像 */
  const avatar = computed(() => userInfo.value?.photo || userInfo.value?.detail?.photo || '')

  /** 用户ID */
  const userId = computed(() => userInfo.value?.userid || userInfo.value?.detail?.id || '')

  // ==========================================================================
  // 方法
  // ==========================================================================

  /**
   * 初始化认证状态
   * 检查本地存储的登录状态，如果已登录则获取用户信息和菜单
   */
  async function initAuth(): Promise<boolean> {
    if (initialized.value) {
      return loggedIn.value
    }

    loading.value = true
    error.value = null

    try {
      // 检查本地存储的登录状态
      if (checkIsLoggedIn()) {
        // 尝试从存储恢复用户信息
        const storedUserInfo = getUserInfoFromStorage()
        if (storedUserInfo) {
          userInfo.value = storedUserInfo
        }

        // 从服务器验证并获取最新用户信息
        const serverUserInfo = await fetchUserInfo()
        if (serverUserInfo && serverUserInfo.userid) {
          userInfo.value = serverUserInfo
          loggedIn.value = true

          // 获取菜单
          const menus = await fetchMenuList()
          menuList.value = menus
        } else {
          // 服务器验证失败，清除本地状态
          clearSession()
          userInfo.value = null
          loggedIn.value = false
          menuList.value = []
        }
      } else {
        loggedIn.value = false
        userInfo.value = null
        menuList.value = []
      }
    } catch (e) {
      console.error('[useAuth] initAuth error:', e)
      error.value = '初始化失败'
      loggedIn.value = false
    } finally {
      loading.value = false
      initialized.value = true
    }

    return loggedIn.value
  }

  /**
   * 准备登录（获取 SID 和验证码）
   */
  async function prepareLogin(): Promise<{ sid: string; captcha: string }> {
    loading.value = true
    error.value = null

    try {
      // 获取 SID
      const { sid } = await fetchSid()

      // 刷新验证码
      captchaUrl.value = getCaptchaUrl()

      return { sid, captcha: captchaUrl.value }
    } catch (e) {
      console.error('[useAuth] prepareLogin error:', e)
      error.value = '获取登录信息失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新验证码
   */
  function refreshCaptcha(): string {
    captchaUrl.value = getCaptchaUrl()
    return captchaUrl.value
  }

  /**
   * 执行登录
   */
  async function login(params: LoginParams): Promise<LoginResult> {
    loading.value = true
    error.value = null

    try {
      const result = await loginByPassword(params)

      if (result.type === 'success') {
        // 登录成功，获取用户信息和菜单
        const [serverUserInfo, menus] = await Promise.all([
          fetchUserInfo(),
          fetchMenuList(),
        ])

        if (serverUserInfo) {
          userInfo.value = serverUserInfo
          loggedIn.value = true
        }

        menuList.value = menus
      } else {
        // 登录失败，刷新验证码
        refreshCaptcha()
        error.value = result.message
      }

      return result
    } catch (e) {
      console.error('[useAuth] login error:', e)
      error.value = '登录失败，请重试'
      refreshCaptcha()
      return { code: '-1', type: 'error', message: '登录失败，请重试' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 退出登录
   */
  async function logout(): Promise<void> {
    loading.value = true

    try {
      await apiLogout()
    } catch (e) {
      console.error('[useAuth] logout error:', e)
    } finally {
      // 无论如何都清除本地状态
      userInfo.value = null
      menuList.value = []
      loggedIn.value = false
      initialized.value = false
      loading.value = false
    }
  }

  /**
   * 刷新用户信息
   */
  async function refreshUserInfo(): Promise<UserInfo | null> {
    try {
      const info = await fetchUserInfo()
      if (info) {
        userInfo.value = info
      }
      return info
    } catch (e) {
      console.error('[useAuth] refreshUserInfo error:', e)
      return null
    }
  }

  /**
   * 刷新菜单
   */
  async function refreshMenu(): Promise<MenuItem[]> {
    try {
      const menus = await fetchMenuList()
      menuList.value = menus
      return menus
    } catch (e) {
      console.error('[useAuth] refreshMenu error:', e)
      return []
    }
  }

  // ==========================================================================
  // 返回
  // ==========================================================================

  return {
    // 状态（只读）
    userInfo: readonly(userInfo),
    menuList: readonly(menuList),
    loggedIn: readonly(loggedIn),
    loading: readonly(loading),
    initialized: readonly(initialized),
    captchaUrl: readonly(captchaUrl),
    error: readonly(error),

    // 计算属性
    username,
    avatar,
    userId,

    // 方法
    initAuth,
    prepareLogin,
    refreshCaptcha,
    login,
    logout,
    refreshUserInfo,
    refreshMenu,
  }
}
