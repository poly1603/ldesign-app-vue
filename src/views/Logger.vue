<script setup lang="ts">
/**
 * 日志系统演示页面
 * 展示 @ldesign/logger-vue 的使用方法
 */
import { ref, computed, onMounted } from 'vue'
import {
  useComponentLogger,
  useErrorTracking,
  usePerformance,
  useRenderTiming,
  ErrorBoundary,
  LogLevel,
} from '@ldesign/logger-vue'
import { FileText, AlertTriangle, Bug, Activity, Clock, Trash2, Lightbulb, XCircle } from 'lucide-vue-next'

// 使用组件日志器
const { logger, info, debug, warn, error } = useComponentLogger('LoggerDemo')

// 错误追踪
const { addBreadcrumb, getBreadcrumbs, clearBreadcrumbs } = useErrorTracking()

// 性能监控
const { startTimer, timing, increment, gauge, getReport } = usePerformance()

// 渲染计时
const renderTime = useRenderTiming('LoggerDemo')

// 日志级别选项
const logLevels = [
  { label: 'TRACE', value: LogLevel.TRACE },
  { label: 'DEBUG', value: LogLevel.DEBUG },
  { label: 'INFO', value: LogLevel.INFO },
  { label: 'WARN', value: LogLevel.WARN },
  { label: 'ERROR', value: LogLevel.ERROR },
  { label: 'FATAL', value: LogLevel.FATAL },
]

// 当前日志级别
const currentLevel = ref(logger.level)
const logMessage = ref('测试日志消息')
const breadcrumbs = computed(() => getBreadcrumbs())
const performanceReport = ref<Record<string, unknown>>({})
const shouldError = ref(false)

/** 设置日志级别 */
function setLevel(level: LogLevel) {
  logger.level = level
  currentLevel.value = level
  info(`日志级别已设置为: ${LogLevel[level]}`)
}

/** 记录不同级别的日志 */
function logTrace() { logger.trace(logMessage.value, { timestamp: Date.now() }) }
function logDebug() { debug(logMessage.value, { component: 'LoggerDemo' }) }
function logInfo() { info(logMessage.value, { user: 'demo-user' }) }
function logWarn() { warn(logMessage.value, { warning: 'demo-warning' }) }
function logError() { error(logMessage.value, new Error('演示错误'), { errorCode: 'E001' }) }

/** 添加面包屑 */
function addClickBreadcrumb() {
  addBreadcrumb({ type: 'click', category: 'ui', message: '用户点击了按钮', data: { button: 'demo' } })
}
function addNavigationBreadcrumb() {
  addBreadcrumb({ type: 'navigation', category: 'navigation', message: '用户导航到日志页面' })
}

/** 性能测试 */
async function runPerformanceTest() {
  const timer = startTimer('performance-test')
  await new Promise(resolve => setTimeout(resolve, 500))
  timer.end()
  timing('api-response', 150)
  increment('api-calls')
  gauge('memory-usage', Math.random() * 100)
  performanceReport.value = getReport()
  info('性能测试完成', performanceReport.value)
}

/** 触发/重置错误 */
function triggerError() { shouldError.value = true }
function resetError() { shouldError.value = false }

/** 抛出错误 */
function throwError(): never { throw new Error('这是一个测试错误') }

onMounted(() => {
  info('日志演示页面已加载', { renderTime: renderTime.value })
  addNavigationBreadcrumb()
})
</script>

<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient" />
        <div class="hero-pattern" />
        <div class="hero-orbs">
          <div class="orb orb-1" />
          <div class="orb orb-2" />
        </div>
      </div>
      <div class="hero-content">
        <span class="hero-badge">
          <FileText class="w-3.5 h-3.5" />
          Logger
        </span>
        <h1 class="hero-title">日志系统</h1>
        <p class="hero-subtitle">
          全方位日志解决方案，集成日志分级、错误追踪、用户行为面包屑及性能监控。
        </p>
      </div>
    </section>

    <div class="main-grid">
      <div class="left-column">
        <!-- 日志级别控制 -->
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper primary">
              <Activity class="w-5 h-5" />
            </div>
            <div>
              <h2 class="card-title">日志级别</h2>
              <p class="card-desc">当前级别: <strong class="text-primary">{{ LogLevel[currentLevel] }}</strong></p>
            </div>
          </div>
          <div class="level-buttons">
            <button v-for="level in logLevels" :key="level.value" 
              :class="['level-btn', { active: currentLevel === level.value }]"
              @click="setLevel(level.value)">
              {{ level.label }}
            </button>
          </div>
        </section>

        <!-- 日志记录 -->
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper info">
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <h2 class="card-title">日志记录</h2>
              <p class="card-desc">模拟产生不同级别的日志</p>
            </div>
          </div>
          <div class="form-group">
            <input v-model="logMessage" placeholder="输入日志消息" class="custom-input">
          </div>
          <div class="log-actions">
            <button class="btn btn-trace" @click="logTrace">TRACE</button>
            <button class="btn btn-debug" @click="logDebug">DEBUG</button>
            <button class="btn btn-info" @click="logInfo">INFO</button>
            <button class="btn btn-warn" @click="logWarn">WARN</button>
            <button class="btn btn-error" @click="logError">ERROR</button>
          </div>
          <div class="console-hint">
            <Lightbulb class="w-4 h-4" />
            <span>打开浏览器控制台 (F12) 查看实际输出效果</span>
          </div>
        </section>

        <!-- 错误追踪 -->
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper error">
              <Bug class="w-5 h-5" />
            </div>
            <div>
              <h2 class="card-title">错误追踪</h2>
              <p class="card-desc">ErrorBoundary 组件演示</p>
            </div>
          </div>
          <div class="error-demo">
            <ErrorBoundary @error="(e) => info('捕获到错误', e)">
              <div v-if="shouldError">{{ throwError() }}</div>
              <template #fallback="{ error: err, reset }">
                <div class="error-fallback">
                  <div class="error-icon">
                    <XCircle class="w-6 h-6" />
                  </div>
                  <div class="error-content">
                    <h4>捕获到运行时错误</h4>
                    <p>{{ err?.message }}</p>
                  </div>
                  <button class="btn btn-primary btn-sm" @click="reset(); resetError()">重试</button>
                </div>
              </template>
            </ErrorBoundary>
            <button class="btn btn-danger w-full" @click="triggerError">
              <AlertTriangle class="w-4 h-4 mr-2" />
              触发测试错误
            </button>
          </div>
        </section>
      </div>

      <div class="right-column">
        <!-- 面包屑 -->
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper warning">
              <Clock class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h2 class="card-title">面包屑追踪</h2>
              <p class="card-desc">记录用户行为轨迹</p>
            </div>
            <button class="icon-btn" @click="clearBreadcrumbs" title="清空">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
          <div class="breadcrumb-actions">
            <button class="btn btn-outline btn-sm" @click="addClickBreadcrumb">+ 点击事件</button>
            <button class="btn btn-outline btn-sm" @click="addNavigationBreadcrumb">+ 导航事件</button>
          </div>
          <div class="breadcrumbs-list">
            <div v-if="breadcrumbs.length === 0" class="empty-state">
              暂无面包屑记录
            </div>
            <div v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
              <div class="crumb-line"></div>
              <span class="crumb-type">{{ crumb.type }}</span>
              <span class="crumb-message">{{ crumb.message }}</span>
            </div>
          </div>
        </section>

        <!-- 性能监控 -->
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper purple">
              <Activity class="w-5 h-5" />
            </div>
            <div>
              <h2 class="card-title">性能监控</h2>
              <p class="card-desc">关键指标采集</p>
            </div>
          </div>
          <button class="btn btn-purple w-full mb-4" @click="runPerformanceTest">
            <Activity class="w-4 h-4 mr-2" />
            运行性能测试
          </button>
          <div v-if="Object.keys(performanceReport).length" class="code-box">
            <pre>{{ JSON.stringify(performanceReport, null, 2) }}</pre>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout */
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.main-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Hero Section (Reused Style) */
.hero-section {
  position: relative;
  padding: 48px 40px;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 32px;
  background: linear-gradient(135deg, var(--color-primary-600, #4f46e5) 0%, var(--color-primary-900, #312e81) 100%);
  color: white;
  box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.3);
}

.hero-bg { position: absolute; inset: 0; }
.hero-pattern { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
.hero-orbs .orb { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.1); filter: blur(40px); animation: float 10s infinite ease-in-out; }
.orb-1 { width: 300px; height: 300px; top: -100px; right: -50px; }
.orb-2 { width: 200px; height: 200px; bottom: -50px; left: 10%; animation-delay: -5s; }
.hero-content { position: relative; z-index: 1; }
.hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); border-radius: 99px; font-size: 13px; font-weight: 600; margin-bottom: 16px; border: 1px solid rgba(255, 255, 255, 0.2); }
.hero-title { font-size: 36px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.02em; }
.hero-subtitle { font-size: 16px; opacity: 0.85; max-width: 600px; line-height: 1.6; }

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

/* Card Style */
.demo-card {
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border-secondary, #e5e7eb);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.demo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary-200, #bfdbfe);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.icon-wrapper.primary { background: var(--color-primary-50, #eff6ff); color: var(--color-primary-600, #2563eb); }
.icon-wrapper.info { background: var(--color-info-50, #f0f9ff); color: var(--color-info-600, #0284c7); }
.icon-wrapper.error { background: var(--color-error-50, #fef2f2); color: var(--color-error-600, #dc2626); }
.icon-wrapper.warning { background: var(--color-warning-50, #fffbeb); color: var(--color-warning-600, #d97706); }
.icon-wrapper.purple { background: #f3e8ff; color: #7e22ce; }

.card-title { font-size: 18px; font-weight: 600; color: var(--color-text-primary); margin: 0; }
.card-desc { font-size: 13px; color: var(--color-text-tertiary); margin: 4px 0 0; }
.text-primary { color: var(--color-primary-600); }

/* Components */
.level-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.level-btn { padding: 6px 16px; border-radius: 8px; border: 1px solid var(--color-border); background: transparent; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s; }
.level-btn:hover { background: var(--color-bg-layout); color: var(--color-text-primary); }
.level-btn.active { background: var(--color-primary-50); border-color: var(--color-primary-200); color: var(--color-primary-600); }

.custom-input { width: 100%; padding: 10px 16px; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg-layout); color: var(--color-text-primary); font-size: 14px; transition: all 0.2s; }
.custom-input:focus { outline: none; border-color: var(--color-primary-500); box-shadow: 0 0 0 3px var(--color-primary-100); }

.log-actions { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin: 16px 0; }
.btn { padding: 8px 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.btn:hover { transform: translateY(-1px); filter: brightness(0.95); }
.btn-sm { padding: 4px 12px; font-size: 12px; }
.w-full { width: 100%; }
.mb-4 { margin-bottom: 16px; }
.mr-2 { margin-right: 8px; }

.btn-trace { background: #f3f4f6; color: #4b5563; }
.btn-debug { background: #e5e7eb; color: #374151; }
.btn-info { background: #e0f2fe; color: #0284c7; }
.btn-warn { background: #fef3c7; color: #d97706; }
.btn-error { background: #fee2e2; color: #dc2626; }
.btn-primary { background: var(--color-primary-600); color: white; }
.btn-danger { background: #dc2626; color: white; }
.btn-purple { background: #7e22ce; color: white; }
.btn-outline { background: transparent; border: 1px solid var(--color-border); color: var(--color-text-secondary); }
.btn-outline:hover { border-color: var(--color-text-primary); color: var(--color-text-primary); }

.console-hint { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--color-warning-600); background: var(--color-warning-50); padding: 8px 12px; border-radius: 6px; }

.error-fallback { background: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.error-icon { color: #dc2626; }
.error-content h4 { margin: 0; font-size: 14px; color: #991b1b; }
.error-content p { margin: 2px 0 0; font-size: 12px; color: #b91c1c; }

.icon-btn { background: transparent; border: none; cursor: pointer; color: var(--color-text-tertiary); padding: 4px; border-radius: 4px; transition: all 0.2s; }
.icon-btn:hover { background: var(--color-bg-layout); color: var(--color-text-primary); }

.breadcrumb-actions { display: flex; gap: 8px; margin-bottom: 16px; }
.breadcrumbs-list { background: var(--color-bg-layout); border-radius: 12px; padding: 12px; max-height: 200px; overflow-y: auto; border: 1px solid var(--color-border-secondary); }
.breadcrumb-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px dashed var(--color-border-secondary); position: relative; }
.breadcrumb-item:last-child { border-bottom: none; }
.crumb-line { width: 2px; height: 100%; background: var(--color-border); position: absolute; left: 4px; top: 12px; z-index: 0; }
.breadcrumb-item:last-child .crumb-line { display: none; }
.crumb-type { font-size: 11px; font-weight: 700; color: var(--color-primary-600); background: var(--color-primary-50); padding: 2px 6px; border-radius: 4px; z-index: 1; }
.crumb-message { font-size: 13px; color: var(--color-text-secondary); }
.empty-state { text-align: center; color: var(--color-text-tertiary); font-size: 13px; padding: 20px; }

.code-box { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 12px; overflow-x: auto; }
</style>