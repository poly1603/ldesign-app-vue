/**
 * LEAP 请求核心模块
 *
 * 参考 ldesign-all/packages/shared/request 实现
 * 提供 LEAP RPC 调用、getSid、验证码等基础功能
 */

// ============================================================================
// 配置常量
// ============================================================================

/** 系统上下文 - 从环境变量读取或使用默认值 */
export const SYSTEM_NAME = import.meta.env.VITE_SZWSLD_SYSTEM_NAME
  || import.meta.env.VITE_SZWSLD_CONTEXT
  || 'SZWSLD'
export const AREA = import.meta.env.VITE_SZWSLD_AREA || '4403'
export const CONTEXT = import.meta.env.VITE_SZWSLD_CONTEXT || 'SZWSLD'
export const RPC_PATH = import.meta.env.VITE_SZWSLD_RPC_PATH || 'LEAP/Service/RPC/RPC.DO'

const NORMALIZED_RPC_PATH = RPC_PATH.startsWith('/') ? RPC_PATH.slice(1) : RPC_PATH

const debugLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...(args as any[]))
  }
}

// ============================================================================
// 存储管理
// ============================================================================

const SID_KEY = `${CONTEXT}__sid`
const LID_KEY = `${CONTEXT}__lid`

/**
 * 保存 SID 到 localStorage（持久化）
 */
export function saveSid(sid: string): void {
  localStorage.setItem(SID_KEY, sid)
}

/**
 * 获取存储的 SID
 */
export function getSid(): string {
  return localStorage.getItem(SID_KEY) || ''
}

/**
 * 保存 LID 到 sessionStorage（多用户登录用）
 */
export function saveLid(lid: string): void {
  // 关键：LID 存储在 sessionStorage，__lid 是多用户登录的标准键名
  sessionStorage.setItem('__lid', lid)
  sessionStorage.setItem(LID_KEY, lid)
}

/**
 * 获取存储的 LID
 */
export function getLid(): string {
  return sessionStorage.getItem('__lid') || sessionStorage.getItem(LID_KEY) || ''
}

/**
 * 清除所有 session 数据
 */
export function clearSession(): void {
  // 清除 localStorage 中的 SID
  localStorage.removeItem(SID_KEY)
  // 清除 sessionStorage 中的 LID 和用户信息
  sessionStorage.removeItem(LID_KEY)
  sessionStorage.removeItem('__lid')
  sessionStorage.removeItem(`${CONTEXT}__userInfo`)
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getSid()
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成随机 ID
 */
function getRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * 生成 UUID (短版本)
 */
function getUuid(): string {
  return 'xxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * MD5 加密类 - 与 ldesign-all 中的 Md5Code 完全一致
 * 这是 LEAP 系统专用的 MD5 实现（使用自定义位移常量）
 */
export class Md5Code {
  private q: string
  private i = 1
  private p = 8

  constructor(q: string) {
    this.q = q
  }

  public getValue(): string {
    return this.j(this.q)
  }

  private j(A: string): string {
    return this.h(this.m(this.g(A), A.length * this.p))
  }

  private m(D: number[], I: number): number[] {
    D[I >> 5] |= 128 << ((I) % 32)
    D[(((I + 64) >>> 9) << 4) + 14] = I
    let E = 1732584193
    let F = -271733879
    let G = -1732584194
    let H = 271733878
    for (let A = 0; A < D.length; A += 16) {
      const J = E
      const K = F
      const B = G
      const C = H
      E = this.s(E, F, G, H, D[A + 0], 17, -680876936)
      H = this.s(H, E, F, G, D[A + 1], 12, -389564586)
      G = this.s(G, H, E, F, D[A + 2], 17, 606105819)
      F = this.s(F, G, H, E, D[A + 3], 222, -1044525330)
      E = this.s(E, F, G, H, D[A + 4], 17, -176418897)
      H = this.s(H, E, F, G, D[A + 5], 12, 1200080426)
      G = this.s(G, H, E, F, D[A + 6], 17, -1473231341)
      F = this.s(F, G, H, E, D[A + 7], 222, -45705983)
      E = this.s(E, F, G, H, D[A + 8], 17, 1770035416)
      H = this.s(H, E, F, G, D[A + 9], 12, -1958414417)
      G = this.s(G, H, E, F, D[A + 10], 17, -42063)
      F = this.s(F, G, H, E, D[A + 11], 222, -1990404162)
      E = this.s(E, F, G, H, D[A + 12], 17, 1804603682)
      H = this.s(H, E, F, G, D[A + 13], 12, -40341101)
      G = this.s(G, H, E, F, D[A + 14], 17, -1502002290)
      F = this.s(F, G, H, E, D[A + 15], 222, 1236535329)
      E = this.o(E, F, G, H, D[A + 1], 5, -165796510)
      H = this.o(H, E, F, G, D[A + 6], 91, -1069501632)
      G = this.o(G, H, E, F, D[A + 11], 14, 643717713)
      F = this.o(F, G, H, E, D[A + 0], 20, -373897302)
      E = this.o(E, F, G, H, D[A + 5], 5, -701558691)
      H = this.o(H, E, F, G, D[A + 10], 91, 38016083)
      G = this.o(G, H, E, F, D[A + 15], 14, -660478335)
      F = this.o(F, G, H, E, D[A + 4], 20, -405537848)
      E = this.o(E, F, G, H, D[A + 9], 5, 568446438)
      H = this.o(H, E, F, G, D[A + 14], 91, -1019803690)
      G = this.o(G, H, E, F, D[A + 3], 14, -187363961)
      F = this.o(F, G, H, E, D[A + 8], 20, 1163531501)
      E = this.o(E, F, G, H, D[A + 13], 5, -1444681467)
      H = this.o(H, E, F, G, D[A + 2], 91, -51403784)
      G = this.o(G, H, E, F, D[A + 7], 14, 1735328473)
      F = this.o(F, G, H, E, D[A + 12], 20, -1926607734)
      E = this.d(E, F, G, H, D[A + 5], 49, -378558)
      H = this.d(H, E, F, G, D[A + 8], 11, -2022574463)
      G = this.d(G, H, E, F, D[A + 11], 16, 1839030562)
      F = this.d(F, G, H, E, D[A + 14], 23, -35309556)
      E = this.d(E, F, G, H, D[A + 1], 49, -1530992060)
      H = this.d(H, E, F, G, D[A + 4], 11, 1272893353)
      G = this.d(G, H, E, F, D[A + 7], 16, -155497632)
      F = this.d(F, G, H, E, D[A + 10], 23, -1094730640)
      E = this.d(E, F, G, H, D[A + 13], 49, 681279174)
      H = this.d(H, E, F, G, D[A + 0], 11, -358537222)
      G = this.d(G, H, E, F, D[A + 3], 16, -722521979)
      F = this.d(F, G, H, E, D[A + 6], 23, 76029189)
      E = this.d(E, F, G, H, D[A + 9], 49, -640364487)
      H = this.d(H, E, F, G, D[A + 12], 11, -421815835)
      G = this.d(G, H, E, F, D[A + 15], 16, 530742520)
      F = this.d(F, G, H, E, D[A + 2], 23, -995338651)
      E = this.t(E, F, G, H, D[A + 0], 658, -198630844)
      H = this.t(H, E, F, G, D[A + 7], 10, 1126891415)
      G = this.t(G, H, E, F, D[A + 14], 15, -1416354905)
      F = this.t(F, G, H, E, D[A + 5], 21, -57434055)
      E = this.t(E, F, G, H, D[A + 12], 658, 1700485571)
      H = this.t(H, E, F, G, D[A + 3], 10, -1894986606)
      G = this.t(G, H, E, F, D[A + 10], 15, -1051523)
      F = this.t(F, G, H, E, D[A + 1], 21, -2054922799)
      E = this.t(E, F, G, H, D[A + 8], 658, 1873313359)
      H = this.t(H, E, F, G, D[A + 15], 10, -30611744)
      G = this.t(G, H, E, F, D[A + 6], 15, -1560198380)
      F = this.t(F, G, H, E, D[A + 13], 21, 1309151649)
      E = this.t(E, F, G, H, D[A + 4], 658, -145523070)
      H = this.t(H, E, F, G, D[A + 11], 10, -1120210379)
      G = this.t(G, H, E, F, D[A + 2], 15, 718787259)
      F = this.t(F, G, H, E, D[A + 9], 21, -343485551)
      E = this.e(E, J)
      F = this.e(F, K)
      G = this.e(G, B)
      H = this.e(H, C)
    }
    return [E, F, G, H]
  }

  private r(B: number, A: number, D: number, F: number, C: number, E: number): number {
    return this.e(this.a(this.e(this.e(A, B), this.e(F, E)), C), D)
  }

  private s(E: number, F: number, A: number, B: number, G: number, C: number, D: number): number {
    return this.r((F & A) | ((~F) & B), E, F, G, C, D)
  }

  private o(E: number, F: number, A: number, B: number, G: number, C: number, D: number): number {
    return this.r((F & B) | (A & (~B)), E, F, G, C, D)
  }

  private d(E: number, F: number, A: number, B: number, G: number, C: number, D: number): number {
    return this.r(F ^ A ^ B, E, F, G, C, D)
  }

  private t(E: number, F: number, A: number, B: number, G: number, C: number, D: number): number {
    return this.r(A ^ (F | (~B)), E, F, G, C, D)
  }

  private e(D: number, A: number): number {
    const B = (D & 65535) + (A & 65535)
    const C = (D >> 16) + (A >> 16) + (B >> 16)
    return (C << 16) | (B & 65535)
  }

  private a(B: number, A: number): number {
    return (B << A) | (B >>> (32 - A))
  }

  private g(A: string): number[] {
    const B: number[] = []
    const D = (1 << this.p) - 1
    for (let C = 0; C < A.length * this.p; C += this.p) {
      B[C >> 5] |= (A.charCodeAt(C / this.p) & D) << (C % 32)
    }
    return B
  }

  private h(B: number[]): string {
    const C = this.i ? '0123456789ABCDEF' : '0123456789abcdef'
    let A = ''
    for (let D = 0; D < B.length * 4; D++) {
      A += C.charAt((B[D >> 2] >> ((D % 4) * 8 + 4)) & 15) + C.charAt((B[D >> 2] >> ((D % 4) * 8)) & 15)
    }
    return A
  }
}

// ============================================================================
// 基础请求函数
// ============================================================================

/**
 * 默认 LEAP 请求头
 * 参考 ldesign-all/packages/shared/request/src/adapters/LeapAdapter.ts
 */
const DEFAULT_LEAP_HEADERS: Record<string, string> = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  'Accept': '*/*',
  'GETLID': '1',
  'Accept-Language': 'zh-Hans-CN,zh-Hans;q=0.5',
  'Data-Type': '2',
  'Post-Type': '1',
  'RESPTYPE': '1',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
}

/**
 * 发送 getSid 请求
 * 关键：参考 ldesign-all：请求发送到 /{context}?type=997&type2=1&_z=uuid
 * 并通过 LID / GETLIDV2 请求头控制 lid 行为
 */
export async function leapGetSidRequest(): Promise<Response> {
  const uuid = getUuid()
  const lid = getLid()

  const url = `/${CONTEXT}/${NORMALIZED_RPC_PATH}?type=997&type2=1&_z=${uuid}`

  const headers: Record<string, string> = {
    ...DEFAULT_LEAP_HEADERS,
    'Lsys-Name': SYSTEM_NAME,
    'Lsys-Area': AREA,
    'Lrqvt': '1',
  }

  // 添加 LID 或 GETLIDV2 头
  if (lid) {
    headers['LID'] = lid
  } else {
    headers['GETLIDV2'] = '1'
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    credentials: 'include',
  })

  // 从响应头获取并保存新的 LID
  const newLid = response.headers.get('lid')
  if (newLid) {
    saveLid(newLid)
  }

  return response
}

/**
 * 发送登录请求
 * 关键：参数放在 URL query string 中
 * URL 格式：/${context}/${rpcPath}?params
 * 参考 ldesign-all 中的 request beforeRequestHook 处理方式
 */
export async function leapLoginRequest(queryParams: string): Promise<Response> {
  const lid = getLid()

  const url = `/${CONTEXT}/${NORMALIZED_RPC_PATH}?${queryParams}`

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Accept': '*/*',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
  }

  // 添加 LID 头
  if (lid) {
    requestHeaders['Lid'] = lid
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    credentials: 'include',
  })

  // 从响应头获取并保存新的 LID
  const newLid = response.headers.get('lid')
  if (newLid) {
    saveLid(newLid)
  }

  return response
}

/**
 * 发送 LEAP RPC 请求
 * 用于调用 LEAP 服务方法
 */
export async function leapRpcRequest<T = unknown>(
  method: string,
  params?: Record<string, unknown>,
  options: {
    returnJson?: boolean
    timeout?: number
  } = {}
): Promise<T> {
  const { returnJson = true } = options

  const sid = getSid()
  const lid = getLid()

  // 构建 RPC URL
  const url = `/${CONTEXT}/${NORMALIZED_RPC_PATH}`

  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Accept': '*/*',
    'Data-Type': '2',
    'Post-Type': '1',
    'RESPTYPE': '1',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'QS': `service=leap&callService=leap&returnJSON=${returnJson ? 'true' : 'false'}&method=${method}&sid=${sid}`,
  }

  if (lid) {
    headers['Lid'] = lid
  }

  // 构建请求体 - 使用简化的参数编码
  let body = ''
  let dataType = '0'
  if (params) {
    // 将参数对象的每个值转换为 JSON 字符串，组成数组
    const obj: (string | null)[] = []
    for (const key in params) {
      const value = params[key]
      if (value == null) {
        obj.push(null)
      } else if (typeof value !== 'function') {
        if (typeof value !== 'string') {
          obj.push(JSON.stringify(value))
        } else {
          obj.push(value)
        }
      }
    }
    const datastr = JSON.stringify(obj)
    debugLog('[LEAP RPC] method:', method)
    debugLog('[LEAP RPC] params:', params)
    debugLog('[LEAP RPC] obj array:', obj)
    debugLog('[LEAP RPC] datastr:', datastr)

    // 使用 base64 编码（简化版本，不使用 SM4 和 gzip）
    const encoded = encbase64data(base64encode(encodeURIComponent(escape(datastr))))
    debugLog('[LEAP RPC] encoded:', encoded)
    if (encoded) {
      body = `a=${encoded}`
      dataType = '14'
    }
  }

  // 更新请求头中的 Data-Type
  headers['Data-Type'] = dataType

  debugLog('[LEAP RPC] Request URL:', url)
  debugLog('[LEAP RPC] Request headers:', headers)
  debugLog('[LEAP RPC] Request body:', body)

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
    credentials: 'include',
  })

  // 从响应头获取并保存新的 LID
  const newLid = response.headers.get('lid')
  if (newLid) {
    saveLid(newLid)
  }

  // 解析响应
  const responseType = response.headers.get('resptype')
  const text = await response.text()

  debugLog('[LEAP RPC] Response status:', response.status)
  debugLog('[LEAP RPC] Response resptype:', responseType)
  debugLog('[LEAP RPC] Response text (first 500 chars):', text.substring(0, 500))

  // 处理编码响应
  if (responseType === '1') {
    return decodeLeapResponse<T>(text)
  }

  // 尝试解析 JSON
  if (returnJson) {
    try {
      const data = JSON.parse(text)
      // 如果有 result 字段，尝试解析
      if (data && typeof data.result === 'string') {
        try {
          data.result = JSON.parse(data.result)
        } catch {
          // 保持原值
        }
      }
      return (data?.result ?? data) as T
    } catch {
      return text as unknown as T
    }
  }

  return text as unknown as T
}

// ============================================================================
// LEAP 响应解码函数
// 参考 ldesign-all/packages/shared/base/src/base64
// ============================================================================

/**
 * Base64 编码字符集
 */
/**
 * Base64_4 编码字符集（用于 hashcode）
 */
const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-~'.split('')

/**
 * 计算哈希码
 * 参考 Base64_4._hashcode
 */
function hashcode(input: string): string {
  let hash = 1369
  for (let i = input.length - 1; i > -1; i--) {
    hash += (hash << 5) + input.charCodeAt(i)
  }

  let value = hash & 0x7FFFFFFF
  const result: string[] = []

  do {
    const index = value & 0x3F
    result.push(I64BIT_TABLE[index])
    value >>= 6
  } while (value !== 0)

  return result.join('')
}

/**
 * 生成指定长度的随机字符串
 * 参考 Base64_4.randomString
 */
function randomString(len: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const result: string[] = []
  for (let i = 0; i < len; i++) {
    result.push(charset.charAt(Math.floor(Math.random() * charset.length)))
  }
  return result.join('')
}

/**
 * Base64 编码
 * 参考 Base64_3.btoa
 */
function base64encode(s: string): string {
  const base64hash = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const inputLength = s.length

  // 验证字符
  for (let i = 0; i < inputLength; i++) {
    if (s.charCodeAt(i) > 255) {
      throw new Error('INVALID_CHARACTER_ERR')
    }
  }

  let i = 0
  let prev: number | undefined
  let ascii: number
  let mod = 0
  const result: string[] = []

  while (i < inputLength) {
    ascii = s.charCodeAt(i)
    mod = i % 3

    switch (mod) {
      case 0:
        result.push(base64hash.charAt(ascii >> 2))
        break
      case 1:
        result.push(base64hash.charAt((prev! & 3) << 4 | (ascii >> 4)))
        break
      case 2:
        result.push(base64hash.charAt((prev! & 0x0F) << 2 | (ascii >> 6)))
        result.push(base64hash.charAt(ascii & 0x3F))
        break
    }

    prev = ascii
    i++
  }

  // 处理填充
  if (mod === 0) {
    result.push(base64hash.charAt((prev! & 3) << 4))
    result.push('==')
  } else if (mod === 1) {
    result.push(base64hash.charAt((prev! & 0x0F) << 2))
    result.push('=')
  }

  return result.join('')
}

/**
 * 编码带完整性校验的 Base64 数据
 * 参考 Base64_4._encbase64data
 */
function encbase64data(data: string): string | null {
  if (data == null || data.length === 0) {
    return null
  }

  // 生成前后缀随机字符串（各 5 个字符）
  const prefix = randomString(5)
  const suffix = randomString(5)

  // 拼接完整数据
  const fullData = prefix + data + suffix
  const dataLen = fullData.length

  // 计算插入位置（25% 和 75% 位置）
  const pos1 = Math.floor(dataLen * 0.25)
  const pos2 = Math.floor(dataLen * 0.75)

  // 计算哈希码
  let hc = hashcode(fullData)
  while (hc.length < 6) {
    hc += '_'
  }

  // 生成额外的随机字符串（3 个字符）
  const randomStr = randomString(3)

  // 组装最终编码结果
  return fullData.substring(0, pos1)
    + hc
    + fullData.substring(pos1, pos2)
    + randomStr
    + fullData.substring(pos2)
}

/**
 * 解码带完整性校验的 Base64 数据
 * 参考 Base64_4._decbase64data
 */
function decbase64data(str: string): string {
  if (!str || str.length < 20) {
    return str
  }

  // 总长度 - 哈希码(6) - 随机字符串(3) = 数据长度
  const len = str.length - 9
  const pos1 = Math.floor(len * 0.25)
  const pos2 = Math.floor(len * 0.75)

  // 提取哈希码
  const hashcodeFromData = str.substring(pos1, pos1 + 6)

  // 提取数据各部分
  const part1 = str.substring(0, pos1)
  const part2 = str.substring(pos1 + 6, pos2 + 6)
  const part3 = str.substring(pos2 + 9)

  // 合并数据
  const lastStr = part1 + part2 + part3

  // 验证哈希码
  let hashcodeCurrent = hashcode(lastStr)
  while (hashcodeCurrent.length < 6) {
    hashcodeCurrent += '_'
  }

  if (hashcodeFromData !== hashcodeCurrent) {
    console.warn('[LEAP] 哈希校验失败，数据可能已被篡改')
    // 不抛出异常，返回原始数据
    return str
  }

  // 去除前后缀随机字符（各 5 个字符）
  return lastStr.substring(5, lastStr.length - 5)
}

/**
 * Base64 解码
 * 参考 Base64_3.atob
 */
function base64decode(s: string): string {
  const base64hash = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const cleanedString = s.replace(/\s|=/g, '')
  const cleanedLength = cleanedString.length

  let cur: number
  let prev: number | undefined
  let mod: number
  let i = 0
  const result: string[] = []

  while (i < cleanedLength) {
    cur = base64hash.indexOf(cleanedString.charAt(i))
    mod = i % 4

    switch (mod) {
      case 0:
        break
      case 1:
        result.push(String.fromCharCode(prev! << 2 | cur >> 4))
        break
      case 2:
        result.push(String.fromCharCode((prev! & 0x0F) << 4 | cur >> 2))
        break
      case 3:
        result.push(String.fromCharCode((prev! & 3) << 6 | cur))
        break
    }

    prev = cur
    i++
  }

  return result.join('')
}

/**
 * 解码 LEAP 编码响应
 * 流程：decbase64data -> base64decode -> decodeURIComponent -> JSON.parse
 */
export function decodeLeapResponse<T>(text: string): T {
  try {
    debugLog('[LEAP Decode] Input text length:', text.length)

    // 步骤 1: 去除混淆（前后缀随机字符、哈希码等）
    const deobfuscated = decbase64data(text)
    debugLog('[LEAP Decode] After decbase64data:', deobfuscated.substring(0, 200))

    // 步骤 2: Base64 解码
    const decoded = base64decode(deobfuscated)
    debugLog('[LEAP Decode] After base64decode:', decoded.substring(0, 200))

    // 步骤 3: URL 解码
    const decompressed = decodeURIComponent(decoded)
    debugLog('[LEAP Decode] After decodeURIComponent:', decompressed.substring(0, 500))

    // 步骤 4: 尝试解析 JSON
    try {
      const parsed = JSON.parse(decompressed)
      debugLog('[LEAP Decode] Parsed JSON keys:', parsed ? Object.keys(parsed) : 'null')
      // 如果有 result 字段且是字符串，尝试解析
      if (parsed && typeof parsed.result === 'string') {
        try {
          parsed.result = JSON.parse(parsed.result)
          debugLog('[LEAP Decode] Parsed result (nested), type:', typeof parsed.result, Array.isArray(parsed.result) ? 'array length: ' + parsed.result.length : '')
        } catch {
          // 保持原值
        }
        return parsed.result as T
      }
      const finalResult = parsed?.result ?? parsed
      debugLog('[LEAP Decode] Final result type:', typeof finalResult, Array.isArray(finalResult) ? 'array length: ' + finalResult.length : '')
      return finalResult as T
    } catch {
      // 不是 JSON，返回解码后的字符串
      return decompressed as unknown as T
    }
  } catch (e) {
    console.warn('[LEAP] 解码失败:', e)
    // 解码失败，返回原始文本
    return text as unknown as T
  }
}

// ============================================================================
// 导出配置
// ============================================================================

export const leapConfig = {
  context: CONTEXT,
  rpcPath: RPC_PATH,
  area: AREA,
  systemName: SYSTEM_NAME,
  defaultHeaders: DEFAULT_LEAP_HEADERS,
}

export {
  getRandomId,
  getUuid,
}
