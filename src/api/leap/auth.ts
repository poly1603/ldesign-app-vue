/**
 * SZWSLD 系统认证相关 API
 *
 * 参考 ldesign-all/packages/shared/api/src/modules/user/index.ts 实现
 * 包含登录、获取用户信息、获取菜单等接口
 */

import {
  leapLoginRequest,
  leapGetSidRequest,
  leapRpcRequest,
  decodeLeapResponse,
  leapConfig,
  getSid,
  saveSid,
  getLid,
  saveLid,
  clearSession,
  isLoggedIn,
  getRandomId,
  Md5Code,
} from './request'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 登录参数
 */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码（明文，会自动 MD5 加密） */
  password: string
  /** 验证码 */
  captcha?: string
  /** 是否记住密码 */
  remember?: boolean
}

/**
 * 登录结果
 */
export interface LoginResult {
  /** 结果代码 */
  code: string
  /** 结果类型 */
  type: 'success' | 'error' | 'warning'
  /** 结果消息 */
  message: string
}

/**
 * 通用用户信息接口
 * 
 * 设计为通用结构，可兼容 LEAP 和 RESTful API
 */
export interface UserInfo {
  /** 用户 ID */
  id: string
  /** 用户名/用户标识 */
  username: string
  /** 显示名称/全名 */
  displayName: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 头像 URL */
  avatar?: string
  /** 性别: male/female/unknown */
  gender?: 'male' | 'female' | 'unknown'
  /** 生日 */
  birthday?: string
  /** 组织/部门信息 */
  organization?: {
    id: string
    name: string
    code?: string
  }
  /** 职位信息 */
  position?: {
    id: string
    name: string
  }
  /** 角色列表 */
  roles?: Array<{
    id: string
    name: string
    code?: string
  }>
  /** 权限列表 */
  permissions?: string[]
  /** 账号状态: active/inactive/locked/expired */
  status?: 'active' | 'inactive' | 'locked' | 'expired'
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
  /** 最后登录时间 */
  lastLoginAt?: string
  /** 扩展信息（用于存储特定系统的额外数据） */
  extra?: Record<string, unknown>
}

/**
 * LEAP 系统原始用户信息
 * 
 * 保留 LEAP 返回的原始结构，用于转换
 */
export interface LeapRawUserInfo {
  /** 应用名称 */
  applicationname?: string
  /** 应用代码 */
  applictioncode?: string
  /** 全名 */
  fullName?: string
  /** 手机号 */
  mobilephone?: string
  /** 组织ID */
  orgid?: string
  /** 组织中文名 */
  orgCNName?: string
  /** 组织英文名 */
  orgENName?: string
  /** 组织系统编码 */
  orgsyscode?: string
  /** 详细信息 */
  detail?: {
    id?: string
    userflag?: string
    usercode?: string
    fullname?: string
    mobilephone?: string
    photo?: string
    sex?: string
    birthday?: string
    extinfo?: string
    isvalid?: string
    createtime?: string
    updatetime?: string
    lastlogintime?: string
    lastloginip?: string
    areaid?: string
    workaddress?: string
    [key: string]: unknown
  }
  /** 角色列表 */
  roles?: Array<{
    id?: string
    name?: string
    [key: string]: unknown
  }>
  /** 职位列表 */
  positions?: Array<{
    id?: string
    name?: string
    [key: string]: unknown
  }>
  /** 父组织列表 */
  parentorgs?: Array<{
    id?: string
    name?: string
    [key: string]: unknown
  }>
  /** 是否组织 */
  isorg?: number
  /** 是否停用 */
  isstoped?: number
  /** 过期状态 */
  expiredstatus?: number
  /** 强制修改密码 */
  forcechangepwd?: number
  /** 时间戳 */
  datetime?: number
  /** 其他属性 */
  [key: string]: unknown
}

/**
 * 原始菜单项（从服务端返回）
 */
export interface RawMenuItem {
  /** 菜单 ID */
  id?: string
  /** 父菜单 ID */
  refid?: string
  /** 菜单名称 */
  name?: string
  /** 显示名称 */
  showname?: string
  /** 文本 */
  text?: string
  /** 菜单路径 */
  path?: string
  /** Vue 模块路径 */
  vmodulepath?: string
  /** 组件名 */
  vmodulename?: string
  /** 图标 */
  icon?: string
  /** 排序 */
  orderid?: number | string
  /** 是否有子菜单 */
  haschild?: string
  /** 系统编码 */
  syscode?: string
  /** 资源类型 */
  resourcetype?: string
  /** 自定义配置 */
  customize?: string
  /** 集群名 */
  clustername?: string
  /** 其他属性 */
  [key: string]: unknown
}

/**
 * 转换后的菜单项
 */
export interface MenuItem {
  /** 菜单 ID */
  id: string
  /** 父菜单 ID */
  parentId?: string | null
  /** 菜单名称（路由名，PascalCase） */
  name: string
  /** 菜单标题（显示名） */
  title: string
  /** 菜单路径（路由 path，kebab-case） */
  path: string
  /** Vue 组件路径（用于动态导入） */
  component?: string
  /** 组件名称 */
  componentName?: string
  /** 图标 */
  icon?: string
  /** 排序 */
  order?: number
  /** 是否有子菜单 */
  hasChild?: boolean
  /** 子菜单 */
  children?: MenuItem[]
  /** 资源类型 */
  resourceType?: string
  /** 元数据 */
  meta?: {
    id?: string
    title?: string
    icon?: string
    /** Vue 组件路径 */
    component?: string
    /** 组件名称 */
    componentName?: string
    hasChild?: boolean
    resourcetype?: string
    /** 自定义配置 */
    props?: Record<string, unknown>
    /** 集群名 */
    clusterName?: string
    [key: string]: unknown
  }
  /** 其他属性 */
  [key: string]: unknown
}

// ============================================================================
// 登录消息映射
// ============================================================================

/** 登录结果消息映射 */
const LOGIN_MESSAGES: Record<string, LoginResult> = {
  '1': { code: '1', type: 'success', message: '登录成功！' },
  '-1': { code: '-1', type: 'error', message: '错误的用户名或密码' },
  '-2': { code: '-2', type: 'error', message: '错误的用户名或密码' },
  '-3': { code: '-3', type: 'error', message: '错误的用户名或密码' },
  '-4': { code: '-4', type: 'error', message: '错误的用户名或密码' },
  '-5': { code: '-5', type: 'warning', message: '验证码不能为空' },
  '-6': { code: '-6', type: 'error', message: '验证码错误' },
  '-7': { code: '-7', type: 'error', message: '系统授权已过期，请联系管理员' },
  '-8': { code: '-8', type: 'error', message: '错误的用户名或密码' },
  '-9': { code: '-9', type: 'error', message: '错误的用户名或密码' },
  '-10': { code: '-10', type: 'error', message: '无效的用户名' },
  '-11': { code: '-11', type: 'error', message: '用户与系统区域不匹配,请联系管理员' },
  '-12': { code: '-12', type: 'error', message: '用户与系统区域不匹配,请联系管理员' },
  '-13': { code: '-13', type: 'error', message: 'IP地址禁止访问' },
}

/**
 * 获取登录结果消息
 */
function getLoginMessage(code: string): LoginResult {
  // 处理带锁定时间的情况 (如 "-100,60")
  if (code.startsWith('-100')) {
    const time = code.split(',')[1] || '60'
    return { code: '-100', type: 'error', message: `帐号已被锁定，请${time}秒后再登录` }
  }
  if (code.startsWith('-101')) {
    const time = code.split(',')[1] || '5'
    return { code: '-101', type: 'error', message: `IP地址登录异常，请${time}分钟后再试` }
  }
  return LOGIN_MESSAGES[code] || { code, type: 'error', message: '登录失败，请重试' }
}

// ============================================================================
// 用户信息转换工具
// ============================================================================

/**
 * 将 LEAP 原始用户信息转换为通用格式
 * 
 * @param raw - LEAP 返回的原始用户数据
 * @returns 通用格式的用户信息
 */
export function transformLeapUserInfo(raw: LeapRawUserInfo): UserInfo {
  const detail = raw.detail || {}

  // 解析 extinfo JSON
  let extinfo: Record<string, unknown> = {}
  if (detail.extinfo) {
    try {
      extinfo = JSON.parse(detail.extinfo)
    } catch {
      // 忽略解析失败
    }
  }

  // 性别转换
  const genderMap: Record<string, 'male' | 'female' | 'unknown'> = {
    '1': 'male',
    '0': 'female',
    'male': 'male',
    'female': 'female',
    '男': 'male',
    '女': 'female',
  }
  const gender = detail.sex ? (genderMap[detail.sex] || 'unknown') : undefined

  // 账号状态转换
  let status: UserInfo['status'] = 'active'
  if (raw.isstoped === 1) {
    status = 'inactive'
  } else if (raw.expiredstatus === 1) {
    status = 'expired'
  } else if (detail.isvalid === '0') {
    status = 'locked'
  }

  // 转换角色
  const roles = raw.roles?.map(r => ({
    id: r.id || '',
    name: r.name || '',
    code: r.id,
  })).filter(r => r.id) || []

  // 转换职位（取第一个）
  const position = raw.positions?.[0]
    ? {
      id: raw.positions[0].id || '',
      name: raw.positions[0].name || '',
    }
    : undefined

  return {
    // 基本信息
    id: detail.id || '',
    username: detail.userflag || detail.usercode || '',
    displayName: raw.fullName || detail.fullname || detail.userflag || '',

    // 联系信息
    phone: raw.mobilephone || detail.mobilephone,
    email: undefined, // LEAP 中无邮箱字段
    avatar: detail.photo,

    // 个人信息
    gender,
    birthday: detail.birthday,

    // 组织信息
    organization: raw.orgid
      ? {
        id: raw.orgid,
        name: raw.orgCNName || raw.orgENName || '',
        code: raw.orgsyscode,
      }
      : undefined,

    // 职位和角色
    position,
    roles,
    permissions: [], // LEAP 权限需要单独获取

    // 状态信息
    status,
    createdAt: detail.createtime,
    updatedAt: detail.updatetime,
    lastLoginAt: detail.lastlogintime,

    // 扩展信息（保留 LEAP 特有数据）
    extra: {
      // LEAP 特有字段
      applicationname: raw.applicationname,
      applictioncode: raw.applictioncode,
      lastloginip: detail.lastloginip,
      workaddress: detail.workaddress,
      areaid: detail.areaid,
      usercode: detail.usercode,
      forcechangepwd: raw.forcechangepwd === 1,
      // 用户自定义配置
      userSettings: extinfo,
      // 原始数据（以备不时之需）
      _raw: raw,
    },
  }
}

// ============================================================================
// 菜单转换工具
// ============================================================================

/**
 * 获取真实系统编码
 * 参考 Leap.getRealSyscode
 * syscode 格式类似 "01.001002"，用 . 分隔前缀和编码，每3位一级
 */
function getRealSyscode(syscode: string | null): string {
  if (syscode == null || syscode.trim() === '') return ''

  if (syscode.includes('.')) {
    const pre = syscode.substring(0, syscode.indexOf('.'))
    let sub = syscode.substring(syscode.indexOf('.') + 1)

    // 补齐到3的倍数
    while (sub.length % 3 !== 0) {
      sub += '0'
    }

    // 去除末尾的 "000"
    while (sub.length > 0 && sub.substring(sub.length - 3) === '000') {
      sub = sub.substring(0, sub.length - 3)
    }

    return sub === '' ? pre : `${pre}.${sub}`
  }

  return syscode
}

/**
 * 获取父级系统编码
 * 参考 Leap.getParentSyscode
 * 每3位一级，删除最后3位得到父级编码
 */
function getParentSyscode(syscode: string | null): string {
  if (!syscode || !syscode.includes('.')) return ''

  // 删除最后3位
  const ret = syscode.substring(0, syscode.length - 3)

  // 如果最后一个字符是 '.'  ，去除它
  if (ret.charAt(ret.length - 1) === '.') {
    return ret.substring(0, ret.length - 1)
  }

  return ret
}

/**
 * 将字符串转换为 PascalCase
 */
function toPascalCase(str: string): string {
  if (!str) return ''
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase())
}

/**
 * 将字符串转换为 kebab-case
 */
function toKebabCase(str: string): string {
  if (!str) return ''
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

/**
 * 安全解析 JSON
 */
function parseJsonSafely(jsonString: string): Record<string, unknown> {
  if (!jsonString) return {}
  try {
    return JSON.parse(jsonString)
  } catch {
    return {}
  }
}

/**
 * 根据 orderid 排序
 */
function sortByOrderId<T extends { orderid?: number | string }>(arr: T[]): T[] {
  if (!arr || !Array.isArray(arr)) return []
  return [...arr].sort((a, b) => {
    const aOrder = Number(a.orderid || 0)
    const bOrder = Number(b.orderid || 0)
    return aOrder - bOrder
  })
}

/**
 * 转换原始菜单项为标准格式
 * 
 * 字段映射：
 * - name: 原始 name 转 PascalCase（用于路由名）
 * - path: 基于父路径 + name 拼接（kebab-case）
 * - component: vmodulepath（Vue 组件路径）
 * - componentName: vmodulename（组件名称）
 */
function convertMenuItem(raw: RawMenuItem, parent?: MenuItem): MenuItem {
  const name = toPascalCase(raw.name || '')
  const title = (raw.showname || raw.text || raw.name || '').replace(/\s+/g, '')
  const parentPath = parent?.path || ''
  // 路由路径：基于父路径 + 当前 name 拼接
  const path = parentPath ? `${parentPath}/${toKebabCase(name)}` : `/${toKebabCase(name)}`

  // 解析自定义配置
  const customProps = parseJsonSafely(raw.customize || '{}')

  return {
    id: raw.id || '',
    parentId: raw.refid || null,
    name,
    title,
    path,
    // Vue 组件路径（用于动态 import）
    component: raw.vmodulepath || undefined,
    // 组件名称
    componentName: raw.vmodulename || undefined,
    icon: raw.icon || undefined,
    order: Number(raw.orderid || 0),
    hasChild: raw.haschild === '1',
    resourceType: raw.resourcetype || undefined,
    meta: {
      id: raw.id,
      title,
      icon: raw.icon,
      // Vue 组件路径
      component: raw.vmodulepath,
      // 组件名称
      componentName: raw.vmodulename,
      hasChild: raw.haschild === '1',
      resourcetype: raw.resourcetype,
      // 自定义配置
      props: customProps,
      // 集群名
      clusterName: raw.clustername,
    },
  }
}

/**
 * 将平面菜单列表转换为树形结构（使用 children 字段）
 */
export function transformMenuList(rawMenus: RawMenuItem[]): MenuItem[] {
  if (!rawMenus || rawMenus.length === 0) return []

  console.log('[transformMenuList] Input menus count:', rawMenus.length)

  // 1. 排序
  const sorted = sortByOrderId(rawMenus)

  // 2. 添加 realCode 和 parentCode
  const codeMap = new Map<string, RawMenuItem>()
  for (const menu of sorted) {
    const realCode = getRealSyscode(menu.syscode || null)
    if (realCode) {
      ; (menu as any).realCode = realCode
      codeMap.set(realCode, menu)
    }
  }

  console.log('[transformMenuList] codeMap size:', codeMap.size)
  console.log('[transformMenuList] Sample syscodes:', sorted.slice(0, 3).map(m => ({ name: m.name, syscode: m.syscode, realCode: (m as any).realCode })))

  for (const menu of sorted) {
    const realCode = (menu as any).realCode
    if (realCode) {
      const parentCode = getParentSyscode(realCode)
      if (parentCode) {
        ; (menu as any).parentCode = parentCode
      }
    }
  }

  console.log('[transformMenuList] Sample parent codes:', sorted.slice(0, 5).map(m => ({ name: m.name, realCode: (m as any).realCode, parentCode: (m as any).parentCode })))

  // 3. 构建父子关系映射
  const childrenMap = new Map<string, RawMenuItem[]>()
  const topMenus: RawMenuItem[] = []

  for (const menu of sorted) {
    const parentCode = (menu as any).parentCode
    const hasParentInMap = parentCode && codeMap.has(parentCode)

    if (!parentCode || !hasParentInMap || menu.refid) {
      // 顶级菜单
      topMenus.push(menu)
    } else {
      // 子菜单
      const parentMenu = codeMap.get(parentCode)
      if (parentMenu?.id) {
        const children = childrenMap.get(parentMenu.id) || []
        children.push(menu)
        childrenMap.set(parentMenu.id, children)
      }
    }
  }

  console.log('[transformMenuList] Top menus count:', topMenus.length)
  console.log('[transformMenuList] Top menus:', topMenus.map(m => m.name))
  console.log('[transformMenuList] childrenMap size:', childrenMap.size)

  // 4. 递归构建菜单树
  function buildTree(rawMenu: RawMenuItem, parent?: MenuItem): MenuItem {
    const menuItem = convertMenuItem(rawMenu, parent)
    const childRaws = childrenMap.get(rawMenu.id || '')

    if (childRaws && childRaws.length > 0) {
      menuItem.children = childRaws.map(child => buildTree(child, menuItem))
    }

    return menuItem
  }

  // 5. 构建所有顶级菜单
  const result = topMenus.map(menu => buildTree(menu))

  console.log('[transformMenuList] Result count:', result.length)
  console.log('[transformMenuList] Result with children:', result.map(m => ({ name: m.name, childrenCount: m.children?.length || 0 })))

  // 6. 过滤掉特定类型的菜单（如资源类型 22, 18）
  return result.filter(menu => !['22', '18'].includes(menu.meta?.resourcetype || ''))
}

// ============================================================================
// 用户信息存储
// ============================================================================

const USERINFO_KEY = `${leapConfig.context}__userInfo`

/**
 * 保存用户信息到 sessionStorage
 */
export function saveUserInfo(userInfo: UserInfo): void {
  sessionStorage.setItem(USERINFO_KEY, JSON.stringify(userInfo))
}

/**
 * 从 sessionStorage 获取用户信息
 */
export function getUserInfoFromStorage(): UserInfo | null {
  const data = sessionStorage.getItem(USERINFO_KEY)
  return data ? JSON.parse(data) : null
}

// ============================================================================
// API 函数
// ============================================================================

/**
 * 获取系统 SID
 *
 * 参考 ldesign-all/packages/shared/api/src/modules/user/index.ts 中的 UserApi.getSid
 * 在登录前必须先调用此方法获取 SID
 *
 * 关键：请求发送到 RPC 端点，参数放在 QS 请求头中
 */
export async function fetchSid(): Promise<{ sid: string; lid: string }> {
  // 清理旧数据（和原始实现一致）
  localStorage.removeItem(`${leapConfig.context}__sid`)
  localStorage.removeItem(`${leapConfig.context}__servertime`)

  // 使用专门的 getSid 请求函数
  const response = await leapGetSidRequest()

  const text = await response.text()

  if (!response.ok) {
    const url = `/${leapConfig.context}/${leapConfig.rpcPath}`
    throw new Error(
      `[LEAP] fetchSid failed: ${response.status} ${response.statusText}, url=${url}, response=${text.substring(0, 200)}`
    )
  }

  // 响应格式: "sid:serverTime"
  const sid = text.split(':')[0] || ''

  if (sid) {
    saveSid(sid)
  }

  const lid = getLid()

  return { sid, lid }
}

/**
 * 获取图片验证码 URL
 *
 * 参考 ldesign-all/packages/shared/api/src/modules/user/index.ts 中的 UserApi.getCaptcha
 */
export function getCaptchaUrl(): string {
  const lid = getLid()
  const randomId = getRandomId()
  // 关键：验证码 URL 格式
  const base = `/${leapConfig.context}/logic/va/${randomId}.do`
  return lid ? `${base}?lid=${lid}` : base
}

/**
 * 密码登录
 *
 * 参考 ldesign-all/packages/shared/api/src/modules/user/index.ts 中的 UserApi.loginByPassword
 */
export async function loginByPassword(params: LoginParams): Promise<LoginResult> {
  const { username, password, captcha = '' } = params

  // 验证参数
  if (!username) {
    return { code: '-100', type: 'error', message: '用户名不能为空!' }
  }
  if (!password) {
    return { code: '-100', type: 'error', message: '密码不能为空!' }
  }

  // 获取 SID
  let sid = getSid()
  if (!sid) {
    const result = await fetchSid()
    sid = result.sid
  }

  if (!sid) {
    return { code: '-1000', type: 'error', message: 'SID获取失败!' }
  }

  // MD5 加密密码 - 使用 LEAP 专用的 Md5Code
  const passwordMd5 = new Md5Code(password).getValue()
  console.log('[Login] 原始密码:', password)
  console.log('[Login] MD5加密后:', passwordMd5)

  // 构建请求数据 - 关键格式
  const requestData = `['${username}', '${passwordMd5}', '${leapConfig.systemName}', 0, '${captcha}', '${leapConfig.area}']`
  console.log('[Login] requestData:', requestData)

  const encodedData = encodeURIComponent(encodeURIComponent(escape(requestData)))
  console.log('[Login] encodedData:', encodedData)

  const randomId = getRandomId()

  // 构建 URL 查询参数
  const queryParams = [
    `sid=${sid}`,
    'service=leap',
    'method=app_systemloginWithSystemName',
    'callService=leap',
    'returnJSON=false',
    `clientID=${randomId}`,
    `requestData=${encodedData}`,
  ].join('&')
  console.log('[Login] 完整URL参数:', queryParams)

  // 关键：登录请求发送到 RPC 端点，参数在 URL query string 中
  const response = await leapLoginRequest(queryParams)
  const responseType = response.headers.get('resptype')
  const text = await response.text()

  console.log('[Login] 响应头 resptype:', responseType)
  console.log('[Login] 原始响应:', text)

  // 如果响应是编码的，需要解码
  let result: string = text
  if (responseType === '1') {
    const decoded = decodeLeapResponse<string | number>(text)
    result = String(decoded)
    console.log('[Login] 解码后:', result)
  }

  // 解析登录结果，处理可能的逗号分隔情况（如 "1,xxx"）
  const code = result.includes(',') ? result.split(',')[0] : result
  console.log('[Login] 最终结果 code:', code)
  return getLoginMessage(code)
}

/**
 * 获取当前用户信息
 *
 * 参考 ldesign-all/packages/shared/api/src/modules/user/index.ts 中的 UserApi.getUserInfo
 */
export async function fetchUserInfo(): Promise<UserInfo | null> {
  if (!getSid()) {
    return null
  }

  try {
    // 获取 LEAP 原始用户信息
    const rawUserInfo = await leapRpcRequest<LeapRawUserInfo>('app_getUserInfo')

    if (rawUserInfo) {
      // 转换为通用格式
      const userInfo = transformLeapUserInfo(rawUserInfo)
      console.log('[Auth] fetchUserInfo raw:', rawUserInfo)
      console.log('[Auth] fetchUserInfo transformed:', userInfo)
      saveUserInfo(userInfo)
      return userInfo
    }

    return null
  } catch (e) {
    console.error('[Auth] fetchUserInfo error:', e)
    return null
  }
}

/**
 * 获取菜单列表
 *
 * 参考 ldesign-all/packages/shared/api/src/modules/menu/index.ts 中的 MenuApi.getUIResource
 */
export async function fetchMenuList(
  resourceid: string | null = null,
  level = 1
): Promise<MenuItem[]> {
  if (!getSid()) {
    return []
  }

  try {
    const params = {
      resourceid,
      includParent: true,
      deepLevel: level,
      extendFields: [
        'vmodulename',
        'vmodulepath',
        'customize',
        'clustername',
        'indexpagemodulestyle',
        'indexpagemodulemargin',
        'expendtreenode',
        'haschild',
        'resourcetype',
        'icon',
        'rescolor',
      ],
    }
    console.log('[Auth] fetchMenuList params:', params)

    // 获取原始菜单数据
    const rawMenuList = await leapRpcRequest<RawMenuItem[]>('studiov6_getUIResource', params)
    console.log('[Auth] fetchMenuList raw result:', rawMenuList)

    if (!rawMenuList || rawMenuList.length === 0) {
      return []
    }

    // 转换为树形结构（使用 children 字段）
    const transformedMenus = transformMenuList(rawMenuList)
    console.log('[Auth] fetchMenuList transformed:', transformedMenus)

    return transformedMenus
  } catch (e) {
    console.error('[Auth] fetchMenuList error:', e)
    return []
  }
}

/**
 * 退出登录
 *
 * 参考 ldesign-all/packages/shared/api/src/modules/user/index.ts 中的 UserApi.logout
 */
export async function logout(): Promise<boolean> {
  const sid = getSid()
  if (!sid) {
    clearSession()
    return true
  }

  try {
    await leapRpcRequest('logout')
  } catch (e) {
    console.warn('[Auth] logout error:', e)
  }

  clearSession()
  return true
}

// ============================================================================
// 重新导出
// ============================================================================

export {
  getSid,
  getLid,
  saveSid,
  saveLid,
  clearSession,
  isLoggedIn,
}

// ============================================================================
// API 集合
// ============================================================================

export const authApis = {
  fetchSid,
  getCaptchaUrl,
  loginByPassword,
  fetchUserInfo,
  fetchMenuList,
  logout,
}
