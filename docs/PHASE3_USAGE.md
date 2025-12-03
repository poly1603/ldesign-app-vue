# Phase 3 功能使用指南

本文档介绍 Phase 3 实现的实时通信和状态持久化功能的使用方法。

## 📡 WebSocket 实时通信

### 1. 全局 WebSocket 管理器

WebSocket 管理器已集成到应用中，可以通过多种方式使用。

#### 方式一：使用 Composable（推荐）

```vue
<script setup lang="ts">
import { useWebSocketManager } from '@ldesign/http-vue'

const { connect, subscribe, send, disconnect, getStats } = useWebSocketManager()

// 连接 WebSocket
const ws = connect('chat', 'ws://localhost:3000/chat', {
  autoReconnect: true,
  reconnectDelay: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000
})

// 订阅消息
const unsubscribe = subscribe('chat', (data, event) => {
  console.log('收到消息:', data)
  // 处理消息...
})

// 发送消息
function sendMessage(content: string) {
  send('chat', {
    type: 'message',
    content,
    timestamp: Date.now()
  })
}

// 获取统计信息
const stats = getStats()
console.log('连接统计:', stats)

// 组件卸载时会自动清理订阅
</script>
```

#### 方式二：使用全局属性

```vue
<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const ws = instance?.proxy?.$ws

// 连接
ws?.connect('notifications', 'ws://localhost:3000/notifications')

// 订阅
const unsubscribe = ws?.subscribe('notifications', (data) => {
  console.log('新通知:', data)
})
</script>
```

#### 方式三：使用依赖注入

```vue
<script setup lang="ts">
import { injectWebSocketManager } from '@/plugins/websocket'

const manager = injectWebSocketManager()

// 使用管理器...
</script>
```

### 2. 多连接管理

WebSocket 管理器支持同时管理多个连接：

```typescript
// 连接聊天服务
const chatWs = connect('chat', 'ws://localhost:3000/chat')

// 连接通知服务
const notificationWs = connect('notifications', 'ws://localhost:3000/notifications')

// 连接实时数据服务
const dataWs = connect('realtime-data', 'ws://localhost:3000/data')

// 每个连接都可以独立订阅和发送消息
subscribe('chat', handleChatMessage)
subscribe('notifications', handleNotification)
subscribe('realtime-data', handleDataUpdate)
```

### 3. 消息订阅/发布

支持多个订阅者订阅同一个连接的消息：

```typescript
// 订阅者 1：更新 UI
const unsubscribe1 = subscribe('chat', (data) => {
  updateChatUI(data)
})

// 订阅者 2：记录日志
const unsubscribe2 = subscribe('chat', (data) => {
  logChatMessage(data)
})

// 订阅者 3：发送通知
const unsubscribe3 = subscribe('chat', (data) => {
  if (data.mentions?.includes(currentUser.id)) {
    showNotification(data)
  }
})

// 取消订阅
unsubscribe1()
unsubscribe2()
unsubscribe3()
```

### 4. 连接状态管理

```typescript
// 检查连接状态
const status = getStatus('chat')
console.log('连接状态:', status) // 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'

// 手动断开连接
disconnect('chat')

// 强制断开（忽略引用计数）
disconnect('chat', true)

// 获取所有连接
const connectionIds = manager.getConnectionIds()
console.log('所有连接:', connectionIds)
```

## 💾 状态持久化

### 1. usePersistedState Composable

用于持久化单个响应式状态：

```vue
<script setup lang="ts">
import { usePersistedState } from '@ldesign/store-vue'

// 基础用法
const { state: userPreferences } = usePersistedState({
  key: 'user-preferences',
  defaultValue: {
    theme: 'light',
    language: 'zh-CN',
    fontSize: 14
  },
  syncTabs: true // 多标签页同步
})

// 修改状态会自动保存
userPreferences.value.theme = 'dark'

// 带过期时间
const { state: sessionData, isExpired } = usePersistedState({
  key: 'session-data',
  defaultValue: null,
  ttl: 30 * 60 * 1000, // 30 分钟
  storage: 'sessionStorage'
})

if (isExpired()) {
  console.log('会话已过期')
}

// 手动操作
const { state, save, restore, clear, reset } = usePersistedState({
  key: 'app-settings',
  defaultValue: {}
})

save()     // 手动保存
restore()  // 从存储恢复
clear()    // 清除存储
reset()    // 重置为默认值
</script>
```

### 2. Store 持久化

使用增强版持久化插件，支持更多功能：

```typescript
import { defineStore } from 'pinia'

// 基础持久化
export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      language: 'zh-CN'
    }
  }),
  
  // 启用持久化
  persist: true
})

// 选择性持久化
export const useAppStore = defineStore('app', {
  state: () => ({
    // 需要持久化的
    settings: {},
    userPreferences: {},
    
    // 不需要持久化的
    loading: false,
    error: null
  }),
  
  persist: {
    // 只持久化指定字段
    paths: ['settings', 'userPreferences'],
    
    // 或者排除指定字段
    // excludePaths: ['loading', 'error'],
    
    // 多标签页同步
    syncTabs: true,
    
    // 过期时间
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 天
    
    // 存储类型
    storage: 'localStorage',
    
    // 自定义键名
    key: 'my-app-state'
  }
})

// 带回调的持久化
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    isAuthenticated: false
  }),

  persist: {
    storage: 'localStorage',

    // 恢复前回调
    beforeRestore: ({ store }) => {
      console.log('正在恢复认证状态...')
    },

    // 恢复后回调
    afterRestore: ({ store }) => {
      // 验证 token 是否有效
      if (store.token) {
        validateToken(store.token)
      }
    }
  }
})
```

### 3. 多标签页状态同步

当启用 `syncTabs: true` 时，状态会在多个标签页之间自动同步：

```typescript
// 标签页 A
const { state } = usePersistedState({
  key: 'shared-data',
  defaultValue: { count: 0 },
  syncTabs: true
})

state.value.count = 10

// 标签页 B 会自动收到更新
// state.value.count === 10
```

### 4. 性能优化

增强版持久化插件内置了多项性能优化：

```typescript
// 防抖保存（避免频繁写入）
persist: {
  debounce: 300 // 300ms 内的多次修改只保存一次
}

// 选择性持久化（减少存储大小）
persist: {
  paths: ['user', 'settings'], // 只保存需要的字段
  excludePaths: ['cache', 'temp'] // 排除不需要的字段
}

// 过期时间（自动清理过期数据）
persist: {
  ttl: 24 * 60 * 60 * 1000 // 24 小时后自动过期
}
```

## 🎯 实际应用场景

### 场景 1：实时聊天应用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocketManager } from '@ldesign/http-vue'
import { usePersistedState } from '@ldesign/store-vue'

const { connect, subscribe, send } = useWebSocketManager()

// 持久化聊天历史
const { state: chatHistory } = usePersistedState({
  key: 'chat-history',
  defaultValue: [],
  ttl: 7 * 24 * 60 * 60 * 1000 // 7 天
})

// 连接聊天服务
connect('chat', 'ws://localhost:3000/chat', {
  autoReconnect: true
})

// 订阅消息
subscribe('chat', (message) => {
  chatHistory.value.push(message)
})

// 发送消息
function sendChatMessage(content: string) {
  const message = {
    id: Date.now(),
    content,
    timestamp: new Date().toISOString()
  }

  send('chat', message)
  chatHistory.value.push(message)
}
</script>
```

### 场景 2：实时数据仪表盘

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocketManager } from '@ldesign/http-vue'

const { connect, subscribe } = useWebSocketManager()

const metrics = ref({
  cpu: 0,
  memory: 0,
  network: 0
})

// 连接实时数据服务
connect('metrics', 'ws://localhost:3000/metrics', {
  autoReconnect: true,
  heartbeatInterval: 10000
})

// 订阅实时数据
subscribe('metrics', (data) => {
  metrics.value = data
})
</script>

<template>
  <div class="dashboard">
    <div class="metric">CPU: {{ metrics.cpu }}%</div>
    <div class="metric">内存: {{ metrics.memory }}%</div>
    <div class="metric">网络: {{ metrics.network }} MB/s</div>
  </div>
</template>
```

### 场景 3：用户偏好设置

```vue
<script setup lang="ts">
import { usePersistedState } from '@ldesign/store-vue'

// 持久化用户偏好，支持多标签页同步
const { state: preferences } = usePersistedState({
  key: 'user-preferences',
  defaultValue: {
    theme: 'light',
    language: 'zh-CN',
    fontSize: 14,
    sidebarCollapsed: false,
    notifications: {
      email: true,
      push: true,
      sound: false
    }
  },
  syncTabs: true, // 多标签页同步
  debounce: 500   // 500ms 防抖
})

// 修改偏好会自动保存并同步到其他标签页
function toggleTheme() {
  preferences.value.theme = preferences.value.theme === 'light' ? 'dark' : 'light'
}

function updateFontSize(size: number) {
  preferences.value.fontSize = size
}
</script>
```

## 📊 性能监控

### WebSocket 连接统计

```typescript
const { getStats } = useWebSocketManager()

const stats = getStats()
console.log('统计信息:', {
  总连接数: stats.totalConnections,
  活跃连接: stats.activeConnections,
  总订阅者: stats.totalSubscribers,
  连接详情: stats.connections
})

// 输出示例：
// {
//   totalConnections: 3,
//   activeConnections: 2,
//   totalSubscribers: 5,
//   connections: [
//     {
//       id: 'chat',
//       status: 'OPEN',
//       subscribers: 2,
//       refCount: 1,
//       lastActiveAt: 1234567890
//     },
//     ...
//   ]
// }
```

## 🔧 配置说明

### WebSocket 管理器配置

```typescript
createWebSocketPlugin({
  // 是否自动清理未使用的连接
  autoCleanup: true,

  // 清理间隔（毫秒）
  cleanupInterval: 60000,

  // 最大连接数
  maxConnections: 10,

  // 是否启用调试模式
  debug: import.meta.env.DEV
})
```

### 持久化插件配置

```typescript
createEnhancedPersistPlugin({
  // 存储类型
  storage: 'localStorage',

  // 键名前缀
  keyPrefix: 'ldesign-app-store:',

  // 防抖延迟（毫秒）
  debounce: 300,

  // 是否启用调试
  debug: import.meta.env.DEV,

  // 是否启用多标签页同步
  syncTabs: true,

  // 默认过期时间（毫秒）
  defaultTTL: 7 * 24 * 60 * 60 * 1000
})
```

## 🚀 最佳实践

### 1. WebSocket 连接管理

- ✅ 使用有意义的连接 ID
- ✅ 启用自动重连
- ✅ 设置合理的心跳间隔
- ✅ 及时取消不需要的订阅
- ✅ 使用连接池管理多个连接

### 2. 状态持久化

- ✅ 只持久化必要的状态
- ✅ 使用 `excludePaths` 排除临时数据
- ✅ 设置合理的过期时间
- ✅ 启用防抖减少写入频率
- ✅ 敏感数据使用 sessionStorage

### 3. 性能优化

- ✅ 使用防抖减少保存频率
- ✅ 选择性持久化减少存储大小
- ✅ 设置过期时间自动清理
- ✅ 合理配置连接池大小
- ✅ 监控连接和存储统计

## 📝 注意事项

1. **WebSocket 连接**
   - 确保服务器支持 WebSocket 协议
   - 注意跨域配置
   - 处理连接失败的情况
   - 及时清理不需要的连接

2. **状态持久化**
   - 不要持久化敏感信息（如密码）
   - 注意存储空间限制（localStorage 约 5-10MB）
   - 大数据考虑使用 IndexedDB
   - 定期清理过期数据

3. **多标签页同步**
   - 只在需要时启用
   - 注意性能影响
   - 处理同步冲突

## 🔗 相关文档

- [WebSocket API 文档](../../packages/http/docs/packages/vue.md)
- [Store 持久化文档](../../packages/store/README.md)
- [实施计划](./IMPLEMENTATION_PLAN.md)

