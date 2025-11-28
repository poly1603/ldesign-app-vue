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
  <div class="store-demo">
    <h1>🗃️ Store 状态管理演示</h1>
    <p class="subtitle">@ldesign/store-vue - 基于 Pinia 的增强版状态管理</p>

    <!-- 计数器 Store -->
    <section class="demo-section">
      <h2>📊 计数器 Store</h2>
      <div class="demo-content">
        <div class="counter-display">
          <span class="count">{{ count }}</span>
          <span class="double">双倍: {{ doubleCount }}</span>
        </div>
        <div class="button-group">
          <button @click="counterStore.decrement()">➖ 减少</button>
          <button @click="counterStore.increment()">➕ 增加</button>
          <button :disabled="isLoading" @click="incrementAsync">
            {{ isLoading ? '⏳ 加载中...' : '⏱️ 异步增加' }}
          </button>
          <button @click="counterStore.reset()">🔄 重置</button>
        </div>
        <p class="info">历史记录: {{ historyLength }} 条</p>
      </div>
    </section>

    <!-- 用户信息 Store -->
    <section class="demo-section">
      <h2>👤 用户信息 Store</h2>
      <div class="demo-content">
        <div v-if="name" class="user-info">
          <p><strong>姓名:</strong> {{ name }}</p>
          <p><strong>邮箱:</strong> {{ email }}</p>
          <p><strong>主题:</strong> {{ preferences.theme }}</p>
          <div class="button-group">
            <button @click="userStore.setTheme(preferences.theme === 'light' ? 'dark' : 'light')">
              切换主题
            </button>
            <button @click="userStore.clearUser()">清除用户</button>
          </div>
        </div>
        <div v-else class="user-form">
          <input v-model="newUserName" placeholder="输入姓名">
          <input v-model="newUserEmail" type="email" placeholder="输入邮箱">
          <button @click="updateUser">保存用户</button>
        </div>
      </div>
    </section>

    <!-- 待办事项 Store -->
    <section class="demo-section">
      <h2>📝 待办事项 Store</h2>
      <div class="demo-content">
        <div class="todo-input">
          <input v-model="newTodoText" placeholder="添加新待办..." @keyup.enter="addTodo">
          <button @click="addTodo">添加</button>
        </div>
        <div class="todo-filters">
          <button :class="{ active: filter === 'all' }" @click="todoStore.filter = 'all'">全部</button>
          <button :class="{ active: filter === 'active' }" @click="todoStore.filter = 'active'">
            待完成 ({{ activeCount }})
          </button>
          <button :class="{ active: filter === 'completed' }" @click="todoStore.filter = 'completed'">
            已完成 ({{ completedCount }})
          </button>
        </div>
        <ul class="todo-list">
          <li v-for="todo in filteredTodos" :key="todo.id" :class="{ completed: todo.completed }">
            <input type="checkbox" :checked="todo.completed" @change="todoStore.toggleTodo(todo.id)">
            <span>{{ todo.text }}</span>
            <button class="delete" @click="todoStore.removeTodo(todo.id)">✕</button>
          </li>
        </ul>
        <button v-if="completedCount > 0" class="clear-completed" @click="todoStore.clearCompleted()">
          清除已完成
        </button>
      </div>
    </section>

    <!-- 简单 Store -->
    <section class="demo-section">
      <h2>🎯 简单 Store（无 Pinia）</h2>
      <div class="demo-content">
        <p>消息: {{ simpleState.message }}</p>
        <p>点击次数: {{ simpleState.clicks }}</p>
        <div class="button-group">
          <button @click="setSimpleState({ clicks: simpleState.clicks + 1 })">点击 +1</button>
          <button @click="resetSimple()">重置</button>
        </div>
      </div>
    </section>

    <!-- 持久化 Hook -->
    <section class="demo-section">
      <h2>💾 持久化 Hook</h2>
      <div class="demo-content">
        <p>页面访问次数: <strong>{{ persistedValue.visits }}</strong></p>
        <button @click="clearPersisted()">清除访问记录</button>
        <p class="info">刷新页面后访问次数会保留</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.store-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.demo-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  margin-top: 0;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.demo-content {
  padding: 10px 0;
}

.counter-display {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.count {
  font-size: 48px;
  font-weight: bold;
  color: #3498db;
}

.double {
  color: #7f8c8d;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #2980b9;
}

button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.info {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 10px;
}

.user-info p {
  margin: 8px 0;
}

.user-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  flex: 1;
  min-width: 150px;
}

.todo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.todo-filters {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}

.todo-filters button {
  background: #ecf0f1;
  color: #34495e;
}

.todo-filters button.active {
  background: #3498db;
  color: white;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #95a5a6;
}

.todo-list li .delete {
  margin-left: auto;
  background: #e74c3c;
  padding: 4px 8px;
}

.clear-completed {
  margin-top: 15px;
  background: #e74c3c;
}
</style>

