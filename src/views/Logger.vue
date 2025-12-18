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
    <h1 class="page-title">📝 日志系统演示</h1>

    <!-- 日志级别控制 -->
    <section class="section-card">
      <h2 class="section-title">日志级别</h2>
      <div class="level-buttons">
        <button v-for="level in logLevels" :key="level.value" :class="['btn', { active: currentLevel === level.value }]"
          @click="setLevel(level.value)">
          {{ level.label }}
        </button>
      </div>
      <p class="hint">当前级别: <strong>{{ LogLevel[currentLevel] }}</strong></p>
    </section>

    <!-- 日志记录 -->
    <section class="section-card">
      <h2 class="section-title">日志记录</h2>
      <div class="form-group">
        <input v-model="logMessage" placeholder="输入日志消息" class="input">
      </div>
      <div class="button-group">
        <button class="btn btn-trace" @click="logTrace">TRACE</button>
        <button class="btn btn-debug" @click="logDebug">DEBUG</button>
        <button class="btn btn-info" @click="logInfo">INFO</button>
        <button class="btn btn-warn" @click="logWarn">WARN</button>
        <button class="btn btn-error" @click="logError">ERROR</button>
      </div>
      <p class="hint">💡 打开浏览器控制台查看日志输出</p>
    </section>

    <!-- 错误追踪 -->
    <section class="section-card">
      <h2 class="section-title">错误追踪</h2>
      <ErrorBoundary @error="(e) => info('捕获到错误', e)">
        <div v-if="shouldError">{{ throwError() }}</div>
        <template #fallback="{ error: err, reset }">
          <div class="error-fallback">
            <p>❌ 捕获到错误: {{ err?.message }}</p>
            <button class="btn btn-info" @click="reset(); resetError()">重试</button>
          </div>
        </template>
      </ErrorBoundary>
      <button class="btn btn-danger" @click="triggerError">触发测试错误</button>
    </section>

    <!-- 面包屑 -->
    <section class="section-card">
      <h2 class="section-title">面包屑追踪</h2>
      <div class="button-group">
        <button class="btn" @click="addClickBreadcrumb">添加点击面包屑</button>
        <button class="btn" @click="addNavigationBreadcrumb">添加导航面包屑</button>
        <button class="btn btn-warning" @click="clearBreadcrumbs()">清空</button>
      </div>
      <div class="breadcrumbs-list">
        <div v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
          <span class="crumb-type">{{ crumb.type }}</span>
          <span class="crumb-message">{{ crumb.message }}</span>
        </div>
        <p v-if="breadcrumbs.length === 0" class="empty-text">暂无面包屑</p>
      </div>
    </section>

    <!-- 性能监控 -->
    <section class="section-card">
      <h2 class="section-title">性能监控</h2>
      <button class="btn btn-info" @click="runPerformanceTest">运行性能测试</button>
      <div v-if="Object.keys(performanceReport).length" class="performance-report">
        <pre class="code-block">{{ JSON.stringify(performanceReport, null, 2) }}</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.logger-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--size-space-lg);
}

.page-title {
  font-size: var(--size-font-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xl);
}

.section-card {
  margin-bottom: var(--size-space-lg);
  padding: var(--size-space-lg);
  background: var(--color-bg-container);
  border-radius: var(--size-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-title {
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
  padding-bottom: var(--size-space-sm);
  font-weight: 600;
}

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
}

.button-group,
.level-buttons {
  display: flex;
  gap: var(--size-space-md);
  flex-wrap: wrap;
  margin-bottom: var(--size-space-sm);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  background: var(--color-bg-component);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
  font-weight: 500;
  border: 1px solid var(--color-border);
}

.btn:hover {
  background: var(--color-bg-component-hover);
}

.btn.active {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn-trace {
  background: var(--color-text-tertiary);
  color: white;
}

.btn-debug {
  background: #6c757d;
  color: white;
}

.btn-info {
  background: var(--color-info-500);
  color: white;
}

.btn-warn {
  background: var(--color-warning-500);
  color: white;
}

.btn-error {
  background: var(--color-error-500);
  color: white;
}

.btn-danger {
  background: var(--color-error-500);
  color: white;
}

.hint {
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin-top: var(--size-space-sm);
}

.error-fallback {
  padding: var(--size-space-md);
  background: var(--color-error-bg);
  border-radius: var(--size-radius-md);
  margin-bottom: var(--size-space-md);
  border: 1px solid var(--color-error-border);
  color: var(--color-error-text);
}

.breadcrumbs-list {
  margin-top: var(--size-space-md);
}

.breadcrumb-item {
  display: flex;
  gap: var(--size-space-md);
  padding: 8px;
  background: var(--color-bg-page);
  margin-bottom: 4px;
  border-radius: var(--size-radius-sm);
  font-size: var(--size-font-sm);
  border: 1px solid var(--color-border);
}

.crumb-type {
  font-weight: 600;
  color: var(--color-primary-500);
  min-width: 80px;
}

.crumb-message {
  color: var(--color-text-primary);
}

.empty-text {
  color: var(--color-text-tertiary);
  font-style: italic;
  text-align: center;
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
</style>
