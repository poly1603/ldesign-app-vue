<script setup lang="ts">
import { useEngine } from '@ldesign/engine-vue3'
import { useI18n } from '@ldesign/i18n-vue'
import { computed, onMounted, ref } from 'vue'

const engine = useEngine()
const { locale, setLocale } = useI18n()

// 设备信息
const deviceInfo = ref<any>(null)
const mounted = ref(false)

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  if (engine) {
    const deviceService = engine.api.get('device')
    if (deviceService) {
      deviceInfo.value = deviceService.getDeviceInfo()
    }
    engine.events.on('device:change', (info: any) => {
      deviceInfo.value = info
    })
  }
})

function toggleLocale() {
  setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
}

// 快捷入口
const quickLinks = [
  { icon: 'palette', title: '主题定制', desc: '自定义主题色和样式', route: '/theme', color: '#6366f1' },
  { icon: 'smartphone', title: '设备信息', desc: '查看设备和屏幕信息', route: '/device', color: '#06b6d4' },
  { icon: 'database', title: '数据管理', desc: '本地存储和缓存管理', route: '/store', color: '#10b981' },
  { icon: 'layout', title: '布局系统', desc: '多设备响应式布局', route: '/layout', color: '#f59e0b' },
]

// 功能特性
const features = [
  { icon: 'zap', title: '高性能', desc: '基于 Vue3 + Vite 构建' },
  { icon: 'shield', title: '类型安全', desc: '完整的 TypeScript 支持' },
  { icon: 'layers', title: '模块化', desc: '插件化架构设计' },
  { icon: 'globe', title: '国际化', desc: '内置多语言支持' },
]

// 当前时间
const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit' })
})

const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString(locale.value, { weekday: 'long', month: 'long', day: 'numeric' })
})

// 问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})
</script>

<template>
  <div class="home-page" :class="{ 'is-mounted': mounted }">
    <!-- 顶部欢迎区 -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient" />
        <div class="hero-pattern" />
        <div class="hero-orbs">
          <div class="orb orb-1" />
          <div class="orb orb-2" />
          <div class="orb orb-3" />
        </div>
      </div>

      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            LDesign Engine
          </span>
          <h1 class="hero-title">{{ greeting }}，欢迎使用</h1>
          <p class="hero-subtitle">构建优雅的企业级设计系统</p>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ currentTime }}</div>
            <div class="stat-label">{{ currentDate }}</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <div class="stat-value">{{ deviceInfo?.type || 'desktop' }}</div>
            <div class="stat-label">当前设备</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <div class="stat-value">{{ locale }}</div>
            <div class="stat-label">语言</div>
          </div>
        </div>

        <div class="hero-actions">
          <router-link to="/login" class="action-btn primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            前往登录
          </router-link>
          <button class="action-btn secondary" @click="toggleLocale">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            切换语言
          </button>
        </div>
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="quick-section">
      <h2 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
        快捷入口
      </h2>
      <div class="quick-grid">
        <router-link v-for="link in quickLinks" :key="link.route" :to="link.route" class="quick-card">
          <div class="quick-icon" :style="{ '--icon-color': link.color }">
            <!-- Palette -->
            <svg v-if="link.icon === 'palette'" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" />
              <circle cx="17.5" cy="10.5" r=".5" />
              <circle cx="8.5" cy="7.5" r=".5" />
              <circle cx="6.5" cy="12.5" r=".5" />
              <path
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
            </svg>
            <!-- Smartphone -->
            <svg v-else-if="link.icon === 'smartphone'" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
            <!-- Database -->
            <svg v-else-if="link.icon === 'database'" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5V19A9 3 0 0 0 21 19V5" />
              <path d="M3 12A9 3 0 0 0 21 12" />
            </svg>
            <!-- Layout -->
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div class="quick-info">
            <h3 class="quick-title">{{ link.title }}</h3>
            <p class="quick-desc">{{ link.desc }}</p>
          </div>
          <svg class="quick-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </router-link>
      </div>
    </section>

    <!-- 功能特性 -->
    <section class="features-section">
      <h2 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        核心特性
      </h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon">
            <!-- Zap -->
            <svg v-if="feature.icon === 'zap'" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <!-- Shield -->
            <svg v-else-if="feature.icon === 'shield'" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <!-- Layers -->
            <svg v-else-if="feature.icon === 'layers'" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <!-- Globe -->
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 设备信息 -->
    <section v-if="deviceInfo" class="device-section">
      <h2 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
        设备信息
      </h2>
      <div class="device-grid">
        <div class="device-item">
          <span class="device-label">设备类型</span>
          <span class="device-value">{{ deviceInfo.type }}</span>
        </div>
        <div class="device-item">
          <span class="device-label">操作系统</span>
          <span class="device-value">{{ deviceInfo.os?.name }} {{ deviceInfo.os?.version }}</span>
        </div>
        <div class="device-item">
          <span class="device-label">浏览器</span>
          <span class="device-value">{{ deviceInfo.browser?.name }} {{ deviceInfo.browser?.version }}</span>
        </div>
        <div class="device-item">
          <span class="device-label">屏幕尺寸</span>
          <span class="device-value">{{ deviceInfo.screenWidth }} × {{ deviceInfo.screenHeight }}</span>
        </div>
        <div class="device-item">
          <span class="device-label">屏幕方向</span>
          <span class="device-value">{{ deviceInfo.orientation }}</span>
        </div>
        <div class="device-item">
          <span class="device-label">设备像素比</span>
          <span class="device-value">{{ deviceInfo.pixelRatio }}x</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  padding: var(--size-space-lg, 24px);
  max-width: 1400px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.home-page.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 48px 40px;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 32px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-600, #4f46e5) 0%, var(--color-primary-800, #3730a3) 100%);
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: orb-float 15s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  left: 20%;
  animation-delay: -5s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 30%;
  animation-delay: -10s;
}

@keyframes orb-float {

  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }

  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.5;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  color: #fff;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.85;
  margin: 0 0 28px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  width: fit-content;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  text-transform: capitalize;
}

.stat-label {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.action-btn.primary {
  background: #fff;
  color: var(--color-primary-700, #4338ca);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.3);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(10px);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
  margin: 0 0 20px;
}

.section-title svg {
  color: var(--color-primary-default, #6366f1);
}

/* Quick Section */
.quick-section {
  margin-bottom: 32px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border-secondary, #e5e7eb);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-card:hover {
  border-color: var(--color-primary-200, #c7d2fe);
  box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

.quick-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: color-mix(in srgb, var(--icon-color) 10%, transparent);
  border-radius: 14px;
  color: var(--icon-color);
}

.quick-info {
  flex: 1;
}

.quick-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
  margin: 0 0 4px;
}

.quick-desc {
  font-size: 13px;
  color: var(--color-text-tertiary, #6b7280);
  margin: 0;
}

.quick-arrow {
  flex-shrink: 0;
  color: var(--color-text-quaternary, #9ca3af);
  transition: transform 0.2s;
}

.quick-card:hover .quick-arrow {
  transform: translateX(4px);
  color: var(--color-primary-default, #6366f1);
}

/* Features Section */
.features-section {
  margin-bottom: 32px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.feature-card {
  padding: 24px;
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border-secondary, #e5e7eb);
  border-radius: 16px;
  text-align: center;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: var(--color-primary-200, #c7d2fe);
  box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.1);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-primary-50, #eef2ff);
  border-radius: 12px;
  color: var(--color-primary-default, #6366f1);
  margin-bottom: 14px;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
  margin: 0 0 6px;
}

.feature-desc {
  font-size: 13px;
  color: var(--color-text-tertiary, #6b7280);
  margin: 0;
}

/* Device Section */
.device-section {
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border-secondary, #e5e7eb);
  border-radius: 16px;
  padding: 24px;
}

.device-section .section-title {
  margin-bottom: 16px;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.device-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  background: var(--color-fill-quaternary, #f9fafb);
  border-radius: 12px;
}

.device-label {
  font-size: 12px;
  color: var(--color-text-tertiary, #6b7280);
}

.device-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
}

/* Responsive */
@media (max-width: 768px) {
  .home-page {
    padding: 16px;
  }

  .hero-section {
    padding: 32px 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 16px;
  }

  .stat-divider {
    display: none;
  }

  .hero-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
