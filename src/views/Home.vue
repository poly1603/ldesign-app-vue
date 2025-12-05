<script setup lang="ts">
import { useEngine } from '@ldesign/engine-vue3'
import { useI18n } from '@ldesign/i18n-vue'
import { useAppConfig, useLauncherConfig } from '@ldesign/launcher/client/vue'
import { computed, onMounted, ref } from 'vue'

const engine = useEngine()
console.log('[Home] Engine:', engine)

// 设备信息实时获取演示
const deviceInfo = ref<any>(null)
const deviceUpdateCount = ref(0)

onMounted(() => {
  if (engine) {
    // 从 engine API 获取设备信息
    const deviceService = engine.api.get('device')
    if (deviceService) {
      deviceInfo.value = deviceService.getDeviceInfo()
      console.log('📱 [Home] 初始设备信息:', deviceInfo.value)
    }

    // 监听设备变化事件
    engine.events.on('device:change', (info: any) => {
      console.log('📱 [Home] 设备信息已更新:', info)
      deviceInfo.value = info
      deviceUpdateCount.value++
    })

    engine.events.on('device:orientation-change', (orientation: any) => {
      console.log('📱 [Home] 屏幕方向已更新:', orientation)
      deviceUpdateCount.value++
    })
  }
})

function refreshDeviceInfo() {
  if (engine) {
    const deviceService = engine.api.get('device')
    if (deviceService) {
      deviceInfo.value = deviceService.refresh()
      console.log('🔄 [Home] 设备信息已刷新:', deviceInfo.value)
    }
  }
}

function logDeviceInfo() {
  console.log('📋 [Home] 当前设备信息:', deviceInfo.value)
  console.log('📋 [Home] 更新次数:', deviceUpdateCount.value)
  if (engine) {
    const deviceService = engine.api.get('device')
    console.log('📋 [Home] Device Service:', deviceService)
  }
}

// i18n composable
const { t, locale, setLocale } = useI18n()
function toggleLocale() {
  setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
}

// 使用 launcher 提供的 useAppConfig composable（支持热更新）
const { config: appConfig, environment } = useAppConfig()

// 使用 launcher 提供的 useLauncherConfig composable（支持热更新）
const { config: launcherConfig, environment: launcherEnv } = useLauncherConfig()

// 当前环境
const currentEnv = computed(() => {
  return appConfig.value?.app?.environment || environment.value.mode || 'development'
})

// 环境徽章样式
const envBadgeClass = computed(() => {
  const env = currentEnv.value
  if (env === 'development')
    return 'badge-success'
  if (env === 'production')
    return 'badge-danger'
  if (env === 'staging')
    return 'badge-warning'
  return 'badge-info'
})

// 环境信息
const envInfo = {
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
}

// Launcher 模式
const launcherMode = computed(() => {
  return import.meta.env.MODE || 'development'
})

// 环境变量（只显示 VITE_ 开头的）
const envVars = computed(() => {
  const env = import.meta.env
  const vars: Record<string, any> = {}

  Object.keys(env).forEach((key) => {
    if (key.startsWith('VITE_')) {
      vars[key] = env[key]
    }
  })

  return vars
})

// 全局常量
const globalConstants = {
  __DEV__: typeof __DEV__ !== 'undefined' ? __DEV__ : 'undefined',
  __PROD__: typeof __PROD__ !== 'undefined' ? __PROD__ : 'undefined',
  __BUILD_TIME__: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'undefined',
  __APP_VERSION__: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'undefined',
}

// 格式化值
function formatValue(value: any): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

// HMR 已由 useAppConfig 和 useLauncherConfig 自动处理
// 这里只需要监听以便在控制台输出日志
if (import.meta.hot) {
  import.meta.hot.on('app-config-updated', (newConfig) => {
    console.log('🔥 [HMR] 应用配置已更新:', newConfig)
  })

  import.meta.hot.on('launcher-config-updated', (data) => {
    console.log('🔥 [HMR] Launcher 配置已更新:', data)
  })

  console.log('✅ 配置热更新监听已启用')
}
</script>

<template>
  <div class="container">
    <!-- 欢迎卡片 -->
    <div class="card welcome-card">
      <h1>{{ $t('home.title') }}</h1>
      <p>{{ $t('home.subtitle') }}</p>

      <div style="margin-top: 2rem;">
        <router-link to="/login">
          <button class="btn btn-primary">
            {{ $t('home.goToLogin') }}
          </button>
        </router-link>
        <router-link to="/theme" style="margin-left: 1rem;">
          <button class="btn btn-secondary">
            {{ $t('theme.title') }}
          </button>
        </router-link>
        <router-link to="/device" style="margin-left: 1rem;">
          <button class="btn btn-secondary">
            📱 {{ $t('home.device.deviceInfo') }}
          </button>
        </router-link>
      </div>

      <!-- i18n 演示区：快速验证切换是否生效 -->
      <div class="i18n-demo">
        <p>{{ t('home.demo.greeting', { name: 'Developer' }) }}</p>
        <p>{{ t('home.demo.today', { date: new Date().toLocaleDateString() }) }}</p>
        <div class="demo-actions">
          <button class="btn" @click="toggleLocale">
            {{ t('home.demo.switch') }} ({{ locale }})
          </button>
        </div>
      </div>
    </div>

    <!-- 设备信息实时获取演示 -->
    <div class="card device-demo-card">
      <div class="card-header">
        <h2>📱 {{ $t('home.device.title') }}</h2>
        <span class="badge badge-success">{{ $t('home.device.realtimeUpdate') }}</span>
      </div>
      <div class="card-body">
        <p class="description">
          {{ $t('home.device.description') }}
        </p>
        <div v-if="deviceInfo" class="device-info-grid">
          <div class="info-item">
            <span class="label">{{ $t('home.device.deviceType') }}:</span>
            <span class="value">{{ deviceInfo.type }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('home.device.os') }}:</span>
            <span class="value">{{ deviceInfo.os }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('home.device.browser') }}:</span>
            <span class="value">{{ deviceInfo.browser }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('home.device.orientation') }}:</span>
            <span class="value">{{ deviceInfo.orientation }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('home.device.screenSize') }}:</span>
            <span class="value">{{ deviceInfo.screenWidth }} x {{ deviceInfo.screenHeight }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('home.device.updateCount') }}:</span>
            <span class="value badge badge-info">{{ deviceUpdateCount }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>{{ $t('home.device.notLoaded') }}</p>
        </div>
        <div class="demo-actions" style="margin-top: 1rem;">
          <button class="btn btn-primary" @click="refreshDeviceInfo">
            🔄 {{ $t('home.device.refresh') }}
          </button>
          <button class="btn btn-secondary" @click="logDeviceInfo">
            📋 {{ $t('home.device.printToConsole') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 配置展示面板 -->
    <div class="config-panels">
      <!-- 应用配置面板 -->
      <div class="card config-card">
        <div class="card-header">
          <h2>📱 {{ $t('home.appConfig') }}</h2>
          <span class="badge" :class="envBadgeClass">{{ currentEnv }}</span>
        </div>
        <div class="card-body">
          <div v-if="appConfig" class="config-content">
            <div v-for="(value, key) in appConfig" :key="key" class="config-item">
              <div class="config-key">
                {{ key }}
              </div>
              <div class="config-value">
                <pre>{{ formatValue(value) }}</pre>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>⚠️ {{ $t('home.noConfigFound') }}</p>
            <p class="hint">
              {{ $t('home.ensureConfigExists') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Launcher 配置面板 -->
      <div class="card config-card">
        <div class="card-header">
          <h2>🚀 {{ $t('home.launcherConfig') }}</h2>
          <span class="badge badge-info">{{ launcherMode }}</span>
        </div>
        <div class="card-body">
          <div class="config-content">
            <!-- Launcher 配置内容 -->
            <div v-if="launcherConfig" class="config-section">
              <h3>📋 {{ $t('home.launcherConfig') }}</h3>
              <div v-for="(value, key) in launcherConfig" :key="key" class="config-item">
                <div class="config-key">
                  {{ key }}
                </div>
                <div class="config-value">
                  <code>{{ formatValue(value) }}</code>
                </div>
              </div>
            </div>

            <!-- 环境信息 -->
            <div class="config-section">
              <h3>🌍 {{ $t('home.envInfo') }}</h3>
              <div class="config-item">
                <div class="config-key">
                  NODE_ENV
                </div>
                <div class="config-value">
                  <code>{{ envInfo.MODE }}</code>
                </div>
              </div>
              <div class="config-item">
                <div class="config-key">
                  DEV
                </div>
                <div class="config-value">
                  <code>{{ envInfo.DEV }}</code>
                </div>
              </div>
              <div class="config-item">
                <div class="config-key">
                  PROD
                </div>
                <div class="config-value">
                  <code>{{ envInfo.PROD }}</code>
                </div>
              </div>
            </div>

            <!-- 环境变量 -->
            <div class="config-section">
              <h3>{{ $t('home.envVars') }}</h3>
              <div v-for="(value, key) in envVars" :key="key" class="config-item">
                <div class="config-key">
                  {{ key }}
                </div>
                <div class="config-value">
                  <code>{{ value }}</code>
                </div>
              </div>
            </div>

            <!-- 全局常量 -->
            <div class="config-section">
              <h3>{{ $t('home.globalConstants') }}</h3>
              <div class="config-item">
                <div class="config-key">
                  __DEV__
                </div>
                <div class="config-value">
                  <code>{{ globalConstants.__DEV__ }}</code>
                </div>
              </div>
              <div class="config-item">
                <div class="config-key">
                  __PROD__
                </div>
                <div class="config-value">
                  <code>{{ globalConstants.__PROD__ }}</code>
                </div>
              </div>
              <div class="config-item">
                <div class="config-key">
                  __BUILD_TIME__
                </div>
                <div class="config-value">
                  <code>{{ globalConstants.__BUILD_TIME__ }}</code>
                </div>
              </div>
              <div class="config-item">
                <div class="config-key">
                  __APP_VERSION__
                </div>
                <div class="config-value">
                  <code>{{ globalConstants.__APP_VERSION__ }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置说明 -->
    <div class="card info-card">
      <div class="card-header">
        <h2>💡 {{ $t('home.configInfo') }}</h2>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-item">
            <h3>📁 {{ $t('home.configFileLocation') }}</h3>
            <ul>
              <li><code>.ldesign/app.config.ts</code> - {{ $t('home.appConfigFile') }}</li>
              <li><code>.ldesign/app.config.{{ currentEnv }}.ts</code> - {{ $t('home.currentEnvConfigFile') }}</li>
              <li><code>.ldesign/launcher.config.ts</code> - {{ $t('home.launcherConfigFile') }}</li>
              <li>
                <code>.ldesign/launcher.config.{{ currentEnv }}.ts</code> - {{ $t('home.launcherEnvConfigFile') }}
              </li>
            </ul>
          </div>
          <div class="info-item">
            <h3>🔄 {{ $t('home.switchEnv') }}</h3>
            <ul>
              <li><code>pnpm dev</code> - {{ $t('home.devEnv') }}</li>
              <li><code>pnpm dev:staging</code> - {{ $t('home.stagingEnv') }}</li>
              <li><code>pnpm dev:prod</code> - {{ $t('home.prodEnv') }}</li>
            </ul>
          </div>
          <div class="info-item">
            <h3>📝 {{ $t('home.configMergeRules') }}</h3>
            <p>{{ $t('home.configMergeDesc') }}</p>
          </div>
          <div class="info-item">
            <h3>🔥 {{ $t('home.hotReload') }}</h3>
            <ul>
              <li><strong>{{ $t('home.appConfig') }}</strong>：{{ $t('home.appConfigHotReload') }}</li>
              <li><strong>{{ $t('home.launcherConfig') }}</strong>：{{ $t('home.launcherConfigHotReload') }}</li>
              <li>{{ $t('home.canHotReload') }}</li>
              <li>{{ $t('home.needRestart') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* 欢迎卡片 */
.welcome-card {
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--color-primary-500, #667eea) 0%, var(--color-primary-700, #764ba2) 100%);
  color: var(--color-text-inverse, #ffffff);
  border: none;
}

.welcome-card h1 {
  color: var(--color-text-inverse, #ffffff);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-card p {
  color: var(--color-text-inverse-secondary, rgba(255, 255, 255, 0.9));
  font-size: 1.1rem;
}

/* i18n 演示区样式 */
.i18n-demo {
  margin-top: 1.5rem;
}

.demo-actions {
  margin-top: 0.75rem;
}

/* 配置面板网格 */
.config-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* 配置卡片 */
.config-card {
  height: fit-content;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid var(--color-border, #f0f0f0);
  background: linear-gradient(to right,
      var(--color-bg-container-secondary, #f8f9fa),
      var(--color-bg-container, #ffffff));
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-primary, #2c3e50);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-body {
  padding: 1.5rem;
  max-height: 600px;
  overflow-y: auto;
}

/* 徽章 */
.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background: var(--color-success-default, #10b981);
  color: var(--color-text-inverse, #ffffff);
}

.badge-danger {
  background: var(--color-danger-default, #ef4444);
  color: var(--color-text-inverse, #ffffff);
}

.badge-warning {
  background: var(--color-warning-default, #f59e0b);
  color: var(--color-text-inverse, #ffffff);
}

.badge-info {
  background: var(--color-primary-default, #3b82f6);
  color: var(--color-text-inverse, #ffffff);
}

/* 配置内容 */
.config-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-section {
  margin-bottom: 1.5rem;
}

.config-section h3 {
  font-size: 1.1rem;
  color: var(--color-text-secondary, #4b5563);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border, #e5e7eb);
}

.config-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-bg-container-secondary, #f9fafb);
  border-radius: 8px;
  border-left: 3px solid var(--color-primary-default, #3b82f6);
  transition: all 0.2s;
}

.config-item:hover {
  background: var(--color-bg-container-tertiary, #f3f4f6);
  border-left-color: var(--color-primary-hover, #2563eb);
  transform: translateX(4px);
}

.config-key {
  font-weight: 600;
  color: var(--color-text-primary, #374151);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.config-value {
  color: var(--color-text-secondary, #6b7280);
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 0.85rem;
}

.config-value pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  background: var(--color-bg-component, #ffffff);
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--color-border, #e5e7eb);
}

.config-value code {
  background: var(--color-bg-component, #ffffff);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--color-border, #e5e7eb);
  color: var(--color-success-default, #059669);
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-tertiary, #9ca3af);
}

.empty-state p {
  margin: 0.5rem 0;
}

.empty-state .hint {
  font-size: 0.9rem;
  color: var(--color-text-disabled, #d1d5db);
}

/* 信息卡片 */
.info-card {
  background: linear-gradient(135deg,
      var(--color-bg-container-secondary) 0%,
      var(--color-bg-container) 100%);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--size-space-lg);
}

.info-item h3 {
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-sm);
  display: flex;
  align-items: center;
  gap: var(--size-space-xs);
}

.info-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-item li {
  padding: var(--size-space-xs) 0;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--size-space-xs);
}

.info-item li::before {
  content: '▸';
  color: var(--color-primary-default);
  font-weight: bold;
}

.info-item code {
  background: var(--color-bg-container-tertiary);
  padding: var(--size-space-xxs) var(--size-space-xs);
  border-radius: var(--size-radius-xs);
}

/* 设备信息演示卡片 */
.device-demo-card {
  margin-top: var(--size-space-xl);
}

.device-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--size-space-md);
  margin-top: var(--size-space-md);
}

.device-info-grid .info-item {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-xs);
  padding: var(--size-space-md);
  background: var(--color-bg-container-secondary);
  border-radius: var(--size-radius-md);
  border: var(--size-border-width-thin) solid var(--color-border-default);
}

.device-info-grid .label {
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
  font-weight: var(--size-font-weight-medium);
}

.device-info-grid .value {
  font-size: var(--size-font-md);
  color: var(--color-text-primary);
  font-weight: var(--size-font-weight-semibold);
}

.badge-success {
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-hover) 100%);
}

.badge-info {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  padding: var(--size-space-xxs) var(--size-space-sm);
  border-radius: var(--size-radius-lg);
  color: var(--color-text-inverse);
  font-size: var(--size-font-sm);
  font-weight: var(--size-font-weight-semibold);
}

.info-item p {
  color: var(--color-text-secondary);
  line-height: var(--size-line-relaxed);
  margin: 0;
}

/* 滚动条样式 */
.card-body::-webkit-scrollbar {
  width: var(--size-space-xs);
}

.card-body::-webkit-scrollbar-track {
  background: var(--color-bg-container-secondary);
  border-radius: var(--size-radius-xs);
}

.card-body::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--size-radius-xs);
}

.card-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-dark);
}

/* 响应式 */
@media (max-width: 768px) {
  .config-panels {
    grid-template-columns: 1fr;
  }

  .config-item {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
