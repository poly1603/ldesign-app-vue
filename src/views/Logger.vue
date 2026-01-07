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
  <div class="logger-demo page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <FileText class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">日志系统演示</h1>
          <p class="page-desc">展示 @ldesign/logger-vue 的使用方法，包括日志分级、错误追踪、面包屑和性能监控。</p>
        </div>
      </div>
    </div>

    <div class="grid-layout">
      <!-- 日志级别控制 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Activity class="section-icon" />
            日志级别
          </h2>
        </div>
        <div class="level-buttons">
          <button v-for="level in logLevels" :key="level.value" :class="['level-btn', { active: currentLevel === level.value }]"
            @click="setLevel(level.value)">
            {{ level.label }}
          </button>
        </div>
        <p class="hint">当前级别: <strong>{{ LogLevel[currentLevel] }}</strong></p>
      </div>

      <!-- 日志记录 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <FileText class="section-icon" />
            日志记录
          </h2>
        </div>
        <div class="form-group">
          <input v-model="logMessage" placeholder="输入日志消息" class="input">
        </div>
        <div class="button-group wrap">
          <button class="action-btn btn-trace" @click="logTrace">TRACE</button>
          <button class="action-btn btn-debug" @click="logDebug">DEBUG</button>
          <button class="action-btn btn-info" @click="logInfo">INFO</button>
          <button class="action-btn btn-warn" @click="logWarn">WARN</button>
          <button class="action-btn btn-error" @click="logError">ERROR</button>
        </div>
        <p class="hint flex-center">
          <Lightbulb class="inline-icon" />
          打开浏览器控制台查看日志输出
        </p>
      </div>
    </div>

    <!-- 错误追踪 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Bug class="section-icon" />
          错误追踪
        </h2>
      </div>
      <ErrorBoundary @error="(e) => info('捕获到错误', e)">
        <div v-if="shouldError">{{ throwError() }}</div>
        <template #fallback="{ error: err, reset }">
          <div class="error-fallback">
            <p class="flex-center">
              <XCircle class="inline-icon" />
              捕获到错误: {{ err?.message }}
            </p>
            <button class="action-btn btn-info" @click="reset(); resetError()">重试</button>
          </div>
        </template>
      </ErrorBoundary>
      <button class="action-btn btn-danger" @click="triggerError">
        <AlertTriangle class="btn-icon" />
        触发测试错误
      </button>
    </div>

    <!-- 面包屑 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Clock class="section-icon" />
          面包屑追踪
        </h2>
      </div>
      <div class="button-group mb-md">
        <button class="action-btn secondary" @click="addClickBreadcrumb">添加点击面包屑</button>
        <button class="action-btn secondary" @click="addNavigationBreadcrumb">添加导航面包屑</button>
        <button class="action-btn btn-warning" @click="clearBreadcrumbs()">
          <Trash2 class="btn-icon" />
          清空
        </button>
      </div>
      <div class="breadcrumbs-list">
        <div v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
          <span class="crumb-type">{{ crumb.type }}</span>
          <span class="crumb-message">{{ crumb.message }}</span>
        </div>
        <p v-if="breadcrumbs.length === 0" class="empty-text">暂无面包屑</p>
      </div>
    </div>

    <!-- 性能监控 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Activity class="section-icon" />
          性能监控
        </h2>
      </div>
      <button class="action-btn btn-info mb-md" @click="runPerformanceTest">
        <Activity class="btn-icon" />
        运行性能测试
      </button>
      <div v-if="Object.keys(performanceReport).length" class="performance-report">
        <pre class="code-block">{{ JSON.stringify(performanceReport, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logger-demo {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--size-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--size-space-lg);
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  color: white;
  padding: var(--size-space-xl);
  border-radius: var(--size-radius-lg);
  border: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--size-space-lg);
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-round);
  display: flex;
}

.icon-hero {
  width: 48px;
  height: 48px;
  color: white;
}

.page-title {
  font-size: var(--size-font-2xl);
  font-weight: 700;
  margin: 0 0 var(--size-space-xs);
  color: white;
}

.page-desc {
  font-size: var(--size-font-md);
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
}

/* Section Card */
.section-card {
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  padding: var(--size-space-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-header {
  margin-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
  padding-bottom: var(--size-space-sm);
}

.section-title {
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  margin: 0 0 var(--size-space-xs);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--size-space-lg);
}

/* Form */
.form-group {
  margin-bottom: var(--size-space-md);
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

/* Buttons */
.button-group {
  display: flex;
  gap: var(--size-space-md);
}

.button-group.wrap {
  flex-wrap: wrap;
}

.mb-md {
  margin-bottom: var(--size-space-md);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
  font-weight: 500;
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.95);
}

.action-btn.secondary {
  background: var(--color-bg-page);
}

/* Log Levels */
.level-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-space-sm);
  margin-bottom: var(--size-space-sm);
}

.level-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  background: var(--color-bg-page);
  cursor: pointer;
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.level-btn.active {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

/* Log Colors */
.btn-trace { background: var(--color-bg-layout); color: var(--color-text-tertiary); }
.btn-debug { background: #6c757d; color: white; border-color: #6c757d; }
.btn-info { background: var(--color-info-500); color: white; border-color: var(--color-info-500); }
.btn-warn { background: var(--color-warning-500); color: white; border-color: var(--color-warning-500); }
.btn-error { background: var(--color-error-500); color: white; border-color: var(--color-error-500); }
.btn-danger { background: var(--color-error-500); color: white; border-color: var(--color-error-500); }
.btn-warning { background: var(--color-warning-500); color: white; border-color: var(--color-warning-500); }

.hint {
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin-top: var(--size-space-sm);
}

/* Error Fallback */
.error-fallback {
  padding: var(--size-space-md);
  background: var(--color-error-bg);
  border-radius: var(--size-radius-md);
  margin-bottom: var(--size-space-md);
  border: 1px solid var(--color-error-border);
  color: var(--color-error-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Breadcrumbs */
.breadcrumbs-list {
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
  padding: var(--size-space-sm);
  max-height: 200px;
  overflow-y: auto;
}

.breadcrumb-item {
  display: flex;
  gap: var(--size-space-md);
  padding: 8px;
  border-bottom: 1px dashed var(--color-border);
}

.breadcrumb-item:last-child {
  border-bottom: none;
}

.crumb-type {
  font-weight: 600;
  color: var(--color-primary-500);
  min-width: 80px;
  font-size: var(--size-font-xs);
  text-transform: uppercase;
}

.crumb-message {
  color: var(--color-text-primary);
  font-size: var(--size-font-sm);
}

.empty-text {
  color: var(--color-text-tertiary);
  font-style: italic;
  text-align: center;
  padding: var(--size-space-md);
}

.performance-report {
  margin-top: var(--size-space-md);
}

.code-block {
  margin: 0;
  padding: var(--size-space-md);
  background: var(--color-bg-layout);
  border-radius: var(--size-radius-md);
  overflow-x: auto;
  font-family: monospace;
  font-size: var(--size-font-xs);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.flex-center {
  display: flex;
  align-items: center;
  gap: 6px;
}

.inline-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .logger-demo {
    padding: var(--size-space-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>