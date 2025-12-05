<script setup lang="ts">
import type { Post, User } from '../api/users'
import { onMounted, onUnmounted, ref } from 'vue'
import { PostService, UserService } from '../api/users'

// 标签页状态
const activeTab = ref('basic')
const tabs = [
  { id: 'basic', label: '基础请求' },
  { id: 'mutation', label: '变更请求' },
  { id: 'pagination', label: '分页请求' },
  { id: 'polling', label: '轮询请求' },
]

// ==================== 1. 基础请求示例 ====================
const users = ref<User[] | null>(null)
const isLoadingUsers = ref(false)
const usersError = ref<Error | null>(null)

async function refetchUsers() {
  isLoadingUsers.value = true
  usersError.value = null
  try {
    users.value = await UserService.getUsers()
  }
  catch (error) {
    usersError.value = error as Error
  }
  finally {
    isLoadingUsers.value = false
  }
}

// ==================== 2. 变更请求示例 ====================
const newUser = ref({
  name: '',
  email: '',
  username: '',
})

const isCreating = ref(false)
const createError = ref<Error | null>(null)
const createdUser = ref<User | null>(null)

async function handleCreateUser() {
  isCreating.value = true
  createError.value = null
  try {
    const user = await UserService.createUser(newUser.value)
    createdUser.value = user
    console.log('✅ 用户创建成功:', user)
    // 重置表单
    newUser.value = { name: '', email: '', username: '' }
  }
  catch (error) {
    createError.value = error as Error
    console.error('❌ 用户创建失败:', error)
  }
  finally {
    isCreating.value = false
  }
}

// ==================== 3. 分页请求示例 ====================
const posts = ref<Post[] | null>(null)
const isLoadingPosts = ref(false)
const postsError = ref<Error | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const hasNextPage = ref(true)
const hasPrevPage = ref(false)

async function loadPosts() {
  isLoadingPosts.value = true
  postsError.value = null
  try {
    const data = await PostService.getPosts({ _page: currentPage.value, _limit: pageSize.value })
    posts.value = data
    // 简单判断：如果返回的数据少于 pageSize，说明没有下一页了
    hasNextPage.value = data.length >= pageSize.value
    hasPrevPage.value = currentPage.value > 1
  }
  catch (error) {
    postsError.value = error as Error
  }
  finally {
    isLoadingPosts.value = false
  }
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
const pollingData = ref<User | null>(null)
const isPolling = ref(false)
let pollingTimer: ReturnType<typeof setInterval> | null = null

async function pollData() {
  try {
    const data = await UserService.getUserById(1)
    pollingData.value = data
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
  <div class="http-demo">
    <h1>HTTP 请求示例</h1>
    <p class="description">
      演示 @ldesign/http-vue 的各种功能，包括基础请求、查询、变更、分页等
    </p>

    <!-- 标签页切换 -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" class="tab" :class="[{ active: activeTab === tab.id }]"
        @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <!-- 基础请求示例 -->
    <div v-if="activeTab === 'basic'" class="tab-content">
      <h2>1. 基础请求 (useQuery)</h2>
      <p>使用 useQuery 获取用户列表，支持自动缓存和重试</p>

      <div class="demo-section">
        <button :disabled="isLoadingUsers" @click="refetchUsers">
          {{ isLoadingUsers ? '加载中...' : '刷新用户列表' }}
        </button>

        <div v-if="isLoadingUsers" class="loading">
          <div class="spinner" />
          <p>加载中...</p>
        </div>

        <div v-else-if="usersError" class="error">
          <p>❌ 错误: {{ usersError.message }}</p>
          <button @click="refetchUsers">
            重试
          </button>
        </div>

        <div v-else-if="users" class="success">
          <p>✅ 成功加载 {{ users.length }} 个用户</p>
          <div class="user-list">
            <div v-for="user in users.slice(0, 5)" :key="user.id" class="user-card">
              <h3>{{ user.name }}</h3>
              <p>{{ user.email }}</p>
              <p>{{ user.company.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 变更请求示例 -->
    <div v-if="activeTab === 'mutation'" class="tab-content">
      <h2>2. 变更请求 (useMutation)</h2>
      <p>使用 useMutation 创建新用户</p>

      <div class="demo-section">
        <form class="form" @submit.prevent="handleCreateUser">
          <div class="form-group">
            <label>姓名:</label>
            <input v-model="newUser.name" type="text" required>
          </div>
          <div class="form-group">
            <label>邮箱:</label>
            <input v-model="newUser.email" type="email" required>
          </div>
          <div class="form-group">
            <label>用户名:</label>
            <input v-model="newUser.username" type="text" required>
          </div>
          <button type="submit" :disabled="isCreating">
            {{ isCreating ? '创建中...' : '创建用户' }}
          </button>
        </form>

        <div v-if="createError" class="error">
          <p>❌ 创建失败: {{ createError.message }}</p>
        </div>

        <div v-if="createdUser" class="success">
          <p>✅ 用户创建成功!</p>
          <pre>{{ JSON.stringify(createdUser, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- 分页请求示例 -->
    <div v-if="activeTab === 'pagination'" class="tab-content">
      <h2>3. 分页请求 (usePagination)</h2>
      <p>使用 usePagination 实现文章列表分页</p>

      <div class="demo-section">
        <div class="pagination-controls">
          <button :disabled="!hasPrevPage || isLoadingPosts" @click="prevPage">
            上一页
          </button>
          <span>第 {{ currentPage }} 页</span>
          <button :disabled="!hasNextPage || isLoadingPosts" @click="nextPage">
            下一页
          </button>
        </div>

        <div v-if="isLoadingPosts" class="loading">
          <div class="spinner" />
          <p>加载中...</p>
        </div>

        <div v-else-if="postsError" class="error">
          <p>❌ 错误: {{ postsError.message }}</p>
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
    </div>

    <!-- 轮询请求示例 -->
    <div v-if="activeTab === 'polling'" class="tab-content">
      <h2>4. 轮询请求 (usePolling)</h2>
      <p>使用 usePolling 定时获取数据</p>

      <div class="demo-section">
        <div class="polling-controls">
          <button @click="togglePolling">
            {{ isPolling ? '停止轮询' : '开始轮询' }}
          </button>
          <span v-if="isPolling">轮询中... (每 5 秒)</span>
        </div>

        <div v-if="pollingData" class="success">
          <p>✅ 最后更新: {{ new Date().toLocaleTimeString() }}</p>
          <pre>{{ JSON.stringify(pollingData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.http-demo {
  max-width: var(--size-size-64);
  margin: 0 auto;
  padding: var(--size-space-xl);
}

h1 {
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xs);
}

.description {
  color: var(--color-text-secondary);
  margin-bottom: var(--size-space-xl);
}

/* 标签页 */
.tabs {
  display: flex;
  gap: var(--size-space-xs);
  margin-bottom: var(--size-space-xl);
  border-bottom: var(--size-border-width-default) solid var(--color-border);
}

.tab {
  padding: var(--size-comp-paddingTB-s) var(--size-comp-paddingLR-m);
  background: none;
  border: none;
  border-bottom: var(--size-border-width-thick) solid transparent;
  cursor: pointer;
  font-size: var(--size-font-md);
  color: var(--color-text-secondary);
  transition: all var(--size-duration-normal);
}

.tab:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-hover);
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* 内容区域 */
.tab-content {
  animation: fadeIn var(--size-duration-normal);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(var(--size-space-xs));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-xs);
}

.tab-content>p {
  color: var(--color-text-secondary);
  margin-bottom: var(--size-space-lg);
}

/* 演示区域 */
.demo-section {
  background: var(--color-bg-container-secondary);
  padding: var(--size-space-lg);
  border-radius: var(--size-radius-md);
  margin-bottom: var(--size-space-xl);
}

/* 按钮 */
button {
  padding: var(--size-comp-paddingTB-s) var(--size-comp-paddingLR-m);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--size-radius-xs);
  cursor: pointer;
  font-size: var(--size-font-md);
  transition: all var(--size-duration-normal);
}

button:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--color-shadow-medium);
}

button:disabled {
  background: var(--color-border-light);
  cursor: not-allowed;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: var(--size-space-xl);
}

.spinner {
  width: var(--size-size-5);
  height: var(--size-size-5);
  margin: 0 auto var(--size-space-md);
  border: var(--size-border-width-thick) solid var(--color-border-light);
  border-top: var(--size-border-width-thick) solid var(--color-primary);
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

/* 错误状态 */
.error {
  background: var(--color-danger-bg);
  border: var(--size-border-width-thin) solid var(--color-danger);
  border-radius: var(--size-radius-xs);
  padding: var(--size-space-md);
  margin-top: var(--size-space-md);
  color: var(--color-danger);
}

/* 成功状态 */
.success {
  margin-top: var(--size-space-md);
}

/* 用户列表 */
.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--size-space-md);
  margin-top: var(--size-space-md);
}

.user-card {
  background: var(--color-bg-container);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-md);
  box-shadow: var(--color-shadow-small);
}

.user-card h3 {
  margin: 0 0 var(--size-space-xs) 0;
  color: var(--color-text-primary);
  font-size: var(--size-font-lg);
}

.user-card p {
  margin: var(--size-space-xxs) 0;
  color: var(--color-text-secondary);
  font-size: var(--size-font-sm);
}

/* 表单 */
.form {
  background: var(--color-bg-container);
  padding: var(--size-space-lg);
  border-radius: var(--size-radius-md);
  margin-bottom: var(--size-space-md);
}

.form-group {
  margin-bottom: var(--size-space-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--size-space-xs);
  color: var(--color-text-primary);
  font-weight: var(--size-font-weight-medium);
}

.form-group input {
  width: 100%;
  padding: var(--size-comp-paddingTB-s);
  border: var(--size-border-width-thin) solid var(--color-border);
  border-radius: var(--size-radius-xs);
  font-size: var(--size-font-md);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

pre {
  background: var(--color-bg-container);
  padding: var(--size-space-md);
  border-radius: var(--size-radius-xs);
  overflow-x: auto;
  font-size: var(--size-font-sm);
}

/* 文章列表 */
.post-list {
  display: grid;
  gap: var(--size-space-md);
  margin-top: var(--size-space-md);
}

.post-card {
  background: var(--color-bg-container);
  padding: var(--size-space-lg);
  border-radius: var(--size-radius-md);
  box-shadow: var(--color-shadow-small);
}

.post-card h3 {
  margin: 0 0 var(--size-space-xs) 0;
  color: var(--color-text-primary);
}

.post-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: var(--size-line-relaxed);
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
  font-weight: var(--size-font-weight-medium);
}

/* 轮询控制 */
.polling-controls {
  display: flex;
  align-items: center;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
}

.polling-controls span {
  color: var(--color-primary);
  font-weight: var(--size-font-weight-medium);
}
</style>
