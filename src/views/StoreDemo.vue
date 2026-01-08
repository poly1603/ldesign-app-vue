<script setup lang="ts">
/**
 * Store 状态管理演示页面
 * 展示 @ldesign/store-vue 的核心功能
 */
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from '@ldesign/store-vue'
import { usePersist, useSimpleStore } from '@ldesign/store-vue'
import {
  Database,
  BarChart,
  User,
  List,
  Target,
  Save,
  Plus,
  Minus,
  RefreshCw,
  Trash2,
  X,
  Clock,
  Zap,
  Check
} from 'lucide-vue-next'

// ==================== 1. 基础计数器 Store ====================
const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    history: [] as number[],
  }),
  getters: {
    doubleCount: state => state.count * 2,
    historyLength: state => state.history.length,
  },
  actions: {
    increment() {
      this.history.push(this.count)
      this.count++
    },
    decrement() {
      this.history.push(this.count)
      this.count--
    },
    reset() {
      this.count = 0
      this.history = []
    },
    async incrementAsync() {
      await new Promise(resolve => setTimeout(resolve, 500))
      this.increment()
    },
  },
})

// ==================== 2. 用户信息 Store ====================
const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    preferences: {
      theme: 'light' as 'light' | 'dark',
      language: 'zh-CN',
    },
  }),
  actions: {
    setUser(name: string, email: string) {
      this.name = name
      this.email = email
    },
    setTheme(theme: 'light' | 'dark') {
      this.preferences.theme = theme
    },
    clearUser() {
      this.name = ''
      this.email = ''
    },
  },
})

// ==================== 3. 待办事项 Store ====================
interface Todo {
  id: number
  text: string
  completed: boolean
}

const useTodoStore = defineStore('todos', {
  state: () => ({
    todos: [] as Todo[],
    filter: 'all' as 'all' | 'active' | 'completed',
    nextId: 1,
  }),
  getters: {
    filteredTodos: (state) => {
      switch (state.filter) {
        case 'active':
          return state.todos.filter(t => !t.completed)
        case 'completed':
          return state.todos.filter(t => t.completed)
        default:
          return state.todos
      }
    },
    completedCount: state => state.todos.filter(t => t.completed).length,
    activeCount: state => state.todos.filter(t => !t.completed).length,
  },
  actions: {
    addTodo(text: string) {
      this.todos.push({ id: this.nextId++, text, completed: false })
    },
    toggleTodo(id: number) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) todo.completed = !todo.completed
    },
    removeTodo(id: number) {
      const index = this.todos.findIndex(t => t.id === id)
      if (index > -1) this.todos.splice(index, 1)
    },
    clearCompleted() {
      this.todos = this.todos.filter(t => !t.completed)
    },
  },
})

// ==================== 使用 Stores ====================
const counterStore = useCounterStore()
const userStore = useUserStore()
const todoStore = useTodoStore()

const { count, doubleCount, historyLength } = storeToRefs(counterStore)

// ==================== 简单 Store ====================
const { state: simpleState, setState: setSimpleState, reset: resetSimple } = useSimpleStore({
  message: 'Hello, Simple Store!',
  clicks: 0,
})

// ==================== 持久化 Hook ====================
const { value: persistedValue, clear: clearPersisted } = usePersist<{ visits: number }>({
  key: 'demo-visits',
  storage: 'localStorage',
  defaultValue: { visits: 0 },
})
persistedValue.value.visits++

// 使用计算属性供模板访问
const simpleMessage = computed(() => simpleState.value.message)
const simpleClicks = computed(() => simpleState.value.clicks)
const visitsCount = computed(() => persistedValue.value.visits)

// ==================== 本地状态 ====================
const newTodoText = ref('')
const newUserName = ref('')
const newUserEmail = ref('')
const isLoading = ref(false)

// ==================== 方法 ====================
const addTodo = () => {
  if (newTodoText.value.trim()) {
    todoStore.addTodo(newTodoText.value.trim())
    newTodoText.value = ''
  }
}

const updateUser = () => {
  userStore.setUser(newUserName.value, newUserEmail.value)
  newUserName.value = ''
  newUserEmail.value = ''
}

const incrementAsync = async () => {
  isLoading.value = true
  await counterStore.incrementAsync()
  isLoading.value = false
}
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
          <Database class="w-3.5 h-3.5" />
          Store
        </span>
        <h1 class="hero-title">状态管理</h1>
        <p class="hero-subtitle">基于 Pinia 的增强版状态管理，支持模块化、持久化和简单状态管理。</p>
      </div>
    </section>

    <div class="main-grid">
      <!-- 计数器 Store -->
      <section class="demo-card counter-card">
        <div class="card-header">
          <div class="icon-wrapper primary">
            <BarChart class="w-5 h-5" />
          </div>
          <div>
            <h2 class="card-title">计数器</h2>
            <p class="card-desc">Pinia 基础用法演示</p>
          </div>
        </div>
        
        <div class="counter-display">
          <div class="count-value">{{ count }}</div>
          <div class="count-label">Current Count</div>
          <div class="count-meta">Double: {{ doubleCount }}</div>
        </div>

        <div class="control-grid">
          <button class="btn btn-outline" @click="counterStore.decrement()">
            <Minus class="w-4 h-4" />
          </button>
          <button class="btn btn-primary flex-1" :disabled="isLoading" @click="incrementAsync">
            <Clock v-if="isLoading" class="w-4 h-4 spin mr-2" />
            <Zap v-else class="w-4 h-4 mr-2" />
            {{ isLoading ? 'Processing...' : 'Async Add' }}
          </button>
          <button class="btn btn-outline" @click="counterStore.increment()">
            <Plus class="w-4 h-4" />
          </button>
        </div>
        
        <div class="history-bar">
          <span class="history-label">历史记录</span>
          <div class="history-track">
            <div class="history-fill" :style="{ width: Math.min(historyLength * 5, 100) + '%' }"></div>
          </div>
          <span class="history-count">{{ historyLength }}</span>
          <button class="icon-btn-small" @click="counterStore.reset()" title="重置">
            <RefreshCw class="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      <!-- 用户信息 Store -->
      <section class="demo-card user-card">
        <div class="card-header">
          <div class="icon-wrapper info">
            <User class="w-5 h-5" />
          </div>
          <div>
            <h2 class="card-title">用户信息</h2>
            <p class="card-desc">对象状态与持久化</p>
          </div>
        </div>

        <div v-if="userStore.name" class="user-profile">
          <div class="avatar-circle">{{ userStore.name.charAt(0).toUpperCase() }}</div>
          <div class="profile-info">
            <h3>{{ userStore.name }}</h3>
            <p>{{ userStore.email }}</p>
          </div>
          <div class="profile-theme">
            <span class="theme-tag">{{ userStore.preferences.theme }}</span>
          </div>
        </div>

        <div v-if="userStore.name" class="user-actions mt-4">
          <button class="btn btn-outline w-full mb-2" @click="userStore.setTheme(userStore.preferences.theme === 'light' ? 'dark' : 'light')">
            切换主题模式
          </button>
          <button class="btn btn-danger-ghost w-full" @click="userStore.clearUser()">
            退出登录 / 清除
          </button>
        </div>

        <div v-else class="login-form">
          <input v-model="newUserName" placeholder="输入姓名" class="custom-input mb-3">
          <input v-model="newUserEmail" type="email" placeholder="输入邮箱" class="custom-input mb-3">
          <button class="btn btn-primary w-full" @click="updateUser">保存用户</button>
        </div>
      </section>

      <!-- 待办事项 (占满一行) -->
      <section class="demo-card todo-card full-width">
        <div class="card-header">
          <div class="icon-wrapper success">
            <List class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h2 class="card-title">待办事项</h2>
            <p class="card-desc">列表操作与过滤 ({{ todoStore.activeCount }} 待办)</p>
          </div>
          <div class="todo-filters">
            <button v-for="f in ['all', 'active', 'completed']" :key="f"
              :class="['filter-chip', { active: todoStore.filter === f }]"
              @click="todoStore.filter = f as any">
              {{ f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成' }}
            </button>
          </div>
        </div>

        <div class="todo-input-wrapper">
          <input v-model="newTodoText" placeholder="添加新的待办事项..." @keyup.enter="addTodo" class="todo-input">
          <button class="btn-add" @click="addTodo">
            <Plus class="w-5 h-5" />
          </button>
        </div>

        <div class="todo-list">
          <transition-group name="list">
            <div v-for="todo in todoStore.filteredTodos" :key="todo.id" class="todo-item" :class="{ completed: todo.completed }">
              <label class="checkbox-wrapper">
                <input type="checkbox" :checked="todo.completed" @change="todoStore.toggleTodo(todo.id)">
                <span class="checkmark">
                  <Check class="w-3.5 h-3.5" />
                </span>
              </label>
              <span class="todo-text">{{ todo.text }}</span>
              <button class="delete-btn" @click="todoStore.removeTodo(todo.id)">
                <X class="w-4 h-4" />
              </button>
            </div>
          </transition-group>
          <div v-if="todoStore.filteredTodos.length === 0" class="empty-todo">
            没有相关任务
          </div>
        </div>
        
        <div class="todo-footer" v-if="todoStore.completedCount > 0">
          <button class="text-btn danger" @click="todoStore.clearCompleted()">
            清除已完成任务
          </button>
        </div>
      </section>

      <!-- 简单 Store -->
      <section class="demo-card">
        <div class="card-header">
          <div class="icon-wrapper warning">
            <Target class="w-5 h-5" />
          </div>
          <div>
            <h2 class="card-title">简单 Store</h2>
            <p class="card-desc">轻量级状态管理 (无 Pinia)</p>
          </div>
        </div>
        <div class="simple-stats">
          <div class="stat-box">
            <span class="stat-label">点击次数</span>
            <span class="stat-num">{{ simpleClicks }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">消息内容</span>
            <span class="stat-text">{{ simpleMessage }}</span>
          </div>
        </div>
        <div class="button-row mt-4">
          <button class="btn btn-primary flex-1" @click="setSimpleState({ clicks: simpleClicks + 1 })">点击 +1</button>
          <button class="btn btn-outline" @click="resetSimple()">重置</button>
        </div>
      </section>

      <!-- 持久化 Hook -->
      <section class="demo-card">
        <div class="card-header">
          <div class="icon-wrapper purple">
            <Save class="w-5 h-5" />
          </div>
          <div>
            <h2 class="card-title">持久化 Hook</h2>
            <p class="card-desc">LocalStorage 自动同步</p>
          </div>
        </div>
        <div class="persist-display">
          <div class="visit-count">
            {{ visitsCount }}
          </div>
          <div class="visit-label">页面访问次数</div>
        </div>
        <button class="btn btn-danger-ghost w-full mt-4" @click="clearPersisted()">
          清除记录
        </button>
      </section>
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
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

.full-width {
  grid-column: 1 / -1;
}

/* Hero Section (Reused) */
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

/* Card Style (Reused) */
.demo-card {
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border-secondary, #e5e7eb);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
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

.icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.icon-wrapper.primary { background: var(--color-primary-50, #eff6ff); color: var(--color-primary-600, #2563eb); }
.icon-wrapper.info { background: var(--color-info-50, #f0f9ff); color: var(--color-info-600, #0284c7); }
.icon-wrapper.success { background: var(--color-success-50, #f0fdf4); color: var(--color-success-600, #16a34a); }
.icon-wrapper.warning { background: var(--color-warning-50, #fffbeb); color: var(--color-warning-600, #d97706); }
.icon-wrapper.purple { background: #f3e8ff; color: #7e22ce; }

.card-title { font-size: 18px; font-weight: 600; color: var(--color-text-primary, #1f2937); margin: 0; }
.card-desc { font-size: 13px; color: var(--color-text-tertiary, #9ca3af); margin: 4px 0 0; }

/* Counter Specific */
.counter-display { text-align: center; margin-bottom: 24px; padding: 24px; background: var(--color-bg-layout); border-radius: 16px; }
.count-value { font-size: 64px; font-weight: 800; color: var(--color-primary-600); line-height: 1; letter-spacing: -2px; }
.count-label { font-size: 13px; color: var(--color-text-secondary); text-transform: uppercase; margin-top: 8px; letter-spacing: 1px; }
.count-meta { font-size: 12px; color: var(--color-text-tertiary); margin-top: 4px; }

.control-grid { display: flex; gap: 12px; margin-bottom: 24px; }
.history-bar { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--color-text-tertiary); }
.history-track { flex: 1; height: 6px; background: var(--color-bg-layout); border-radius: 3px; overflow: hidden; }
.history-fill { height: 100%; background: var(--color-primary-500); transition: width 0.3s; }
.icon-btn-small { background: transparent; border: none; cursor: pointer; color: var(--color-text-tertiary); padding: 4px; }
.icon-btn-small:hover { color: var(--color-primary-500); }

/* User Specific */
.user-profile { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px 0; }
.avatar-circle { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; font-size: 32px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25); margin-bottom: 16px; }
.profile-info h3 { margin: 0; font-size: 18px; color: var(--color-text-primary); }
.profile-info p { margin: 4px 0 12px; color: var(--color-text-secondary); font-size: 14px; }
.theme-tag { display: inline-block; padding: 4px 12px; background: var(--color-bg-layout); border-radius: 20px; font-size: 12px; color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; border: 1px solid var(--color-border); }

/* Todo Specific */
.todo-filters { display: flex; gap: 8px; }
.filter-chip { padding: 4px 12px; border-radius: 20px; border: 1px solid transparent; background: transparent; font-size: 12px; color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s; }
.filter-chip:hover { background: var(--color-bg-layout); }
.filter-chip.active { background: var(--color-success-50); color: var(--color-success-600); border-color: var(--color-success-200); font-weight: 500; }

.todo-input-wrapper { display: flex; gap: 12px; margin-bottom: 20px; }
.todo-input { flex: 1; padding: 12px 16px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-bg-layout); transition: all 0.2s; }
.todo-input:focus { outline: none; border-color: var(--color-primary-500); background: var(--color-bg-container); box-shadow: 0 0 0 3px var(--color-primary-50); }
.btn-add { width: 44px; height: 44px; border-radius: 12px; background: var(--color-primary-600); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-add:hover { background: var(--color-primary-700); transform: translateY(-1px); }

.todo-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
.todo-item { display: flex; align-items: center; padding: 12px 16px; background: var(--color-bg-layout); border-radius: 12px; transition: all 0.2s; }
.todo-item:hover { background: var(--color-bg-container); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.checkbox-wrapper { display: flex; align-items: center; cursor: pointer; margin-right: 12px; }
.checkbox-wrapper input { display: none; }
.checkmark { width: 20px; height: 20px; border: 2px solid var(--color-border); border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: white; }
.checkbox-wrapper input:checked + .checkmark { background: var(--color-success-500); border-color: var(--color-success-500); }
.checkbox-wrapper input:checked + .checkmark svg { display: block; }
.checkbox-wrapper .checkmark svg { display: none; }
.todo-text { flex: 1; font-size: 14px; color: var(--color-text-primary); transition: all 0.2s; }
.todo-item.completed .todo-text { text-decoration: line-through; color: var(--color-text-tertiary); }
.delete-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; color: var(--color-text-tertiary); cursor: pointer; border-radius: 6px; transition: all 0.2s; opacity: 0; }
.todo-item:hover .delete-btn { opacity: 1; }
.delete-btn:hover { background: #fee2e2; color: #dc2626; }
.empty-todo { text-align: center; color: var(--color-text-tertiary); font-size: 13px; padding: 20px; font-style: italic; }
.todo-footer { margin-top: 16px; text-align: center; }
.text-btn { background: none; border: none; cursor: pointer; font-size: 12px; }
.text-btn.danger { color: var(--color-error-500); }
.text-btn.danger:hover { text-decoration: underline; }

/* Simple Store */
.simple-stats { display: flex; gap: 16px; margin-bottom: 16px; }
.stat-box { flex: 1; background: var(--color-bg-layout); padding: 12px; border-radius: 12px; text-align: center; }
.stat-label { display: block; font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 4px; }
.stat-num { font-size: 24px; font-weight: 700; color: var(--color-text-primary); }
.stat-text { font-size: 14px; font-weight: 500; color: var(--color-primary-600); }

/* Persist */
.persist-display { text-align: center; padding: 32px 0; }
.visit-count { font-size: 64px; font-weight: 800; background: linear-gradient(135deg, #8b5cf6, #d946ef); -webkit-background-clip: text; color: transparent; line-height: 1; margin-bottom: 8px; }
.visit-label { font-size: 14px; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 1px; }

/* Buttons */
.btn { padding: 10px 20px; border-radius: 10px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.btn:hover { transform: translateY(-1px); filter: brightness(0.95); }
.btn:active { transform: translateY(0); }
.btn-primary { background: var(--color-primary-600); color: white; }
.btn-outline { background: transparent; border: 1px solid var(--color-border); color: var(--color-text-primary); }
.btn-outline:hover { border-color: var(--color-primary-500); color: var(--color-primary-500); background: var(--color-primary-50); }
.btn-danger-ghost { background: transparent; color: var(--color-error-500); }
.btn-danger-ghost:hover { background: #fef2f2; }
.btn-purple { background: #7e22ce; color: white; }
.custom-input { width: 100%; padding: 10px 16px; border: 1px solid var(--color-border); border-radius: 10px; font-size: 14px; background: var(--color-bg-layout); color: var(--color-text-primary); }
.custom-input:focus { outline: none; border-color: var(--color-primary-500); background: var(--color-bg-container); }
.w-full { width: 100%; }
.flex-1 { flex: 1; }
.mr-2 { margin-right: 8px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mt-4 { margin-top: 16px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-20px); }
</style>