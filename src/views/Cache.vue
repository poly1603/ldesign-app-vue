<script setup lang="ts">
import { useCache, useCacheStats, useCacheValue } from '@ldesign/cache-vue'
/**
 * 缓存功能演示页面
 *
 * 展示 @ldesign/cache-vue 的使用方法
 */
import { ref } from 'vue'

// 使用缓存组合式函数
const { set, get, clear, useReactiveCache } = useCache()

// 使用缓存统计
const { stats, hitRatePercent, refresh: refreshStats } = useCacheStats({
  autoRefresh: true,
  refreshInterval: 2000,
})

// 响应式缓存示例
interface User {
  name: string
  age: number
}

const userCache = useReactiveCache<User>('demo:user', { name: '', age: 0 })

// 简单值缓存示例
const { value: counter, set: setCounter } = useCacheValue<number>('demo:counter', 0)

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
async function handleSet() {
  if (!formData.value.key || !formData.value.value) {
    result.value = '请输入键和值'
    return
  }

  try {
    await set(formData.value.key, formData.value.value, { ttl: 60000 })
    result.value = `成功设置: ${formData.value.key} = ${formData.value.value}`
    await refreshStats()
  }
  catch (error) {
    result.value = `设置失败: ${error}`
  }
}

/**
 * 获取缓存
 */
async function handleGet() {
  if (!formData.value.key) {
    result.value = '请输入键'
    return
  }

  try {
    const value = await get<string>(formData.value.key)
    result.value = value !== null ? `获取成功: ${formData.value.key} = ${value}` : `键 "${formData.value.key}" 不存在`
    await refreshStats()
  }
  catch (error) {
    result.value = `获取失败: ${error}`
  }
}

/**
 * 清空缓存
 */
async function handleClear() {
  try {
    await clear()
    result.value = '缓存已清空'
    await refreshStats()
  }
  catch (error) {
    result.value = `清空失败: ${error}`
  }
}

/**
 * 更新用户缓存
 */
async function updateUser() {
  await userCache.set({
    name: `用户${Math.floor(Math.random() * 100)}`,
    age: Math.floor(Math.random() * 50) + 18,
  })
}

/**
 * 增加计数器
 */
async function incrementCounter() {
  const current = counter.value ?? 0
  await setCounter(current + 1)
}
</script>

<template>
  <div class="cache-demo">
    <h1>缓存功能演示</h1>

    <!-- 缓存统计 -->
    <section class="stats-section">
      <h2>缓存统计</h2>
      <div v-if="stats" class="stats-grid">
        <div class="stat-item">
          <span class="label">总键数:</span>
          <span class="value">{{ stats.totalKeys }}</span>
        </div>
        <div class="stat-item">
          <span class="label">命中次数:</span>
          <span class="value">{{ stats.hits }}</span>
        </div>
        <div class="stat-item">
          <span class="label">未命中次数:</span>
          <span class="value">{{ stats.misses }}</span>
        </div>
        <div class="stat-item">
          <span class="label">命中率:</span>
          <span class="value">{{ hitRatePercent }}</span>
        </div>
      </div>
    </section>

    <!-- 基础操作 -->
    <section class="basic-section">
      <h2>基础操作</h2>
      <div class="form-group">
        <input v-model="formData.key" placeholder="缓存键" class="input">
        <input v-model="formData.value" placeholder="缓存值" class="input">
      </div>
      <div class="button-group">
        <button class="btn" @click="handleSet">
          设置
        </button>
        <button class="btn" @click="handleGet">
          获取
        </button>
        <button class="btn btn-danger" @click="handleClear">
          清空
        </button>
      </div>
      <div v-if="result" class="result">
        {{ result }}
      </div>
    </section>

    <!-- 用户缓存示例 -->
    <section class="user-section">
      <h2>用户缓存示例</h2>
      <div v-if="userCache.value.value" class="user-info">
        <p>
          <strong>姓名:</strong> {{ userCache.value.value.name }}
        </p>
        <p>
          <strong>年龄:</strong> {{ userCache.value.value.age }}
        </p>
      </div>
      <div v-else class="user-info">
        <p>暂无用户数据</p>
      </div>
      <button class="btn" @click="updateUser">
        随机更新用户
      </button>
    </section>

    <!-- 计数器示例 -->
    <section class="counter-section">
      <h2>计数器示例</h2>
      <div class="counter-display">
        <span class="counter-value">{{ counter ?? 0 }}</span>
      </div>
      <button class="btn" @click="incrementCounter">
        +1
      </button>
    </section>
  </div>
</template>

<style scoped>
.cache-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #666;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.stat-item .label {
  color: #666;
}

.stat-item .value {
  font-weight: bold;
  color: #333;
}

.form-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #4a90d9;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn:hover {
  background: #357abd;
}

.btn-danger {
  background: #d94a4a;
}

.btn-danger:hover {
  background: #bd3535;
}

.result {
  margin-top: 15px;
  padding: 10px;
  background: #e8f4fd;
  border-radius: 4px;
  color: #333;
}

.user-info {
  margin-bottom: 15px;
}

.user-info p {
  margin: 5px 0;
}

.counter-display {
  text-align: center;
  margin-bottom: 15px;
}

.counter-value {
  font-size: 48px;
  font-weight: bold;
  color: #4a90d9;
}
</style>
