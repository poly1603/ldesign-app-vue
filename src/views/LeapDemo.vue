<script setup lang="ts">
import { ref } from 'vue'
import type { MonthWorkdayData, LeapUserInfo } from '../api'
import { useLeapApi, getMonthWorkdayApi, getCurrentUserApi } from '../api'
import { Server, Calendar, User, AlertCircle } from 'lucide-vue-next'

// 月份字符串，格式：YYYY-MM
const month = ref('2025-01')

// 月工作日查询
const {
  data: workdayData,
  loading: loadingWorkday,
  error: workdayError,
  execute: fetchWorkday,
} = useLeapApi<MonthWorkdayData, { month: string }>(getMonthWorkdayApi)

async function handleFetchWorkday() {
  await fetchWorkday({
    month: month.value,
  })
}

// 当前用户信息
const {
  data: currentUser,
  loading: loadingUser,
  error: userError,
  // getCurrentUserApi 在定义时使用了 void 作为参数类型，这里通过 any 断言适配 useLeapApi 的签名
  execute: fetchUser,
} = useLeapApi<LeapUserInfo, Record<string, never>>(getCurrentUserApi as any)

async function handleFetchUser() {
  await fetchUser({} as Record<string, never>)
}
</script>

<template>
  <div class="leap-demo page-container">
    <div class="header-section">
      <h1 class="page-title">
        <Server class="icon-title" />
        LEAP 接口示例
      </h1>
      <p class="page-desc">
        演示如何使用 <code>useLeapApi</code> 调用 LEAP RPC 接口（如 LPOM 工作日、当前用户信息等）。
      </p>
    </div>

    <!-- 月工作日查询 -->
    <section class="section-card">
      <h2 class="section-title">
        <Calendar class="section-icon" />
        1. 月工作日查询
      </h2>
      <p class="section-desc">调用 <code>getMonthWorkdayApi</code> 接口，根据月份获取工作日信息。</p>

      <div class="form-row">
        <label for="month-input" class="label">选择月份：</label>
        <input id="month-input" v-model="month" class="input" type="month">
        <button class="btn primary" :disabled="loadingWorkday" @click="handleFetchWorkday">
          {{ loadingWorkday ? '查询中...' : '查询工作日' }}
        </button>
      </div>

      <div v-if="workdayError" class="error-box">
        <strong>
          <AlertCircle class="inline-icon" /> 错误：
        </strong>
        <span>{{ workdayError.message }}</span>
      </div>

      <div v-if="workdayData" class="result-card">
        <h3 class="card-title">查询结果</h3>
        <p>工作日数量：<strong>{{ workdayData.workdays }}</strong></p>
        <p>工作日日期：{{ workdayData.days.join(', ') }}</p>
        <p v-if="workdayData.holidays?.length">节假日：{{ workdayData.holidays.join(', ') }}</p>
      </div>
    </section>

    <!-- 当前用户信息 -->
    <section class="section-card">
      <h2 class="section-title">
        <User class="section-icon" />
        2. 当前用户信息
      </h2>
      <p class="section-desc">调用 <code>getCurrentUserApi</code> 接口，获取当前登录用户的基础信息。</p>

      <button class="btn primary" :disabled="loadingUser" @click="handleFetchUser">
        {{ loadingUser ? '加载中...' : '获取当前用户' }}
      </button>

      <div v-if="userError" class="error-box">
        <strong>
          <AlertCircle class="inline-icon" /> 错误：
        </strong>
        <span>{{ userError.message }}</span>
      </div>

      <div v-if="currentUser" class="result-card">
        <h3 class="card-title">用户信息</h3>
        <pre class="code-block">{{ JSON.stringify(currentUser, null, 2) }}</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.leap-demo {
  max-width: 960px;
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
  margin-bottom: var(--size-space-sm);
}

.icon-title {
  width: 32px;
  height: 32px;
  color: var(--color-primary-500);
}

.page-desc {
  margin-bottom: var(--size-space-xl);
  color: var(--color-text-secondary);
  font-size: var(--size-font-md);
}

.section-card {
  margin-bottom: var(--size-space-lg);
  padding: var(--size-space-lg);
  border-radius: var(--size-radius-lg);
  background: var(--color-bg-container);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border-secondary);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--size-space-sm);
  font-size: var(--size-font-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-sm);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.section-desc {
  margin-bottom: var(--size-space-md);
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
}

.label {
  font-size: var(--size-font-sm);
  color: var(--color-text-secondary);
}

.input {
  min-width: 180px;
  padding: 8px 12px;
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
  font-size: var(--size-font-sm);
  background: var(--color-bg-container);
  color: var(--color-text-primary);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.btn {
  padding: 8px 16px;
  border-radius: var(--size-radius-md);
  border: none;
  cursor: pointer;
  font-size: var(--size-font-sm);
  font-weight: 500;
  background: var(--color-bg-component);
  color: var(--color-text-primary);
  transition: all 0.2s;
  border: 1px solid var(--color-border);
}

.btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn.primary:hover:not(:disabled) {
  background: var(--color-primary-600);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-error-bg);
  color: var(--color-error-text);
  border: 1px solid var(--color-error-border);
  border-radius: var(--size-radius-md);
  font-size: var(--size-font-sm);
}

.inline-icon {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.result-card {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  background: var(--color-bg-page);
  border: 1px solid var(--color-border);
}

.card-title {
  margin: 0 0 var(--size-space-sm);
  font-size: var(--size-font-md);
  font-weight: 600;
  color: var(--color-text-primary);
}

.code-block {
  margin: 0;
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  background: var(--color-bg-layout);
  color: var(--color-text-primary);
  font-size: var(--size-font-xs);
  overflow-x: auto;
  border: 1px solid var(--color-border);
  font-family: monospace;
}

@media (max-width: 768px) {
  .leap-demo {
    padding: var(--size-space-md);
  }

  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
