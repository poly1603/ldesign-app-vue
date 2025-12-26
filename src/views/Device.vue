<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  Smartphone,
  Monitor,
  Tablet,
  Maximize,
  Minimize,
  Search,
  Globe,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  Award
} from 'lucide-vue-next'

// 设备信息接口
interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  orientation: 'portrait' | 'landscape'
  width: number
  height: number
  screenWidth?: number
  screenHeight?: number
  pixelRatio: number
  isTouchDevice: boolean
  userAgent: string
  screen?: {
    width: number
    height: number
    pixelRatio: number
    deviceWidth?: number
    deviceHeight?: number
  }
  os?: {
    name: string
    version: string
  }
  browser?: {
    name: string
    version: string
  }
  detection?: {
    method: 'screen' | 'viewport' | 'userAgent'
    priority: number
    isDynamic: boolean
  }
}

// 响应式数据
const deviceInfo = ref<DeviceInfo>({
  type: 'desktop',
  orientation: 'landscape',
  width: 0,
  height: 0,
  pixelRatio: 1,
  isTouchDevice: false,
  userAgent: '',
})

// 检测设备类型（根据宽度）
function getDeviceType(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < 768)
    return 'mobile'
  if (width < 1024)
    return 'tablet'
  return 'desktop'
}

// 检测屏幕方向
function getOrientation(): 'portrait' | 'landscape' {
  return window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
}

// 检测是否为触摸设备
function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 简单的浏览器检测
function getBrowserInfo() {
  const ua = navigator.userAgent
  let name = 'Unknown'
  let version = 'Unknown'

  if (ua.includes('Firefox')) {
    name = 'Firefox'
    version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown'
  }
  else if (ua.includes('Chrome')) {
    name = 'Chrome'
    version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown'
  }
  else if (ua.includes('Safari')) {
    name = 'Safari'
    version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown'
  }
  else if (ua.includes('Edge')) {
    name = 'Edge'
    version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown'
  }

  return { name, version }
}

// 简单的操作系统检测
function getOSInfo() {
  const ua = navigator.userAgent
  let name = 'Unknown'
  let version = 'Unknown'

  if (ua.includes('Windows')) {
    name = 'Windows'
    version = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || 'Unknown'
  }
  else if (ua.includes('Mac')) {
    name = 'macOS'
    version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'Unknown'
  }
  else if (ua.includes('Linux')) {
    name = 'Linux'
  }
  else if (ua.includes('Android')) {
    name = 'Android'
    version = ua.match(/Android (\d+)/)?.[1] || 'Unknown'
  }
  else if (ua.includes('iOS')) {
    name = 'iOS'
    version = ua.match(/OS (\d+_\d+)/)?.[1]?.replace('_', '.') || 'Unknown'
  }

  return { name, version }
}

// 获取检测方法信息
function getDetectionInfo() {
  const screenWidth = window.screen.width

  // 判断检测方法
  let method: 'screen' | 'viewport' | 'userAgent' = 'viewport'
  let priority = 2

  if (screenWidth > 0) {
    method = 'screen'
    priority = 3
  }

  return {
    method,
    priority,
    isDynamic: true, // 默认启用动态检测
  }
}

// 更新设备信息
function updateDeviceInfo() {
  const width = window.innerWidth
  const height = window.innerHeight

  deviceInfo.value = {
    type: getDeviceType(width),
    orientation: getOrientation(),
    width,
    height,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio,
    isTouchDevice: isTouchDevice(),
    userAgent: navigator.userAgent,
    screen: {
      width,
      height,
      pixelRatio: window.devicePixelRatio,
      deviceWidth: window.screen.width,
    },
    os: getOSInfo(),
    browser: getBrowserInfo(),
    detection: getDetectionInfo(),
  }
}

// 刷新设备信息
function refreshDeviceInfo() {
  updateDeviceInfo()
}

// 返回首页
function goBack() {
  window.history.back()
}

// 防抖函数
function debounce(fn: Function, delay: number) {
  let timer: number | null = null
  return function (this: any, ...args: any[]) {
    if (timer)
      clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 创建防抖的更新函数
const debouncedUpdate = debounce(updateDeviceInfo, 300)

// 生命周期
onMounted(() => {
  updateDeviceInfo()

  // 监听窗口大小变化
  window.addEventListener('resize', debouncedUpdate)

  // 监听屏幕方向变化
  window.addEventListener('orientationchange', debouncedUpdate)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedUpdate)
  window.removeEventListener('orientationchange', debouncedUpdate)
})
</script>

<template>
  <div class="device-page page-container">
    <h1 class="page-title">
      <Smartphone class="icon-title" />
      设备信息检测
    </h1>

    <div class="section-card">
      <h2 class="section-title">
        <Monitor class="section-icon" />
        当前设备信息
      </h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">
            设备类型
          </div>
          <div class="info-value device-type">
            <span v-if="deviceInfo.type === 'mobile'" class="flex-center">
              <Smartphone class="inline-icon" /> 移动设备
            </span>
            <span v-else-if="deviceInfo.type === 'tablet'" class="flex-center">
              <Tablet class="inline-icon" /> 平板设备
            </span>
            <span v-else class="flex-center">
              <Monitor class="inline-icon" /> 桌面设备
            </span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            屏幕方向
          </div>
          <div class="info-value">
            <span v-if="deviceInfo.orientation === 'portrait'" class="flex-center">
              <Minimize class="inline-icon" /> 竖屏
            </span>
            <span v-else class="flex-center">
              <Maximize class="inline-icon" /> 横屏
            </span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            触摸设备
          </div>
          <div class="info-value">
            <span v-if="deviceInfo.isTouchDevice" class="flex-center text-success">
              <CheckCircle class="inline-icon" /> 是
            </span>
            <span v-else class="flex-center text-error">
              <XCircle class="inline-icon" /> 否
            </span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            像素比
          </div>
          <div class="info-value">
            {{ deviceInfo.pixelRatio }}
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <h2 class="section-title">
        <Maximize class="section-icon" />
        屏幕尺寸信息
      </h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">
            视口宽度
          </div>
          <div class="info-value">
            {{ deviceInfo.width }}px
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            视口高度
          </div>
          <div class="info-value">
            {{ deviceInfo.height }}px
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            设备屏幕宽度
          </div>
          <div class="info-value">
            {{ deviceInfo.screen?.deviceWidth || deviceInfo.screenWidth }}px
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            设备屏幕高度
          </div>
          <div class="info-value">
            {{ deviceInfo.screen?.deviceHeight || deviceInfo.screenHeight }}px
          </div>
        </div>
      </div>
    </div>

    <div v-if="deviceInfo.detection" class="section-card">
      <h2 class="section-title">
        <Search class="section-icon" />
        检测方式信息
      </h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">
            检测方法
          </div>
          <div class="info-value">
            <span v-if="deviceInfo.detection.method === 'screen'" class="flex-center">
              <Award class="inline-icon text-gold" /> 屏幕尺寸 (最准确)
            </span>
            <span v-else-if="deviceInfo.detection.method === 'viewport'" class="flex-center">
              <Award class="inline-icon text-silver" /> 视口宽度 (动态)
            </span>
            <span v-else class="flex-center">
              <Award class="inline-icon text-bronze" /> UserAgent (降级)
            </span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            检测优先级
          </div>
          <div class="info-value">
            {{ deviceInfo.detection.priority }}
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            动态检测
          </div>
          <div class="info-value">
            <span v-if="deviceInfo.detection.isDynamic" class="flex-center text-success">
              <CheckCircle class="inline-icon" /> 已启用
            </span>
            <span v-else class="flex-center text-error">
              <XCircle class="inline-icon" /> 未启用
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <h2 class="section-title">
        <Globe class="section-icon" />
        浏览器信息
      </h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">
            浏览器名称
          </div>
          <div class="info-value">
            {{ deviceInfo.browser?.name || 'Unknown' }}
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            浏览器版本
          </div>
          <div class="info-value">
            {{ deviceInfo.browser?.version || 'Unknown' }}
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            操作系统
          </div>
          <div class="info-value">
            {{ deviceInfo.os?.name || 'Unknown' }}
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            系统版本
          </div>
          <div class="info-value">
            {{ deviceInfo.os?.version || 'Unknown' }}
          </div>
        </div>
      </div>
    </div>

    <div class="tip-section">
      <h3>
        <Lightbulb class="inline-icon" />
        提示
      </h3>
      <ul>
        <li>
          <span class="tip-icon">
            <RefreshCw class="inline-icon" />
          </span>
          <strong>动态检测已启用</strong>：尝试调整浏览器窗口大小，设备类型会自动更新
        </li>
        <li>
          <span class="tip-icon">
            <Search class="inline-icon" />
          </span>
          <strong>多级检测</strong>：优先使用屏幕尺寸 > 视口宽度 > UserAgent
        </li>
        <li>
          <span class="tip-icon">
            <Monitor class="inline-icon" />
          </span>
          <strong>桌面响应式</strong>：桌面浏览器缩小到移动设备尺寸时，类型会变为"移动设备"
        </li>
        <li>
          <span class="tip-icon">
            <Maximize class="inline-icon" />
          </span>
          <strong>断点设置</strong>：&lt; 768px 为移动设备，768px-1024px 为平板，&gt; 1024px 为桌面
        </li>
      </ul>
    </div>

    <div class="actions">
      <button class="btn primary" @click="refreshDeviceInfo">
        <RefreshCw class="btn-icon" />
        刷新设备信息
      </button>
      <button class="btn secondary" @click="goBack">
        <ArrowLeft class="btn-icon" />
        返回首页
      </button>
    </div>
  </div>
</template>

<style scoped>
.device-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--size-space-lg);
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xl);
  text-align: center;
}

.icon-title {
  width: 32px;
  height: 32px;
  color: var(--color-primary-500);
}

.section-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-md);
  font-weight: 600;
  padding-bottom: var(--size-space-sm);
  border-bottom: 1px solid var(--color-border-secondary);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--size-space-md);
}

.info-card {
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  padding: var(--size-space-md);
  border-left: 4px solid var(--color-primary-500);
  border-top: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.info-label {
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--size-space-xs);
}

.info-value {
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.device-type {
  font-size: var(--size-font-xl);
  color: var(--color-primary-500);
}

.tip-section {
  background: var(--color-warning-bg);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  border-left: 4px solid var(--color-warning-500);
  border: 1px solid var(--color-warning-border);
}

.tip-section h3 {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-lg);
  margin-bottom: var(--size-space-md);
  color: var(--color-text-primary);
  font-weight: 600;
}

.tip-section ul {
  margin: 0;
  padding-left: var(--size-space-md);
  color: var(--color-text-primary);
  list-style: none;
}

.tip-section li {
  display: flex;
  align-items: flex-start;
  gap: var(--size-space-sm);
  margin-bottom: var(--size-space-sm);
  line-height: 1.6;
}

.tip-icon {
  display: flex;
  align-items: center;
  margin-top: 4px;
  color: var(--color-warning-600);
}

.actions {
  display: flex;
  gap: var(--size-space-md);
  justify-content: center;
  margin-top: var(--size-space-xl);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  border: none;
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-md);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  border: 1px solid var(--color-border);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn.primary:hover {
  background: var(--color-primary-600);
}

.btn.secondary {
  background: var(--color-bg-container);
  color: var(--color-text-primary);
}

.btn.secondary:hover {
  background: var(--color-bg-hover);
}

.flex-center {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.inline-icon {
  width: 16px;
  height: 16px;
}

.text-success {
  color: var(--color-success-500);
}

.text-error {
  color: var(--color-error-500);
}

.text-gold {
  color: #fbbf24;
}

.text-silver {
  color: #9ca3af;
}

.text-bronze {
  color: #b45309;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .device-page {
    padding: var(--size-space-md);
  }

  .page-title {
    font-size: var(--size-font-xl);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
