<script setup lang="ts">
/**
 * Store 状态管理演示页面
 *
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
  Zap
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

// 使用计算属性供模板访问，避免模板类型提示干扰
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
  <div class="store-demo page-container">
    <div class="page-header section-card">
      <div class="header-content">
        <div class="header-icon">
          <Database class="icon-hero" />
        </div>
        <div>
          <h1 class="page-title">Store 状态管理演示</h1>
          <p class="page-desc">
            @ldesign/store-vue - 基于 Pinia 的增强版状态管理，支持模块化、持久化和简单状态管理。
          </p>
        </div>
      </div>
    </div>

    <div class="grid-layout">
      <!-- 计数器 Store -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <BarChart class="section-icon" />
            计数器 Store
          </h2>
        </div>
        <div class="demo-content">
          <div class="counter-display">
            <span class="count">{{ count }}</span>
            <span class="double">双倍: {{ doubleCount }}</span>
          </div>
          <div class="button-group wrap">
            <button class="action-btn" @click="counterStore.decrement()">
              <Minus class="btn-icon" />
              减少
            </button>
            <button class="action-btn" @click="counterStore.increment()">
              <Plus class="btn-icon" />
              增加
            </button>
            <button class="action-btn primary" :disabled="isLoading" @click="incrementAsync">
              <Clock v-if="isLoading" class="btn-icon spin" />
              <Zap v-else class="btn-icon" />
              {{ isLoading ? '加载中...' : '异步增加' }}
            </button>
            <button class="action-btn warning" @click="counterStore.reset()">
              <RefreshCw class="btn-icon" />
              重置
            </button>
          </div>
          <p class="info-text">历史记录: {{ historyLength }} 条</p>
        </div>
      </div>

      <!-- 用户信息 Store -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <User class="section-icon" />
            用户信息 Store
          </h2>
        </div>
        <div class="demo-content">
          <div v-if="userStore.name" class="user-info">
            <div class="info-item">
              <span class="label">姓名:</span>
              <span class="value">{{ userStore.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">邮箱:</span>
              <span class="value">{{ userStore.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">主题:</span>
              <span class="value">{{ userStore.preferences.theme }}</span>
            </div>
            <div class="button-group mt-md">
              <button class="action-btn secondary" @click="userStore.setTheme(userStore.preferences.theme === 'light' ? 'dark' : 'light')">
                切换主题
              </button>
              <button class="action-btn danger" @click="userStore.clearUser()">
                <Trash2 class="btn-icon" />
                清除用户
              </button>
            </div>
          </div>
          <div v-else class="user-form">
            <input v-model="newUserName" placeholder="输入姓名" class="input mb-sm">
            <input v-model="newUserEmail" type="email" placeholder="输入邮箱" class="input mb-sm">
            <button class="action-btn primary block-btn" @click="updateUser">保存用户</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 待办事项 Store -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <List class="section-icon" />
          待办事项 Store
        </h2>
      </div>
      <div class="demo-content">
        <div class="todo-input">
          <input v-model="newTodoText" placeholder="添加新待办..." @keyup.enter="addTodo" class="input">
          <button class="action-btn primary" @click="addTodo">
            <Plus class="btn-icon" />
            添加
          </button>
        </div>
        <div class="todo-filters">
          <button class="filter-btn" :class="{ active: todoStore.filter === 'all' }"
            @click="todoStore.filter = 'all'">全部</button>
          <button class="filter-btn" :class="{ active: todoStore.filter === 'active' }"
            @click="todoStore.filter = 'active'">
            待完成 ({{ todoStore.activeCount }})
          </button>
          <button class="filter-btn" :class="{ active: todoStore.filter === 'completed' }"
            @click="todoStore.filter = 'completed'">
            已完成 ({{ todoStore.completedCount }})
          </button>
        </div>
        <ul class="todo-list">
          <li v-for="todo in todoStore.filteredTodos" :key="todo.id" :class="{ completed: todo.completed }">
            <label class="todo-item-inner">
              <input type="checkbox" :checked="todo.completed" @change="todoStore.toggleTodo(todo.id)" class="checkbox-input">
              <span class="todo-text">{{ todo.text }}</span>
            </label>
            <button class="delete-btn" @click="todoStore.removeTodo(todo.id)">
              <X class="mini-icon" />
            </button>
          </li>
        </ul>
        <button v-if="todoStore.completedCount > 0" class="action-btn danger clear-completed mt-md"
          @click="todoStore.clearCompleted()">
          <Trash2 class="btn-icon" />
          清除已完成
        </button>
      </div>
    </div>

    <div class="grid-layout">
      <!-- 简单 Store -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Target class="section-icon" />
            简单 Store（无 Pinia）
          </h2>
        </div>
        <div class="demo-content">
          <div class="info-item">
            <span class="label">消息:</span>
            <span class="value">{{ simpleMessage }}</span>
          </div>
          <div class="info-item">
            <span class="label">点击次数:</span>
            <span class="value">{{ simpleClicks }}</span>
          </div>
          <div class="button-group mt-md">
            <button class="action-btn primary" @click="setSimpleState({ clicks: simpleClicks + 1 })">点击 +1</button>
            <button class="action-btn secondary" @click="resetSimple()">重置</button>
          </div>
        </div>
      </div>

      <!-- 持久化 Hook -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Save class="section-icon" />
            持久化 Hook
          </h2>
        </div>
        <div class="demo-content">
          <div class="info-item">
            <span class="label">页面访问次数:</span>
            <strong class="value large">{{ visitsCount }}</strong>
          </div>
          <div class="button-group mt-md">
            <button class="action-btn danger" @click="clearPersisted()">清除访问记录</button>
          </div>
          <p class="info-text">刷新页面后访问次数会保留</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-demo {
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
  margin: 0;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--size-space-lg);
}

.demo-content {
  padding: var(--size-space-sm) 0;
}

/* Counter */
.counter-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-space-sm);
  margin-bottom: var(--size-space-lg);
  padding: var(--size-space-lg);
  background: var(--color-bg-page);
  border-radius: var(--size-radius-md);
  border: 1px solid var(--color-border);
}

.count {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary-500);
  line-height: 1;
}

.double {
  color: var(--color-text-secondary);
  font-size: var(--size-font-md);
}

/* Buttons */
.button-group {
  display: flex;
  gap: var(--size-space-md);
}

.button-group.wrap {
  flex-wrap: wrap;
  justify-content: center;
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

.action-btn:hover:not(:disabled) {
  background: var(--color-bg-hover);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--color-primary-600);
}

.action-btn.secondary {
  background: var(--color-bg-page);
}

.action-btn.warning {
  background: var(--color-warning-50);
  color: var(--color-warning-600);
  border-color: var(--color-warning-200);
}

.action-btn.warning:hover {
  background: var(--color-warning-100);
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

.info-text {
  color: var(--color-text-tertiary);
  font-size: var(--size-font-sm);
  margin-top: var(--size-space-md);
  text-align: center;
}

/* User Info */
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--color-border);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--color-text-secondary);
}

.value {
  font-weight: 500;
  color: var(--color-text-primary);
}

.value.large {
  font-size: var(--size-font-xl);
  color: var(--color-primary-500);
}

.user-form {
  display: flex;
  flex-direction: column;
}

.input {
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
}

/* Todo */
.todo-input {
  display: flex;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
}

.todo-input .input {
  flex: 1;
}

.todo-filters {
  display: flex;
  gap: var(--size-space-xs);
  margin-bottom: var(--size-space-md);
}

.filter-btn {
  padding: 4px 12px;
  background: var(--color-bg-page);
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--size-font-sm);
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-500);
}

.filter-btn.active {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  border-color: var(--color-primary-500);
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  overflow: hidden;
}

.todo-list li {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-container);
  transition: background 0.2s;
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-list li:hover {
  background: var(--color-bg-page);
}

.todo-item-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  cursor: pointer;
}

.checkbox-input {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary-500);
}

.todo-text {
  color: var(--color-text-primary);
  transition: color 0.2s;
}

.todo-list li.completed .todo-text {
  text-decoration: line-through;
  color: var(--color-text-tertiary);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--color-error-500);
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
  display: flex;
}

.delete-btn:hover {
  opacity: 1;
}

.mini-icon {
  width: 16px;
  height: 16px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mt-md { margin-top: var(--size-space-md); }
.mb-sm { margin-bottom: var(--size-space-sm); }

@media (max-width: 768px) {
  .store-demo {
    padding: var(--size-space-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .grid-layout {
    grid-template-columns: 1fr;
  }
  
  .todo-filters {
    flex-wrap: wrap;
  }
}
</style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
