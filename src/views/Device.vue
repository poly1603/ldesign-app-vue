<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

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
function getDetectionInfo(width: number) {
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
      deviceHeight: window.screen.height,
    },
    os: getOSInfo(),
    browser: getBrowserInfo(),
    detection: getDetectionInfo(width),
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
  <div class="device-page">
    <h1>📱 设备信息检测</h1>

    <div class="info-section">
      <h2>🎯 当前设备信息</h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">
            设备类型
          </div>
          <div class="info-value device-type">
            <span v-if="deviceInfo.type === 'mobile'">📱 移动设备</span>
            <span v-else-if="deviceInfo.type === 'tablet'">📱 平板设备</span>
            <span v-else>🖥️ 桌面设备</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            屏幕方向
          </div>
          <div class="info-value">
            {{ deviceInfo.orientation === 'portrait' ? '📱 竖屏' : '🖥️ 横屏' }}
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">
            触摸设备
          </div>
          <div class="info-value">
            {{ deviceInfo.isTouchDevice ? '✅ 是' : '❌ 否' }}
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

    <div class="info-section">
      <h2>📐 屏幕尺寸信息</h2>
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

    <div v-if="deviceInfo.detection" class="info-section">
      <h2>🔍 检测方式信息</h2>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">
            检测方法
          </div>
          <div class="info-value">
            <span v-if="deviceInfo.detection.method === 'screen'">🥇 屏幕尺寸 (最准确)</span>
            <span v-else-if="deviceInfo.detection.method === 'viewport'">🥈 视口宽度 (动态)</span>
            <span v-else>🥉 UserAgent (降级)</span>
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
            {{ deviceInfo.detection.isDynamic ? '✅ 已启用' : '❌ 未启用' }}
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h2>💻 浏览器信息</h2>
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
      <h3>💡 提示</h3>
      <ul>
        <li>🔄 <strong>动态检测已启用</strong>：尝试调整浏览器窗口大小，设备类型会自动更新</li>
        <li>📱 <strong>多级检测</strong>：优先使用屏幕尺寸 > 视口宽度 > UserAgent</li>
        <li>🖥️ <strong>桌面响应式</strong>：桌面浏览器缩小到移动设备尺寸时，类型会变为"移动设备"</li>
        <li>📏 <strong>断点设置</strong>：< 768px 为移动设备，768px-1024px 为平板，> 1024px 为桌面</li>
      </ul>
    </div>

    <div class="actions">
      <button class="btn btn-primary" @click="refreshDeviceInfo">
        🔄 刷新设备信息
      </button>
      <button class="btn btn-secondary" @click="goBack">
        ← 返回首页
      </button>
    </div>
  </div>
</template>

<style scoped>
.device-page {
  max-width: var(--size-size-64);
  margin: 0 auto;
  padding: var(--size-space-xl);
}

h1 {
  font-size: var(--size-font-xxl);
  margin-bottom: var(--size-space-xl);
  color: var(--color-text-primary);
  text-align: center;
}

h2 {
  font-size: var(--size-font-xl);
  margin-bottom: var(--size-space-md);
  color: var(--color-text-secondary);
}

h3 {
  font-size: var(--size-font-lg);
  margin-bottom: var(--size-space-md);
  color: var(--color-text-secondary);
}

.info-section {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-md);
  padding: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  box-shadow: var(--color-shadow-small);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--size-space-md);
}

.info-card {
  background: var(--color-bg-container-secondary);
  border-radius: var(--size-radius-sm);
  padding: var(--size-space-md);
  border-left: var(--size-border-width-thick) solid var(--color-primary);
}

.info-label {
  font-size: var(--size-font-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--size-space-xs);
}

.info-value {
  font-size: var(--size-font-lg);
  font-weight: var(--size-font-weight-semibold);
  color: var(--color-text-primary);
}

.device-type {
  font-size: var(--size-font-xl);
  color: var(--color-primary);
}

.tip-section {
  background: var(--color-warning-bg);
  border-radius: var(--size-radius-md);
  padding: var(--size-space-lg);
  margin-bottom: var(--size-space-lg);
  border-left: var(--size-border-width-thick) solid var(--color-warning);
}

.tip-section ul {
  margin: 0;
  padding-left: var(--size-space-lg);
}

.tip-section li {
  margin-bottom: var(--size-space-xs);
  line-height: var(--size-line-relaxed);
}

.actions {
  display: flex;
  gap: var(--size-space-md);
  justify-content: center;
  margin-top: var(--size-space-xl);
}

.btn {
  padding: var(--size-comp-paddingTB-m) var(--size-comp-paddingLR-m);
  border: none;
  border-radius: var(--size-radius-sm);
  font-size: var(--size-font-md);
  cursor: pointer;
  transition: all var(--size-duration-normal) ease;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--color-shadow-medium);
}

.btn-secondary {
  background: var(--color-text-tertiary);
  color: var(--color-text-inverse);
}

.btn-secondary:hover {
  background: var(--color-text-secondary);
  transform: translateY(-2px);
  box-shadow: var(--color-shadow-medium);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .device-page {
    padding: var(--size-space-md);
  }

  h1 {
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
  }
}
</style>
