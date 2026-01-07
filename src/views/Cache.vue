<script setup lang="ts">
/**
 * 缓存功能演示页面
 *
 * 展示 @ldesign/cache 的使用方法
 */
import { computed, ref } from 'vue'
import { useCache } from '@ldesign/cache-vue'
import {
  Database,
  Activity,
  Save,
  Search,
  Trash2,
  User,
  RotateCcw,
  Zap,
  Box,
  Target
} from 'lucide-vue-next'

// 使用缓存组合式函数
const { set, get, clear, stats } = useCache({
  // 使用默认策略，避免类型不匹配
  maxSize: 100,
  defaultTTL: 60000,
  enableStats: true,
})

// 计算命中率百分比
const hitRatePercent = computed(() => {
  const rate = stats.value.hitRate || 0
  return (rate * 100).toFixed(2)
})

// 统计字段计算属性，避免模板类型报错
const statsTotalKeys = computed(() => stats.value.totalKeys)
const statsHits = computed(() => stats.value.hits)
const statsMisses = computed(() => stats.value.misses)

// 响应式缓存示例
interface User {
  name: string
  age: number
}

const userCache = ref<User>({ name: '', age: 0 })

// 简单值缓存示例
const counter = ref<number>(0)

// 初始化时从缓存加载
const cachedUser = get('demo:user') as User | undefined
if (cachedUser) {
  userCache.value = cachedUser
}

const cachedCounter = get('demo:counter') as number | undefined
if (cachedCounter !== undefined) {
  counter.value = cachedCounter
}

// 表单数据
const formData = ref({
  key: '',
  value: '',
})

// 操作结果
const result = ref<string>('')

/**
 * 设置缓存
 */
function handleSet() {
  if (!formData.value.key || !formData.value.value) {
    result.value = '请输入键和值'
    return
  }

  try {
    set(formData.value.key, formData.value.value, 60000)
    result.value = `成功设置: ${formData.value.key} = ${formData.value.value}`
  }
  catch (error) {
    result.value = `设置失败: ${error}`
  }
}

/**
 * 获取缓存
 */
function handleGet() {
  if (!formData.value.key) {
    result.value = '请输入键'
    return
  }

  try {
    const value = get(formData.value.key) as string | undefined
    result.value = value !== undefined ? `获取成功: ${formData.value.key} = ${value}` : `键 "${formData.value.key}" 不存在`
  }
  catch (error) {
    result.value = `获取失败: ${error}`
  }
}

/**
 * 清空缓存
 */
function handleClear() {
  try {
    clear()
    result.value = '缓存已清空'
  }
  catch (error) {
    result.value = `清空失败: ${error}`
  }
}

/**
 * 更新用户缓存
 */
function updateUser() {
  const newUser = {
    name: `用户${Math.floor(Math.random() * 100)}`,
    age: Math.floor(Math.random() * 50) + 18,
  }
  userCache.value = newUser
  set('demo:user', newUser, 60000)
}

/**
 * 增加计数器
 */
function incrementCounter() {
  const newValue = (counter.value ?? 0) + 1
  counter.value = newValue
  set('demo:counter', newValue, 60000)
}
</script>

<template>
  <div class="cache-demo page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <Database class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">缓存管理</h1>
          <p class="page-desc">展示 @ldesign/cache 的使用方法，包括基础读写、统计信息和响应式缓存。</p>
        </div>
      </div>
    </div>

    <!-- 缓存统计 -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <Activity class="section-icon" />
          缓存统计
        </h2>
      </div>
      <div v-if="stats" class="stats-grid">
        <div class="stat-item">
          <span class="label">
            <Box class="stat-icon" /> 总键数
          </span>
          <span class="value">{{ statsTotalKeys }}</span>
        </div>
        <div class="stat-item">
          <span class="label">
            <Target class="stat-icon" /> 命中次数
          </span>
          <span class="value">{{ statsHits }}</span>
        </div>
        <div class="stat-item">
          <span class="label">
            <Target class="stat-icon off" /> 未命中次数
          </span>
          <span class="value">{{ statsMisses }}</span>
        </div>
        <div class="stat-item">
          <span class="label">
            <Zap class="stat-icon" /> 命中率
          </span>
          <span class="value">{{ hitRatePercent }}%</span>
        </div>
      </div>
    </div>

    <div class="grid-layout">
      <!-- 基础操作 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Database class="section-icon" />
            基础操作
          </h2>
        </div>
        <div class="form-group">
          <input v-model="formData.key" placeholder="缓存键" class="input">
          <input v-model="formData.value" placeholder="缓存值" class="input">
        </div>
        <div class="button-group">
          <button class="action-btn primary" @click="handleSet">
            <Save class="btn-icon" />
            设置
          </button>
          <button class="action-btn secondary" @click="handleGet">
            <Search class="btn-icon" />
            获取
          </button>
          <button class="action-btn danger" @click="handleClear">
            <Trash2 class="btn-icon" />
            清空
          </button>
        </div>
        <div v-if="result" class="result-box">
          {{ result }}
        </div>
      </div>

      <!-- 用户缓存示例 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <User class="section-icon" />
            用户缓存示例
          </h2>
        </div>
        <div class="info-card">
          <template v-if="userCache.name">
            <div class="info-row">
              <strong>姓名:</strong> {{ userCache.name }}
            </div>
            <div class="info-row">
              <strong>年龄:</strong> {{ userCache.age }}
            </div>
          </template>
          <template v-else>
            <p class="empty-text">暂无用户数据</p>
          </template>
        </div>
        <button class="action-btn primary block-btn" @click="updateUser">
          <RotateCcw class="btn-icon" />
          随机更新用户
        </button>
      </div>

      <!-- 计数器示例 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Zap class="section-icon" />
            计数器示例
          </h2>
        </div>
        <div class="counter-display">
          <span class="counter-value">{{ counter ?? 0 }}</span>
        </div>
        <button class="action-btn secondary block-btn" @click="incrementCounter">
          +1 增加计数
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cache-demo {
  max-width: 1200px;
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
  margin: 0;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--size-space-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: var(--size-space-lg);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  text-align: center;
  border: 1px solid var(--color-border);
  transition: transform 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary-200);
}

.stat-item .label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin-bottom: var(--size-space-sm);
}

.stat-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.stat-icon.off {
  color: var(--color-text-quaternary);
}

.stat-item .value {
  font-weight: 700;
  color: var(--color-primary-500);
  font-size: var(--size-font-2xl);
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--size-space-lg);
}

/* Form & Inputs */
.form-group {
  display: flex;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
  transition: all 0.2s;
}

.input:focus {
  border-color: var(--color-primary-500);
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

/* Buttons */
.button-group {
  display: flex;
  gap: var(--size-space-md);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  background: var(--color-bg-container);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
  font-weight: 500;
  flex: 1;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  background: var(--color-bg-hover);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.action-btn.primary:hover {
  background: var(--color-primary-600);
}

.action-btn.secondary {
  background: var(--color-bg-page);
}

.action-btn.danger {
  background: var(--color-error-50);
  color: var(--color-error-600);
  border-color: var(--color-error-200);
}

.action-btn.danger:hover {
  background: var(--color-error-100);
}

.block-btn {
  display: flex;
  width: 100%;
}

/* Result Box */
.result-box {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-primary-50);
  border-radius: var(--size-radius-md);
  color: var(--color-primary-700);
  font-size: var(--size-font-sm);
  border: 1px solid var(--color-primary-100);
  text-align: center;
}

/* Info Card */
.info-card {
  margin-bottom: var(--size-space-md);
  padding: var(--size-space-lg);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.info-row {
  margin-bottom: 8px;
  color: var(--color-text-primary);
}

.info-row strong {
  color: var(--color-text-secondary);
  margin-right: 8px;
}

.empty-text {
  color: var(--color-text-tertiary);
  text-align: center;
  font-style: italic;
}

/* Counter */
.counter-display {
  text-align: center;
  margin-bottom: var(--size-space-md);
  padding: var(--size-space-lg);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.counter-value {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary-500);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 768px) {
  .cache-demo {
    padding: var(--size-space-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .form-group {
    flex-direction: column;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>
