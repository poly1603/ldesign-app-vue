<template>
  <div class="app">
    <header class="header">
      <h1>🚀 LDesign Engine - Vue</h1>
      <p>Progressive Framework with LDesign Engine</p>
    </header>

    <main class="main">
      <!-- 计数器 -->
      <div class="card">
        <h3>计数器示例</h3>
        <p>当前计数: {{ count }}</p>
        <button @click="increment">增加</button>
        <button @click="decrement">减少</button>
        <button @click="reset">重置</button>
      </div>

      <!-- 事件系统 -->
      <div class="card">
        <h3>事件系统示例</h3>
        <button @click="sendNotification">发送通知</button>
        <div class="messages">
          <div v-for="(msg, i) in messages" :key="i" class="message">{{ msg }}</div>
        </div>
      </div>

      <!-- 待办事项 -->
      <div class="card">
        <h3>待办事项列表</h3>
        <div class="todo-input">
          <input
            v-model="newTodo"
            @keypress.enter="addTodo"
            placeholder="输入待办事项..."
          />
          <button @click="addTodo">添加</button>
        </div>
        <ul class="todo-list">
          <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.done }">
            <input type="checkbox" v-model="todo.done" />
            <span>{{ todo.text }}</span>
            <button @click="deleteTodo(todo.id)">删除</button>
          </li>
        </ul>
      </div>
    </main>

    <footer class="footer">
      <p>Powered by @ldesign/engine-vue</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEngineState, useEngineEvent } from '@ldesign/engine-vue'

// 计数器状态
const count = useEngineState('counter', 0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}

function reset() {
  count.value = 0
}

// 事件系统
const messages = ref<string[]>([])

useEngineEvent('notification', (data: any) => {
  messages.value.push(`收到通知: ${data.message}`)
})

function sendNotification() {
  // 需要访问 engine 实例来发送事件
  // 这里简化处理,直接添加消息
  messages.value.push(`发送通知: 消息 ${Date.now()}`)
}

// 待办事项
interface Todo {
  id: number
  text: string
  done: boolean
}

const todos = useEngineState<Todo[]>('todos', [])
const newTodo = ref('')

function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      done: false,
    })
    newTodo.value = ''
  }
}

function deleteTodo(id: number) {
  todos.value = todos.value.filter(todo => todo.id !== id)
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.3s;
}

button:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.todo-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.todo-input input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.todo-list {
  list-style: none;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.todo-list li.done span {
  text-decoration: line-through;
  opacity: 0.6;
}

.messages {
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.message {
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.footer {
  text-align: center;
  color: white;
  margin-top: 3rem;
  opacity: 0.8;
}
</style>
