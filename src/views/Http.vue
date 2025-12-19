<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { userApis, postApis, useRestfulApi } from '../api'
import {
  Globe,
  Activity,
  RefreshCw,
  Database,
  FileText,
  RotateCw,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Mail
} from 'lucide-vue-next'

// 标签页状态
const activeTab = ref('basic')
const tabs = [
  { id: 'basic', label: '基础请求' },
  { id: 'mutation', label: '变更请求' },
  { id: 'pagination', label: '分页请求' },
  { id: 'polling', label: '轮询请求' },
]

// ==================== 1. 基础请求示例 ====================
const {
  data: users,
  loading: isLoadingUsers,
  error: usersError,
  execute: refetchUsers,
} = useRestfulApi(userApis.list)

// ==================== 2. 变更请求示例 ====================
const newUser = ref({
  name: '',
  email: '',
  username: '',
})

const {
  data: createdUser,
  loading: isCreating,
  error: createError,
  execute: createUser,
} = useRestfulApi(userApis.create)

async function handleCreateUser() {
  try {
    await createUser({
      body: newUser.value,
    })
    console.log('✅ 用户创建成功')
    // 重置表单
    newUser.value = { name: '', email: '', username: '' }
  }
  catch (error) {
    console.error('❌ 用户创建失败:', error)
  }
}

// ==================== 3. 分页请求示例 ====================
const {
  data: posts,
  loading: isLoadingPosts,
  error: postsError,
  execute: fetchPosts,
} = useRestfulApi(postApis.list)
const currentPage = ref(1)
const pageSize = ref(10)
const hasNextPage = ref(true)
const hasPrevPage = ref(false)

async function loadPosts() {
  await fetchPosts({
    query: {
      _page: currentPage.value,
      _limit: pageSize.value,
    },
  })

  const data = posts.value ?? []
  // 简单判断：如果返回的数据少于 pageSize，说明没有下一页了
  hasNextPage.value = data.length >= pageSize.value
  hasPrevPage.value = currentPage.value > 1
}

function nextPage() {
  if (hasNextPage.value) {
    currentPage.value++
    loadPosts()
  }
}

function prevPage() {
  if (hasPrevPage.value) {
    currentPage.value--
    loadPosts()
  }
}

// ==================== 4. 轮询请求示例 ====================
const {
  data: pollingData,
  execute: fetchPollingUser,
} = useRestfulApi(userApis.get, {
  pathParams: {
    id: 1,
  },
})
const isPolling = ref(false)
let pollingTimer: ReturnType<typeof setInterval> | null = null

async function pollData() {
  try {
    await fetchPollingUser()
  }
  catch (error) {
    console.error('轮询错误:', error)
  }
}

function startPolling() {
  if (isPolling.value)
    return
  isPolling.value = true
  // 立即执行一次
  pollData()
  // 然后每 5 秒执行一次
  pollingTimer = setInterval(pollData, 5000)
}

function stopPolling() {
  if (!isPolling.value)
    return
  isPolling.value = false
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

function togglePolling() {
  if (isPolling.value) {
    stopPolling()
  }
  else {
    startPolling()
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  // 延迟一下，确保 HTTP 客户端已经初始化
  setTimeout(() => {
    loadPosts()
  }, 100)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="http-demo page-shell section-stack">
    <div class="header-section">
      <h1 class="page-title">
        <Globe class="icon-title" />
        HTTP 请求示例
      </h1>
      <p class="page-desc">
        演示 @ldesign/http-vue 的各种功能，包括基础请求、查询、变更、分页等
      </p>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs-container">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id" class="tab" :class="[{ active: activeTab === tab.id }]"
          @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 基础请求示例 -->
    <div v-if="activeTab === 'basic'" class="tab-content">
      <section class="section-card">
        <h2 class="section-title">
          <Database class="section-icon" />
          1. 基础请求 (useQuery)
        </h2>
        <p class="section-desc">使用 useQuery 获取用户列表，支持自动缓存和重试</p>

        <div class="demo-section">
          <button class="btn primary" :disabled="isLoadingUsers" @click="refetchUsers">
            <RefreshCw class="btn-icon" :class="{ 'spin': isLoadingUsers }" />
            {{ isLoadingUsers ? '加载中...' : '刷新用户列表' }}
          </button>

          <div v-if="isLoadingUsers" class="loading">
            <div class="spinner" />
            <p>加载中...</p>
          </div>

          <div v-else-if="usersError" class="error-box">
            <p class="flex-center">
              <XCircle class="inline-icon" /> 错误: {{ usersError.message }}
            </p>
            <button class="btn secondary" @click="refetchUsers">
              <RotateCw class="btn-icon" />
              重试
            </button>
          </div>

          <div v-else-if="users" class="success">
            <p class="success-text flex-center">
              <CheckCircle class="inline-icon" /> 成功加载 {{ users.length }} 个用户
            </p>
            <div class="user-list">
              <div v-for="user in users.slice(0, 5)" :key="user.id" class="user-card">
                <h3>
                  <UserIcon class="card-icon" />
                  {{ user.name }}
                </h3>
                <p class="flex-center">
                  <Mail class="mini-icon" /> {{ user.email }}
                </p>
                <p>{{ user.company.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 变更请求示例 -->
    <div v-if="activeTab === 'mutation'" class="tab-content">
      <section class="section-card">
        <h2 class="section-title">
          <Activity class="section-icon" />
          2. 变更请求 (useMutation)
        </h2>
        <p class="section-desc">使用 useMutation 创建新用户</p>

        <div class="demo-section">
          <form class="form" @submit.prevent="handleCreateUser">
            <div class="form-group">
              <label>姓名:</label>
              <input v-model="newUser.name" type="text" class="input" required>
            </div>
            <div class="form-group">
              <label>邮箱:</label>
              <input v-model="newUser.email" type="email" class="input" required>
            </div>
            <div class="form-group">
              <label>用户名:</label>
              <input v-model="newUser.username" type="text" class="input" required>
            </div>
            <button type="submit" class="btn primary" :disabled="isCreating">
              {{ isCreating ? '创建中...' : '创建用户' }}
            </button>
          </form>

          <div v-if="createError" class="error-box">
            <p class="flex-center">
              <XCircle class="inline-icon" /> 创建失败: {{ createError.message }}
            </p>
          </div>

          <div v-if="createdUser" class="success-box">
            <p class="flex-center">
              <CheckCircle class="inline-icon" /> 用户创建成功!
            </p>
            <pre class="code-block">{{ JSON.stringify(createdUser, null, 2) }}</pre>
          </div>
        </div>
      </section>
    </div>

    <!-- 分页请求示例 -->
    <div v-if="activeTab === 'pagination'" class="tab-content">
      <section class="section-card">
        <h2 class="section-title">
          <FileText class="section-icon" />
          3. 分页请求 (usePagination)
        </h2>
        <p class="section-desc">使用 usePagination 实现文章列表分页</p>

        <div class="demo-section">
          <div class="pagination-controls">
            <button class="btn secondary" :disabled="!hasPrevPage || isLoadingPosts" @click="prevPage">
              上一页
            </button>
            <span>第 {{ currentPage }} 页</span>
            <button class="btn secondary" :disabled="!hasNextPage || isLoadingPosts" @click="nextPage">
              下一页
            </button>
          </div>

          <div v-if="isLoadingPosts" class="loading">
            <div class="spinner" />
            <p>加载中...</p>
          </div>

          <div v-else-if="postsError" class="error-box">
            <p class="flex-center">
              <XCircle class="inline-icon" /> 错误: {{ postsError.message }}
            </p>
          </div>

          <div v-else-if="posts" class="success">
            <div class="post-list">
              <div v-for="post in posts" :key="post.id" class="post-card">
                <h3>{{ post.title }}</h3>
                <p>{{ post.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 轮询请求示例 -->
    <div v-if="activeTab === 'polling'" class="tab-content">
      <section class="section-card">
        <h2 class="section-title">
          <RefreshCw class="section-icon" />
          4. 轮询请求 (usePolling)
        </h2>
        <p class="section-desc">使用 usePolling 定时获取数据</p>

        <div class="demo-section">
          <div class="polling-controls">
            <button class="btn" :class="isPolling ? 'warning' : 'primary'" @click="togglePolling">
              <RefreshCw class="btn-icon" :class="{ 'spin': isPolling }" />
              {{ isPolling ? '停止轮询' : '开始轮询' }}
            </button>
            <span v-if="isPolling" class="polling-status flex-center">
              <Activity class="inline-icon spin" />
              轮询中... (每 5 秒)
            </span>
          </div>

          <div v-if="pollingData" class="success-box">
            <p class="flex-center">
              <CheckCircle class="inline-icon" /> 最后更新: {{ new Date().toLocaleTimeString() }}
            </p>
            <pre class="code-block">{{ JSON.stringify(pollingData, null, 2) }}</pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.http-demo {
  max-width: 1000px;
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
  color: var(--color-text-secondary);
  font-size: var(--size-font-md);
}

/* 标签页 */
.tabs-container {
  margin-bottom: var(--size-space-lg);
  border-bottom: 1px solid var(--color-border);
}

.tabs {
  display: flex;
  gap: var(--size-space-md);
}

.tab {
  padding: var(--size-space-sm) var(--size-space-md);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: var(--size-font-md);
  color: var(--color-text-secondary);
  transition: all 0.2s;
  font-weight: 500;
}

.tab:hover {
  color: var(--color-primary-500);
}

.tab.active {
  color: var(--color-primary-500);
  border-bottom-color: var(--color-primary-500);
}

/* 内容区域 */
.tab-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  margin-bottom: var(--size-space-sm);
  font-weight: 600;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.section-desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--size-space-lg);
  font-size: var(--size-font-sm);
}

/* 按钮 */
.btn {
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
  background: var(--color-bg-component);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn:hover:not(:disabled) {
  background: var(--color-bg-component-hover);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn.primary:hover:not(:disabled) {
  background: var(--color-primary-600);
}

.btn.secondary {
  background: var(--color-bg-container);
  color: var(--color-text-primary);
}

.btn.warning {
  background: var(--color-warning-500);
  color: white;
  border-color: var(--color-warning-500);
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: var(--size-space-xl);
}

.spinner {
  width: 24px;
  height: 24px;
  margin: 0 auto var(--size-space-md);
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

/* 错误状态 */
.error-box {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: var(--size-radius-md);
  padding: var(--size-space-md);
  margin-top: var(--size-space-md);
  color: var(--color-error-text);
}

/* 成功状态 */
.success-text {
  margin-top: var(--size-space-md);
  color: var(--color-success-500);
  font-weight: 500;
}

.success-box {
  margin-top: var(--size-space-md);
  padding: var(--size-space-md);
  background: var(--color-success-bg);
  border: 1px solid var(--color-success-border);
  border-radius: var(--size-radius-md);
  color: var(--color-success-text);
}

/* 用户列表 */
.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--size-space-md);
  margin-top: var(--size-space-md);
}

.user-card {
  background: var(--color-bg-page);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.user-card h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 var(--size-space-xs) 0;
  color: var(--color-text-primary);
  font-size: var(--size-font-md);
  font-weight: 600;
}

.card-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary-500);
}

.user-card p {
  margin: 4px 0;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

.mini-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

/* 表单 */
.form {
  background: var(--color-bg-page);
  padding: var(--size-space-lg);
  border-radius: var(--size-radius-md);
  margin-bottom: var(--size-space-md);
  border: 1px solid var(--color-border);
}

.form-group {
  margin-bottom: var(--size-space-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--size-space-xs);
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: var(--size-font-sm);
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

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.code-block {
  background: var(--color-bg-layout);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-sm);
  overflow-x: auto;
  font-size: var(--size-font-xs);
  color: var(--color-text-primary);
  font-family: monospace;
  margin: var(--size-space-sm) 0 0;
}

/* 文章列表 */
.post-list {
  display: grid;
  gap: var(--size-space-md);
  margin-top: var(--size-space-md);
}

.post-card {
  background: var(--color-bg-page);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.post-card h3 {
  margin: 0 0 var(--size-space-xs) 0;
  color: var(--color-text-primary);
  font-size: var(--size-font-md);
  font-weight: 600;
}

.post-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: var(--size-font-sm);
}

/* 分页控制 */
.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
}

.pagination-controls span {
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: var(--size-font-sm);
}

/* 轮询控制 */
.polling-controls {
  display: flex;
  align-items: center;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
}

.polling-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary-500);
  font-weight: 500;
  font-size: var(--size-font-sm);
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
</style>
