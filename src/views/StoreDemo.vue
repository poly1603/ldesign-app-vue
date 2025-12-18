<script setup lang="ts">
/**
 * Store 状态管理演示页面
 *
 * 展示 @ldesign/store-vue 的核心功能
 */
import { ref } from 'vue'
import { defineStore, storeToRefs } from '@ldesign/store-vue'
import { usePersist, useSimpleStore } from '@ldesign/store-vue'

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
const { name, email, preferences } = storeToRefs(userStore)
const { filteredTodos, completedCount, activeCount, filter } = storeToRefs(todoStore)

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
    <h1 class="page-title">🗃️ Store 状态管理演示</h1>
    <p class="subtitle">@ldesign/store-vue - 基于 Pinia 的增强版状态管理</p>

    <!-- 计数器 Store -->
    <section class="section-card">
      <h2 class="section-title">📊 计数器 Store</h2>
      <div class="demo-content">
        <div class="counter-display">
          <span class="count">{{ count }}</span>
          <span class="double">双倍: {{ doubleCount }}</span>
        </div>
        <div class="button-group">
          <button class="btn" @click="counterStore.decrement()">➖ 减少</button>
          <button class="btn" @click="counterStore.increment()">➕ 增加</button>
          <button class="btn primary" :disabled="isLoading" @click="incrementAsync">
            {{ isLoading ? '⏳ 加载中...' : '⏱️ 异步增加' }}
          </button>
          <button class="btn warning" @click="counterStore.reset()">🔄 重置</button>
        </div>
        <p class="info-text">历史记录: {{ historyLength }} 条</p>
      </div>
    </section>

    <!-- 用户信息 Store -->
    <section class="section-card">
      <h2 class="section-title">👤 用户信息 Store</h2>
      <div class="demo-content">
        <div v-if="name" class="user-info">
          <p><strong>姓名:</strong> {{ name }}</p>
          <p><strong>邮箱:</strong> {{ email }}</p>
          <p><strong>主题:</strong> {{ preferences.theme }}</p>
          <div class="button-group mt-4">
            <button class="btn" @click="userStore.setTheme(preferences.theme === 'light' ? 'dark' : 'light')">
              切换主题
            </button>
            <button class="btn danger" @click="userStore.clearUser()">清除用户</button>
          </div>
        </div>
        <div v-else class="user-form">
          <input v-model="newUserName" placeholder="输入姓名" class="input">
          <input v-model="newUserEmail" type="email" placeholder="输入邮箱" class="input">
          <button class="btn primary" @click="updateUser">保存用户</button>
        </div>
      </div>
    </section>

    <!-- 待办事项 Store -->
    <section class="section-card">
      <h2 class="section-title">📝 待办事项 Store</h2>
      <div class="demo-content">
        <div class="todo-input">
          <input v-model="newTodoText" placeholder="添加新待办..." @keyup.enter="addTodo" class="input">
          <button class="btn primary" @click="addTodo">添加</button>
        </div>
        <div class="todo-filters">
          <button class="filter-btn" :class="{ active: filter === 'all' }" @click="todoStore.filter = 'all'">全部</button>
          <button class="filter-btn" :class="{ active: filter === 'active' }" @click="todoStore.filter = 'active'">
            待完成 ({{ activeCount }})
          </button>
          <button class="filter-btn" :class="{ active: filter === 'completed' }"
            @click="todoStore.filter = 'completed'">
            已完成 ({{ completedCount }})
          </button>
        </div>
        <ul class="todo-list">
          <li v-for="todo in filteredTodos" :key="todo.id" :class="{ completed: todo.completed }">
            <label class="todo-item-inner">
              <input type="checkbox" :checked="todo.completed" @change="todoStore.toggleTodo(todo.id)">
              <span class="todo-text">{{ todo.text }}</span>
            </label>
            <button class="delete-btn" @click="todoStore.removeTodo(todo.id)">✕</button>
          </li>
        </ul>
        <button v-if="completedCount > 0" class="btn danger clear-completed" @click="todoStore.clearCompleted()">
          清除已完成
        </button>
      </div>
    </section>

    <!-- 简单 Store -->
    <section class="section-card">
      <h2 class="section-title">🎯 简单 Store（无 Pinia）</h2>
      <div class="demo-content">
        <p>消息: {{ simpleState.message }}</p>
        <p>点击次数: {{ simpleState.clicks }}</p>
        <div class="button-group mt-4">
          <button class="btn primary" @click="setSimpleState({ clicks: simpleState.clicks + 1 })">点击 +1</button>
          <button class="btn" @click="resetSimple()">重置</button>
        </div>
      </div>
    </section>

    <!-- 持久化 Hook -->
    <section class="section-card">
      <h2 class="section-title">💾 持久化 Hook</h2>
      <div class="demo-content">
        <p>页面访问次数: <strong>{{ persistedValue.visits }}</strong></p>
        <div class="button-group mt-4">
          <button class="btn danger" @click="clearPersisted()">清除访问记录</button>
        </div>
        <p class="info-text">刷新页面后访问次数会保留</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.store-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--size-space-lg);
}

.page-title {
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: var(--size-space-sm);
  font-size: var(--size-font-2xl);
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--size-space-xl);
  font-size: var(--size-font-md);
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
  margin-top: 0;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-primary-500);
  padding-bottom: var(--size-space-sm);
  font-size: var(--size-font-lg);
  font-weight: 600;
}

.demo-content {
  padding: var(--size-space-md) 0;
}

.counter-display {
  display: flex;
  align-items: center;
  gap: var(--size-space-lg);
  margin-bottom: var(--size-space-md);
}

.count {
  font-size: 48px;
  font-weight: bold;
  color: var(--color-primary-500);
}

.double {
  color: var(--color-text-secondary);
  font-size: var(--size-font-lg);
}

.button-group {
  display: flex;
  gap: var(--size-space-md);
  flex-wrap: wrap;
}

.mt-4 {
  margin-top: var(--size-space-md);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--size-radius-md);
  background: var(--color-bg-component);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.2s;
  font-size: var(--size-font-sm);
  font-weight: 500;
  border: 1px solid var(--color-border);
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

.btn.warning {
  background: var(--color-warning-500);
  color: white;
  border-color: var(--color-warning-500);
}

.btn.danger {
  background: var(--color-error-500);
  color: white;
  border-color: var(--color-error-500);
}

.info-text {
  color: var(--color-text-tertiary);
  font-size: var(--size-font-sm);
  margin-top: var(--size-space-md);
}

.user-info p {
  margin: 8px 0;
  color: var(--color-text-primary);
}

.user-form {
  display: flex;
  gap: var(--size-space-md);
  flex-wrap: wrap;
}

.input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--size-radius-md);
  flex: 1;
  min-width: 150px;
  background: var(--color-bg-container);
  color: var(--color-text-primary);
}

.todo-input {
  display: flex;
  gap: var(--size-space-md);
  margin-bottom: var(--size-space-md);
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
}

.filter-btn.active {
  background: var(--color-primary-500);
  color: white;
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
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-item-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  cursor: pointer;
}

.todo-text {
  color: var(--color-text-primary);
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
  font-size: 16px;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
}

.clear-completed {
  margin-top: var(--size-space-md);
}
</style>
