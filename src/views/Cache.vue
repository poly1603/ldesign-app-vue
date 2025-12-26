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
  <div class="cache-demo page-shell section-stack">
    <div class="header-section">
      <h1 class="page-title">
        <Database class="icon-title" />
        缓存功能演示
      </h1>
      <p class="page-desc">展示 @ldesign/cache 的使用方法，包括基础读写、统计信息和响应式缓存。</p>
    </div>

    <!-- 缓存统计 -->
    <section class="section-card">
      <h2 class="section-title">
        <Activity class="section-icon" />
        缓存统计
      </h2>
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
    </section>

    <!-- 基础操作 -->
    <section class="section-card">
      <h2 class="section-title">
        <Database class="section-icon" />
        基础操作
      </h2>
      <div class="form-group">
        <input v-model="formData.key" placeholder="缓存键" class="input">
        <input v-model="formData.value" placeholder="缓存值" class="input">
      </div>
      <div class="button-group">
        <button class="btn primary" @click="handleSet">
          <Save class="btn-icon" />
          设置
        </button>
        <button class="btn" @click="handleGet">
          <Search class="btn-icon" />
          获取
        </button>
        <button class="btn danger" @click="handleClear">
          <Trash2 class="btn-icon" />
          清空
        </button>
      </div>
      <div v-if="result" class="result-box">
        {{ result }}
      </div>
    </section>

    <!-- 用户缓存示例 -->
    <section class="section-card">
      <h2 class="section-title">
        <User class="section-icon" />
        用户缓存示例
      </h2>
      <div class="info-card">
        <template v-if="userCache.name">
          <p>
            <strong>姓名:</strong> {{ userCache.name }}
          </p>
          <p>
            <strong>年龄:</strong> {{ userCache.age }}
          </p>
        </template>
        <template v-else>
          <p class="empty-text">暂无用户数据</p>
        </template>
      </div>
      <button class="btn primary" @click="updateUser">
        <RotateCcw class="btn-icon" />
        随机更新用户
      </button>
    </section>

    <!-- 计数器示例 -->
    <section class="section-card">
      <h2 class="section-title">
        <Zap class="section-icon" />
        计数器示例
      </h2>
      <div class="counter-display">
        <span class="counter-value">{{ counter ?? 0 }}</span>
      </div>
      <button class="btn primary block-btn" @click="incrementCounter">
        +1 增加计数
      </button>
    </section>
  </div>
</template>

<style scoped>
.cache-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--size-space-lg);
}

.header-section {
  margin-bottom: var(--size-space-xl);
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xs);
}

.icon-title {
  width: 32px;
  height: 32px;
  color: var(--color-primary-500);
}

.page-desc {
  color: var(--color-text-secondary);
  font-size: var(--size-font-md);
}

.section-card {
  margin-bottom: var(--size-space-lg);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-md);
  border-bottom: 1px solid var(--color-border-secondary);
  padding-bottom: var(--size-space-sm);
  font-weight: 600;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--size-space-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: var(--size-space-md);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  text-align: center;
  border: 1px solid var(--color-border);
}

.stat-item .label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
  margin-bottom: var(--size-space-xs);
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
  font-weight: 600;
  color: var(--color-primary-500);
  font-size: var(--size-font-xl);
}

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
}

.button-group {
  display: flex;
  gap: var(--size-space-md);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  background: var(--color-bg-component);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
  font-weight: 500;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn:hover {
  background: var(--color-bg-component-hover);
}

.btn.primary {
  background: var(--color-primary-500);
  color: white;
}

.btn.primary:hover {
  background: var(--color-primary-600);
}

.btn.danger {
  background: var(--color-error-500);
  color: white;
}

.btn.danger:hover {
  background: var(--color-error-600);
}

.block-btn {
  display: block;
  width: 100%;
}

.result-box {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  color: var(--color-text-primary);
  font-size: var(--size-font-sm);
  border: 1px solid var(--color-border);
}

.info-card {
  margin-bottom: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.info-card p {
  margin: 4px 0;
  color: var(--color-text-primary);
}

.empty-text {
  color: var(--color-text-tertiary);
  text-align: center;
  font-style: italic;
}

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
  font-weight: bold;
  color: var(--color-primary-500);
}
</style>
