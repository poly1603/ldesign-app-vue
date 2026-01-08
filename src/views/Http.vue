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
  Mail,
  ArrowRight,
  ArrowLeft,
  Clock,
  Play,
  Square
} from 'lucide-vue-next'

// 标签页状态
const activeTab = ref('basic')
const tabs = [
  { id: 'basic', label: '基础请求', icon: Database },
  { id: 'mutation', label: '变更请求', icon: Activity },
  { id: 'pagination', label: '分页请求', icon: FileText },
  { id: 'polling', label: '轮询请求', icon: RefreshCw },
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
const pageSize = ref(6)
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
  if (isPolling.value) return
  isPolling.value = true
  pollData()
  pollingTimer = setInterval(pollData, 5000)
}

function stopPolling() {
  if (!isPolling.value) return
  isPolling.value = false
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

function togglePolling() {
  if (isPolling.value) {
    stopPolling()
  } else {
    startPolling()
  }
}

// 组件挂载时初始化数据
onMounted(() => {
  setTimeout(() => {
    loadPosts()
  }, 100)
})

onUnmounted(() => {
  stopPolling()
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
          <Globe class="w-3.5 h-3.5" />
          Network
        </span>
        <h1 class="hero-title">HTTP 请求</h1>
        <p class="hero-subtitle">
          演示 @ldesign/http-vue 的各种功能，包括基础请求、查询、变更、分页及自动轮询。
        </p>
      </div>
    </section>

    <!-- 标签页切换 -->
    <div class="tabs-wrapper">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id">
          <component :is="tab.icon" class="w-4 h-4 mr-2" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 基础请求示例 -->
    <transition name="fade" mode="out-in">
      <div v-if="activeTab === 'basic'" class="tab-content">
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper primary">
              <Database class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h2 class="card-title">用户列表</h2>
              <p class="card-desc">useQuery 基础用法，支持自动缓存</p>
            </div>
            <button class="btn btn-primary" :disabled="isLoadingUsers" @click="refetchUsers">
              <RefreshCw class="w-4 h-4 mr-2" :class="{ 'spin': isLoadingUsers }" />
              {{ isLoadingUsers ? '加载中...' : '刷新列表' }}
            </button>
          </div>

          <div v-if="isLoadingUsers" class="loading-state">
            <div class="spinner" />
            <p>正在获取数据...</p>
          </div>

          <div v-else-if="usersError" class="error-state">
            <XCircle class="w-8 h-8 mb-2" />
            <p>加载失败: {{ usersError.message }}</p>
            <button class="btn btn-outline mt-2" @click="refetchUsers">重试</button>
          </div>

          <div v-else-if="users" class="success-state">
            <div class="user-grid">
              <div v-for="user in users.slice(0, 6)" :key="user.id" class="user-item">
                <div class="user-avatar">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="user-info">
                  <h3>{{ user.name }}</h3>
                  <p class="email">
                    <Mail class="w-3 h-3 mr-1" /> {{ user.email }}
                  </p>
                  <span class="company-tag">{{ user.company.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 变更请求示例 -->
      <div v-else-if="activeTab === 'mutation'" class="tab-content">
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper warning">
              <Activity class="w-5 h-5" />
            </div>
            <div>
              <h2 class="card-title">创建用户</h2>
              <p class="card-desc">useMutation 数据变更操作</p>
            </div>
          </div>

          <div class="mutation-layout">
            <form class="mutation-form" @submit.prevent="handleCreateUser">
              <div class="form-group">
                <label>姓名</label>
                <input v-model="newUser.name" type="text" class="custom-input" placeholder="输入姓名" required>
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <input v-model="newUser.email" type="email" class="custom-input" placeholder="输入邮箱" required>
              </div>
              <div class="form-group">
                <label>用户名</label>
                <input v-model="newUser.username" type="text" class="custom-input" placeholder="输入用户名" required>
              </div>
              <button type="submit" class="btn btn-primary w-full" :disabled="isCreating">
                <RotateCw v-if="isCreating" class="w-4 h-4 mr-2 spin" />
                <CheckCircle v-else class="w-4 h-4 mr-2" />
                {{ isCreating ? '创建中...' : '提交创建' }}
              </button>
            </form>

            <div class="mutation-result">
              <div v-if="createError" class="result-box error">
                <XCircle class="w-5 h-5 text-red-500 mb-2" />
                <h4>创建失败</h4>
                <p>{{ createError.message }}</p>
              </div>
              <div v-else-if="createdUser" class="result-box success">
                <CheckCircle class="w-5 h-5 text-green-500 mb-2" />
                <h4>创建成功</h4>
                <pre class="code-block">{{ JSON.stringify(createdUser, null, 2) }}</pre>
              </div>
              <div v-else class="result-box empty">
                <p>提交表单后在此查看结果</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 分页请求示例 -->
      <div v-else-if="activeTab === 'pagination'" class="tab-content">
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper info">
              <FileText class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h2 class="card-title">文章列表</h2>
              <p class="card-desc">分页加载数据</p>
            </div>
            <div class="pagination-controls">
              <button class="icon-btn" :disabled="!hasPrevPage || isLoadingPosts" @click="prevPage">
                <ArrowLeft class="w-4 h-4" />
              </button>
              <span class="page-indicator">Page {{ currentPage }}</span>
              <button class="icon-btn" :disabled="!hasNextPage || isLoadingPosts" @click="nextPage">
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="isLoadingPosts" class="loading-state min-h-200">
            <div class="spinner" />
          </div>

          <div v-else-if="posts" class="post-grid">
            <div v-for="post in posts" :key="post.id" class="post-item">
              <h3>{{ post.title.slice(0, 30) }}...</h3>
              <p>{{ post.body.slice(0, 80) }}...</p>
            </div>
          </div>
        </section>
      </div>

      <!-- 轮询请求示例 -->
      <div v-else-if="activeTab === 'polling'" class="tab-content">
        <section class="demo-card">
          <div class="card-header">
            <div class="icon-wrapper purple">
              <RefreshCw class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h2 class="card-title">实时数据</h2>
              <p class="card-desc">自动轮询更新 (5s)</p>
            </div>
            <button class="btn" :class="isPolling ? 'btn-danger-ghost' : 'btn-primary'" @click="togglePolling">
              <component :is="isPolling ? Square : Play" class="w-4 h-4 mr-2" :class="{'fill-current': isPolling}" />
              {{ isPolling ? '停止轮询' : '开始轮询' }}
            </button>
          </div>

          <div class="polling-status-bar" :class="{ active: isPolling }">
            <div class="status-indicator">
              <span class="dot"></span>
              {{ isPolling ? '正在轮询数据...' : '轮询已暂停' }}
            </div>
            <div class="last-update" v-if="pollingData">
              <Clock class="w-3.5 h-3.5 mr-1" />
              {{ new Date().toLocaleTimeString() }}
            </div>
          </div>

          <div v-if="pollingData" class="json-viewer">
            <pre>{{ JSON.stringify(pollingData, null, 2) }}</pre>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Layout */
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
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

/* Tabs */
.tabs-wrapper {
  margin-bottom: 24px;
  overflow-x: auto;
}

.tabs {
  display: inline-flex;
  background: var(--color-bg-container);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--color-border-secondary);
}

.tab-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--color-text-primary);
}

.tab-btn.active {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

/* Demo Card */
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
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-secondary);
}

.icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-wrapper.primary { background: var(--color-primary-50, #eff6ff); color: var(--color-primary-600, #2563eb); }
.icon-wrapper.info { background: var(--color-info-50, #f0f9ff); color: var(--color-info-600, #0284c7); }
.icon-wrapper.warning { background: var(--color-warning-50, #fffbeb); color: var(--color-warning-600, #d97706); }
.icon-wrapper.purple { background: #f3e8ff; color: #7e22ce; }

.card-title { font-size: 18px; font-weight: 600; color: var(--color-text-primary); margin: 0; }
.card-desc { font-size: 13px; color: var(--color-text-tertiary); margin: 4px 0 0; }

/* User Grid */
.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-layout);
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.user-item:hover {
  background: var(--color-bg-container);
  border-color: var(--color-primary-200);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-info h3 { margin: 0 0 4px; font-size: 14px; color: var(--color-text-primary); }
.user-info .email { margin: 0 0 4px; font-size: 12px; color: var(--color-text-tertiary); display: flex; align-items: center; }
.company-tag { font-size: 11px; padding: 2px 6px; background: var(--color-bg-container); border-radius: 4px; color: var(--color-text-secondary); border: 1px solid var(--color-border-secondary); }

/* States */
.loading-state, .error-state, .empty-state { text-align: center; padding: 40px; color: var(--color-text-tertiary); }
.min-h-200 { min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.error-state { color: var(--color-error-500); }
.success-state { animation: fadeIn 0.3s ease; }

.spinner { width: 32px; height: 32px; border: 3px solid var(--color-border-secondary); border-top-color: var(--color-primary-500); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 12px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Mutation */
.mutation-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 768px) { .mutation-layout { grid-template-columns: 1fr; } }

.mutation-form { display: flex; flex-direction: column; gap: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: var(--color-text-secondary); }
.custom-input { width: 100%; padding: 10px 16px; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg-layout); transition: all 0.2s; }
.custom-input:focus { outline: none; border-color: var(--color-primary-500); background: var(--color-bg-container); box-shadow: 0 0 0 3px var(--color-primary-50); }

.mutation-result { background: var(--color-bg-layout); border-radius: 12px; padding: 16px; }
.result-box { text-align: center; padding: 20px; }
.result-box.success { color: var(--color-success-600); }
.result-box.error { color: var(--color-error-600); }
.result-box.empty { color: var(--color-text-tertiary); font-style: italic; display: flex; align-items: center; justify-content: center; height: 100%; }
.code-block { text-align: left; background: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 8px; font-size: 12px; margin-top: 12px; overflow-x: auto; }

/* Pagination */
.pagination-controls { display: flex; align-items: center; gap: 12px; }
.icon-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg-container); cursor: pointer; color: var(--color-text-secondary); transition: all 0.2s; }
.icon-btn:hover:not(:disabled) { border-color: var(--color-primary-500); color: var(--color-primary-500); }
.icon-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-indicator { font-size: 13px; font-weight: 600; color: var(--color-text-primary); }

.post-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.post-item { background: var(--color-bg-layout); padding: 16px; border-radius: 12px; border: 1px solid transparent; transition: all 0.2s; }
.post-item:hover { border-color: var(--color-border); background: var(--color-bg-container); }
.post-item h3 { font-size: 15px; margin: 0 0 8px; color: var(--color-text-primary); }
.post-item p { font-size: 13px; color: var(--color-text-tertiary); margin: 0; line-height: 1.5; }

/* Polling */
.polling-status-bar { display: flex; align-items: center; justify-content: space-between; background: var(--color-bg-layout); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; border: 1px dashed var(--color-border); }
.polling-status-bar.active { background: var(--color-success-50); border-color: var(--color-success-200); }
.status-indicator { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-text-secondary); }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-text-tertiary); }
.active .dot { background: var(--color-success-500); box-shadow: 0 0 0 3px var(--color-success-100); }
.last-update { font-size: 12px; color: var(--color-text-tertiary); display: flex; align-items: center; }
.json-viewer { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 12px; overflow-x: auto; max-height: 300px; }

/* Common Buttons */
.btn { padding: 8px 16px; border-radius: 8px; border: none; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: var(--color-primary-600); color: white; }
.btn-outline { background: transparent; border: 1px solid var(--color-border); color: var(--color-text-secondary); }
.btn-outline:hover { border-color: var(--color-primary-500); color: var(--color-primary-500); }
.btn-danger-ghost { background: #fee2e2; color: #dc2626; }
.btn-danger-ghost:hover { background: #fecaca; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>