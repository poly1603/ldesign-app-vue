# 📊 App-Vue 功能缺失分析与集成指南

> **文档版本**: v1.0.0  
> **更新日期**: 2025-01-28  
> **适用范围**: @ldesign/app-vue

---

## 📖 目录

- [当前状态](#当前状态)
- [缺失功能总览](#缺失功能总览)
- [核心包集成指南](#核心包集成指南)
- [功能库集成指南](#功能库集成指南)
- [集成优先级建议](#集成优先级建议)
- [完整集成示例](#完整集成示例)

---

## 当前状态

### ✅ 已集成的包 (9个)

| 包名 | 功能 | 状态 |
|------|------|------|
| @ldesign/engine-vue3 | 应用引擎 | ✅ |
| @ldesign/router-vue | 路由管理 | ✅ |
| @ldesign/i18n-vue | 国际化 | ✅ |
| @ldesign/color-vue | 主题系统 | ✅ |
| @ldesign/size-vue | 尺寸管理 | ✅ |
| @ldesign/http-vue | HTTP 客户端 | ✅ |
| @ldesign/device-vue | 设备检测 | ✅ |
| @ldesign/cache | 缓存管理 | ✅ |
| @ldesign/crypto-vue | 加密功能 | ✅ |

### 📊 覆盖率分析

```
已集成功能: ████████░░░░░░░░░░░░ 20%
缺失功能:   ░░░░░░░░████████████ 80%
```

- **已有页面**: 9 个演示页面
- **可用包数**: 50+ 个包可供集成
- **潜在价值**: 缺失 80% 的企业级功能

---

## 缺失功能总览

### 🔴 高优先级 (必须集成)

#### 1. 状态管理
- **包名**: `@ldesign/store-vue`
- **重要性**: ⭐⭐⭐⭐⭐
- **缺失影响**: 无法进行复杂的全局状态管理

#### 2. 日志系统
- **包名**: `@ldesign/logger`
- **重要性**: ⭐⭐⭐⭐⭐
- **缺失影响**: 无统一的日志记录和错误追踪

#### 3. 通知系统
- **包名**: `@ldesign/notification`
- **重要性**: ⭐⭐⭐⭐⭐
- **缺失影响**: 缺少 Toast、消息通知、确认对话框

#### 4. 表单组件
- **包名**: `@ldesign/form`
- **重要性**: ⭐⭐⭐⭐⭐
- **缺失影响**: 无表单验证、动态表单生成

#### 5. 表格组件
- **包名**: `@ldesign/table` / `@ldesign/grid`
- **重要性**: ⭐⭐⭐⭐⭐
- **缺失影响**: 无数据表格、排序、筛选、分页

### 🟡 中优先级 (推荐集成)

#### 6. 图表组件
- **包名**: `@ldesign/chart`
- **重要性**: ⭐⭐⭐⭐
- **缺失影响**: 无数据可视化能力

#### 7. 富文本编辑器
- **包名**: `@ldesign/editor-vue`
- **重要性**: ⭐⭐⭐⭐
- **缺失影响**: 无富文本编辑、Markdown 支持

#### 8. 文件上传
- **包名**: `@ldesign/upload`
- **重要性**: ⭐⭐⭐⭐
- **缺失影响**: 无文件上传、拖拽上传、进度显示

#### 9. 认证系统
- **包名**: `@ldesign/auth`
- **重要性**: ⭐⭐⭐⭐
- **缺失影响**: 无用户认证、Token 管理

#### 10. 权限管理
- **包名**: `@ldesign/permission`
- **重要性**: ⭐⭐⭐⭐
- **缺失影响**: 无权限控制、角色管理

### 🟢 低优先级 (按需集成)

详见后续章节...

---

## 核心包集成指南

### 1️⃣ 状态管理 - @ldesign/store-vue

#### 功能特性
- ✅ 全局状态管理
- ✅ 响应式数据
- ✅ 状态持久化
- ✅ 模块化管理
- ✅ TypeScript 支持
- ✅ DevTools 集成

#### 安装步骤

**Step 1: 添加依赖**
```bash
pnpm add @ldesign/store-vue
```

**Step 2: 修改 package.json**
```json
{
  "dependencies": {
    "@ldesign/store-vue": "workspace:*"
  }
}
```

**Step 3: 创建 store**

```typescript
// src/store/index.ts
import { createStore } from '@ldesign/store-vue'

interface AppState {
  user: {
    name: string
    role: string
  } | null
  theme: string
  isLoading: boolean
}

export const store = createStore<AppState>({
  state: {
    user: null,
    theme: 'light',
    isLoading: false,
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.name || 'Guest',
  },
  actions: {
    setUser(state, user: AppState['user']) {
      state.user = user
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
})
```

**Step 4: 集成到引擎**

```typescript
// src/plugins/index.ts
import { createStoreEnginePlugin } from '@ldesign/store-vue'
import { store } from '../store'

export function createEnginePlugins() {
  return [
    // ... 其他插件
    createStoreEnginePlugin({ store }),
  ]
}
```

**Step 5: 在组件中使用**

```vue
<script setup lang="ts">
import { useStore } from '@ldesign/store-vue'

const store = useStore()

// 读取状态
const user = computed(() => store.state.user)
const isLoggedIn = computed(() => store.getters.isLoggedIn)

// 修改状态
function login() {
  store.actions.setUser({ name: 'John', role: 'admin' })
}
</script>

<template>
  <div>
    <p v-if="isLoggedIn">欢迎, {{ store.getters.userName }}</p>
    <button v-else @click="login">登录</button>
  </div>
</template>
```

**Step 6: 创建演示页面**

```bash
# 创建 src/views/Store.vue
```

```vue
<!-- src/views/Store.vue -->
<script setup lang="ts">
import { useStore } from '@ldesign/store-vue'

const store = useStore()

function updateUser() {
  store.actions.setUser({
    name: 'Alice',
    role: 'admin',
  })
}

function clearUser() {
  store.actions.setUser(null)
}
</script>

<template>
  <div class="store-demo">
    <h1>🗄️ 状态管理演示</h1>

    <div class="state-display">
      <h2>当前状态</h2>
      <pre>{{ JSON.stringify(store.state, null, 2) }}</pre>
    </div>

    <div class="actions">
      <button @click="updateUser">设置用户</button>
      <button @click="clearUser">清除用户</button>
      <button @click="store.actions.toggleTheme">切换主题</button>
    </div>
  </div>
</template>
```

**Step 7: 添加路由**

```typescript
// src/router/index.ts
export const routes = [
  // ... 其他路由
  {
    path: '/store',
    name: 'store',
    component: () => import('../views/Store.vue'),
    meta: { title: '状态管理' },
  },
]
```

---

### 2️⃣ 日志系统 - @ldesign/logger

#### 功能特性
- ✅ 多级别日志 (debug, info, warn, error)
- ✅ 日志格式化
- ✅ 日志持久化
- ✅ 远程日志上报
- ✅ 性能监控
- ✅ 错误追踪

#### 安装步骤

**Step 1: 添加依赖**
```bash
pnpm add @ldesign/logger
```

**Step 2: 创建 logger 实例**

```typescript
// src/utils/logger.ts
import { createLogger } from '@ldesign/logger'

export const logger = createLogger({
  level: import.meta.env.DEV ? 'debug' : 'info',
  prefix: '[App-Vue]',
  timestamp: true,

  // 日志持久化
  storage: {
    enabled: true,
    maxSize: 1000, // 最多保存 1000 条
  },

  // 远程上报
  remote: {
    enabled: !import.meta.env.DEV,
    url: '/api/logs',
    batchSize: 10,
  },
})
```

**Step 3: 全局使用**

```typescript
// src/main.ts
import { logger } from './utils/logger'

// 全局错误处理
window.addEventListener('error', (event) => {
  logger.error('全局错误:', event.error)
})

// 未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  logger.error('未处理的 Promise 拒绝:', event.reason)
})

// 在引擎中使用
engine.events.on('*', (event, payload) => {
  logger.debug('引擎事件:', event, payload)
})
```

**Step 4: 在组件中使用**

```vue
<script setup lang="ts">
import { logger } from '@/utils/logger'

function handleClick() {
  logger.info('按钮被点击')

  try {
    // 业务逻辑
  } catch (error) {
    logger.error('操作失败:', error)
  }
}
</script>
```

**Step 5: 创建日志查看页面**

```vue
<!-- src/views/Logger.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { logger } from '@/utils/logger'

const logs = ref<any[]>([])

onMounted(() => {
  logs.value = logger.getLogs()
})

function clearLogs() {
  logger.clear()
  logs.value = []
}

function testLogs() {
  logger.debug('这是一条调试日志')
  logger.info('这是一条信息日志')
  logger.warn('这是一条警告日志')
  logger.error('这是一条错误日志')
  logs.value = logger.getLogs()
}
</script>

<template>
  <div class="logger-demo">
    <h1>📝 日志系统演示</h1>

    <div class="actions">
      <button @click="testLogs">生成测试日志</button>
      <button @click="clearLogs">清空日志</button>
    </div>

    <div class="logs">
      <div
        v-for="(log, index) in logs"
        :key="index"
        :class="['log-item', log.level]"
      >
        <span class="timestamp">{{ log.timestamp }}</span>
        <span class="level">{{ log.level }}</span>
        <span class="message">{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-item {
  padding: 8px;
  margin: 4px 0;
  border-radius: 4px;
  font-family: monospace;
}

.log-item.debug { background: #e3f2fd; }
.log-item.info { background: #e8f5e9; }
.log-item.warn { background: #fff3e0; }
.log-item.error { background: #ffebee; }
</style>
```

---

### 3️⃣ 通知系统 - @ldesign/notification

#### 功能特性
- ✅ Toast 提示
- ✅ 消息通知
- ✅ 确认对话框
- ✅ 加载状态
- ✅ 自定义位置
- ✅ 自动关闭
- ✅ 队列管理

#### 安装步骤

**Step 1: 添加依赖**
```bash
pnpm add @ldesign/notification
```

**Step 2: 集成到引擎**

```typescript
// src/plugins/index.ts
import { createNotificationEnginePlugin } from '@ldesign/notification'

export function createEnginePlugins() {
  return [
    // ... 其他插件
    createNotificationEnginePlugin({
      position: 'top-right',
      duration: 3000,
      maxCount: 5,
    }),
  ]
}
```

**Step 3: 在组件中使用**

```vue
<script setup lang="ts">
import { useNotification } from '@ldesign/notification'

const notification = useNotification()

function showSuccess() {
  notification.success('操作成功！')
}

function showError() {
  notification.error('操作失败，请重试')
}

function showWarning() {
  notification.warning('请注意检查输入')
}

function showInfo() {
  notification.info('这是一条提示信息')
}

async function showConfirm() {
  const confirmed = await notification.confirm({
    title: '确认删除',
    message: '确定要删除这条记录吗？',
    confirmText: '删除',
    cancelText: '取消',
  })

  if (confirmed) {
    notification.success('已删除')
  }
}

function showLoading() {
  const loading = notification.loading('加载中...')

  setTimeout(() => {
    loading.close()
    notification.success('加载完成')
  }, 2000)
}
</script>

<template>
  <div class="notification-demo">
    <h1>🔔 通知系统演示</h1>

    <div class="actions">
      <button @click="showSuccess">成功提示</button>
      <button @click="showError">错误提示</button>
      <button @click="showWarning">警告提示</button>
      <button @click="showInfo">信息提示</button>
      <button @click="showConfirm">确认对话框</button>
      <button @click="showLoading">加载状态</button>
    </div>
  </div>
</template>
```

---

### 4️⃣ 表单组件 - @ldesign/form

#### 功能特性
- ✅ 表单验证
- ✅ 动态表单生成
- ✅ 自定义验证规则
- ✅ 表单状态管理
- ✅ 异步验证
- ✅ 字段联动
- ✅ 表单重置

#### 安装步骤

**Step 1: 添加依赖**
```bash
pnpm add @ldesign/form
```

**Step 2: 在组件中使用**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@ldesign/form'

const { form, validate, reset } = useForm({
  fields: {
    username: {
      value: '',
      rules: [
        { required: true, message: '请输入用户名' },
        { min: 3, max: 20, message: '用户名长度为 3-20 个字符' },
      ],
    },
    email: {
      value: '',
      rules: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '邮箱格式不正确' },
      ],
    },
    password: {
      value: '',
      rules: [
        { required: true, message: '请输入密码' },
        { min: 6, message: '密码至少 6 个字符' },
      ],
    },
  },
})

async function handleSubmit() {
  const valid = await validate()

  if (valid) {
    console.log('表单数据:', form.values)
    // 提交表单
  }
}
</script>

<template>
  <div class="form-demo">
    <h1>📝 表单组件演示</h1>

    <form @submit.prevent="handleSubmit">
      <div class="form-item">
        <label>用户名</label>
        <input v-model="form.fields.username.value" />
        <span class="error">{{ form.fields.username.error }}</span>
      </div>

      <div class="form-item">
        <label>邮箱</label>
        <input v-model="form.fields.email.value" type="email" />
        <span class="error">{{ form.fields.email.error }}</span>
      </div>

      <div class="form-item">
        <label>密码</label>
        <input v-model="form.fields.password.value" type="password" />
        <span class="error">{{ form.fields.password.error }}</span>
      </div>

      <div class="actions">
        <button type="submit">提交</button>
        <button type="button" @click="reset">重置</button>
      </div>
    </form>
  </div>
</template>
```

---

### 5️⃣ 表格组件 - @ldesign/table

#### 功能特性
- ✅ 数据表格展示
- ✅ 排序、筛选、分页
- ✅ 虚拟滚动
- ✅ 可编辑表格
- ✅ 行选择
- ✅ 列配置
- ✅ 导出数据

#### 安装步骤

**Step 1: 添加依赖**
```bash
pnpm add @ldesign/table
```

**Step 2: 在组件中使用**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LTable } from '@ldesign/table'

const columns = [
  { key: 'id', title: 'ID', width: 80, sortable: true },
  { key: 'name', title: '姓名', width: 120, sortable: true },
  { key: 'email', title: '邮箱', width: 200 },
  { key: 'role', title: '角色', width: 100, filterable: true },
  { key: 'status', title: '状态', width: 100 },
  { key: 'actions', title: '操作', width: 150 },
]

const data = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', status: '在线' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', status: '离线' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', status: '在线' },
])

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
})

function handleSort(column: string, order: 'asc' | 'desc') {
  console.log('排序:', column, order)
}

function handleFilter(column: string, value: any) {
  console.log('筛选:', column, value)
}

function handlePageChange(page: number) {
  pagination.value.current = page
}
</script>

<template>
  <div class="table-demo">
    <h1>📊 表格组件演示</h1>

    <LTable
      :columns="columns"
      :data="data"
      :pagination="pagination"
      @sort="handleSort"
      @filter="handleFilter"
      @page-change="handlePageChange"
    >
      <template #actions="{ row }">
        <button @click="() => console.log('编辑', row)">编辑</button>
        <button @click="() => console.log('删除', row)">删除</button>
      </template>
    </LTable>
  </div>
</template>
```

---

## 功能库集成指南

### 6️⃣ 图表组件 - @ldesign/chart

#### 功能特性
- ✅ 支持 ECharts/VChart 双引擎
- ✅ 10+ 图表类型（柱状图、折线图、饼图等）
- ✅ 响应式图表
- ✅ 主题定制
- ✅ 数据动态更新
- ✅ 交互事件

#### 快速集成

```bash
# 1. 安装依赖
pnpm add @ldesign/chart

# 2. 在组件中使用
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LChart } from '@ldesign/chart'

const chartData = ref({
  type: 'bar',
  data: {
    labels: ['一月', '二月', '三月', '四月', '五月'],
    datasets: [{
      label: '销售额',
      data: [12, 19, 3, 5, 2],
    }],
  },
})
</script>

<template>
  <div class="chart-demo">
    <h1>📈 图表组件演示</h1>
    <LChart :config="chartData" />
  </div>
</template>
```

---

### 7️⃣ 富文本编辑器 - @ldesign/editor-vue

#### 功能特性
- ✅ 富文本编辑
- ✅ Markdown 支持
- ✅ 代码高亮
- ✅ 图片上传
- ✅ 表格编辑
- ✅ 导出 HTML/Markdown

#### 快速集成

```bash
pnpm add @ldesign/editor-vue
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LEditor } from '@ldesign/editor-vue'

const content = ref('<p>Hello World!</p>')

function handleChange(value: string) {
  content.value = value
}
</script>

<template>
  <div class="editor-demo">
    <h1>✏️ 富文本编辑器演示</h1>
    <LEditor v-model="content" @change="handleChange" />
  </div>
</template>
```

---

### 8️⃣ 文件上传 - @ldesign/upload

#### 功能特性
- ✅ 文件上传
- ✅ 拖拽上传
- ✅ 进度显示
- ✅ 大文件分片上传
- ✅ 文件预览
- ✅ 多文件上传

#### 快速集成

```bash
pnpm add @ldesign/upload
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LUpload } from '@ldesign/upload'

const fileList = ref([])

function handleUpload(file: File) {
  console.log('上传文件:', file)
  // 上传逻辑
}
</script>

<template>
  <div class="upload-demo">
    <h1>📤 文件上传演示</h1>
    <LUpload
      v-model="fileList"
      :action="'/api/upload'"
      :multiple="true"
      :drag="true"
      @upload="handleUpload"
    />
  </div>
</template>
```

---

### 9️⃣ 日历组件 - @ldesign/calendar

#### 功能特性
- ✅ 日期选择
- ✅ 日程管理
- ✅ 事件标记
- ✅ 多视图切换（月/周/日）
- ✅ 自定义事件渲染

#### 快速集成

```bash
pnpm add @ldesign/calendar
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LCalendar } from '@ldesign/calendar'

const events = ref([
  { date: '2025-01-28', title: '会议', type: 'meeting' },
  { date: '2025-01-29', title: '培训', type: 'training' },
])

function handleDateClick(date: string) {
  console.log('选择日期:', date)
}
</script>

<template>
  <div class="calendar-demo">
    <h1>📅 日历组件演示</h1>
    <LCalendar :events="events" @date-click="handleDateClick" />
  </div>
</template>
```

---

### 🔟 认证系统 - @ldesign/auth

#### 功能特性
- ✅ 用户认证
- ✅ Token 管理
- ✅ SSO 支持
- ✅ OAuth 集成
- ✅ 权限验证
- ✅ 自动刷新 Token

#### 快速集成

```bash
pnpm add @ldesign/auth
```

```typescript
// src/plugins/index.ts
import { createAuthEnginePlugin } from '@ldesign/auth'

export function createEnginePlugins() {
  return [
    // ... 其他插件
    createAuthEnginePlugin({
      tokenKey: 'access_token',
      refreshTokenKey: 'refresh_token',
      loginUrl: '/api/login',
      logoutUrl: '/api/logout',
      refreshUrl: '/api/refresh',
    }),
  ]
}
```

```vue
<script setup lang="ts">
import { useAuth } from '@ldesign/auth'

const auth = useAuth()

async function login() {
  await auth.login({
    username: 'admin',
    password: '123456',
  })
}

async function logout() {
  await auth.logout()
}
</script>

<template>
  <div class="auth-demo">
    <h1>🔐 认证系统演示</h1>

    <div v-if="auth.isAuthenticated">
      <p>欢迎, {{ auth.user?.name }}</p>
      <button @click="logout">退出登录</button>
    </div>

    <div v-else>
      <button @click="login">登录</button>
    </div>
  </div>
</template>
```

---

## 专业功能库集成

### 地图组件 - @ldesign/map-vue

```bash
pnpm add @ldesign/map-vue
```

```vue
<script setup lang="ts">
import { LMap } from '@ldesign/map-vue'

const center = { lng: 116.404, lat: 39.915 }
const markers = [
  { lng: 116.404, lat: 39.915, title: '北京' },
]
</script>

<template>
  <LMap :center="center" :markers="markers" :zoom="12" />
</template>
```

---

### 视频播放器 - @ldesign/video

```bash
pnpm add @ldesign/video
```

```vue
<script setup lang="ts">
import { LVideo } from '@ldesign/video'
</script>

<template>
  <LVideo
    src="https://example.com/video.mp4"
    :controls="true"
    :autoplay="false"
  />
</template>
```

---

### PDF 查看器 - @ldesign/pdf-vue

```bash
pnpm add @ldesign/pdf-vue
```

```vue
<script setup lang="ts">
import { LPdfViewer } from '@ldesign/pdf-vue'
</script>

<template>
  <LPdfViewer src="/documents/sample.pdf" />
</template>
```

---

### Excel 处理 - @ldesign/excel-vue

```bash
pnpm add @ldesign/excel-vue
```

```vue
<script setup lang="ts">
import { LExcel } from '@ldesign/excel-vue'

function handleExport() {
  // 导出 Excel
}

function handleImport(data: any) {
  console.log('导入数据:', data)
}
</script>

<template>
  <LExcel
    :data="tableData"
    @export="handleExport"
    @import="handleImport"
  />
</template>
```

---

### 代码编辑器 - @ldesign/code-editor-vue

```bash
pnpm add @ldesign/code-editor-vue
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LCodeEditor } from '@ldesign/code-editor-vue'

const code = ref('console.log("Hello World")')
</script>

<template>
  <LCodeEditor
    v-model="code"
    language="javascript"
    :theme="'vs-dark'"
  />
</template>
```

---

### 图片裁剪 - @ldesign/cropper-vue

```bash
pnpm add @ldesign/cropper-vue
```

```vue
<script setup lang="ts">
import { LCropper } from '@ldesign/cropper-vue'

function handleCrop(blob: Blob) {
  console.log('裁剪结果:', blob)
}
</script>

<template>
  <LCropper
    src="/images/photo.jpg"
    :aspect-ratio="16/9"
    @crop="handleCrop"
  />
</template>
```

---

### 二维码 - @ldesign/qrcode

```bash
pnpm add @ldesign/qrcode
```

```vue
<script setup lang="ts">
import { LQRCode } from '@ldesign/qrcode'
</script>

<template>
  <LQRCode
    value="https://example.com"
    :size="200"
    :level="'H'"
  />
</template>
```

---

### 电子签名 - @ldesign/signature-vue

```bash
pnpm add @ldesign/signature-vue
```

```vue
<script setup lang="ts">
import { LSignature } from '@ldesign/signature-vue'

function handleSave(dataUrl: string) {
  console.log('签名数据:', dataUrl)
}
</script>

<template>
  <LSignature
    :width="400"
    :height="200"
    @save="handleSave"
  />
</template>
```

---

## 集成优先级建议

### 🔴 第一阶段 (核心功能) - 立即集成

**预计时间**: 1-2 天

1. ✅ **@ldesign/store-vue** - 状态管理
2. ✅ **@ldesign/logger** - 日志系统
3. ✅ **@ldesign/notification** - 通知系统
4. ✅ **@ldesign/form** - 表单组件
5. ✅ **@ldesign/table** - 表格组件

**价值**: 这些是企业级应用的基础设施，必须优先集成。

---

### 🟡 第二阶段 (常用功能) - 近期集成

**预计时间**: 2-3 天

6. ✅ **@ldesign/chart** - 图表组件
7. ✅ **@ldesign/editor-vue** - 富文本编辑器
8. ✅ **@ldesign/upload** - 文件上传
9. ✅ **@ldesign/calendar** - 日历组件
10. ✅ **@ldesign/datepicker** - 日期选择器
11. ✅ **@ldesign/auth** - 认证系统
12. ✅ **@ldesign/permission** - 权限管理

**价值**: 这些是常见的业务功能，能显著提升应用的实用性。

---

### 🟢 第三阶段 (增强功能) - 按需集成

**预计时间**: 3-5 天

13. ✅ **@ldesign/websocket** - WebSocket
14. ✅ **@ldesign/storage** - 存储管理
15. ✅ **@ldesign/menu** - 菜单系统
16. ✅ **@ldesign/tabs** - 标签页
17. ✅ **@ldesign/progress** - 进度条
18. ✅ **@ldesign/timeline** - 时间轴
19. ✅ **@ldesign/tree** - 树形组件

**价值**: 这些功能能进一步增强应用的交互体验。

---

### 🔵 第四阶段 (专业功能) - 特定场景

**预计时间**: 按需集成

20. ✅ **@ldesign/map-vue** - 地图组件
21. ✅ **@ldesign/video** - 视频播放器
22. ✅ **@ldesign/pdf-vue** - PDF 查看器
23. ✅ **@ldesign/excel-vue** - Excel 处理
24. ✅ **@ldesign/code-editor-vue** - 代码编辑器
25. ✅ **@ldesign/cropper-vue** - 图片裁剪
26. ✅ **@ldesign/qrcode** - 二维码
27. ✅ **@ldesign/signature-vue** - 电子签名
28. ✅ **@ldesign/3d-viewer-vue** - 3D 查看器
29. ✅ **@ldesign/flowchart** - 流程图
30. ✅ **@ldesign/gantt** - 甘特图

**价值**: 这些是专业领域的功能，根据实际业务需求选择性集成。

---

## 完整集成示例

### 完整的 package.json

```json
{
  "name": "@ldesign/app-vue",
  "version": "1.0.0",
  "dependencies": {
    "vue": "^3.4.0",

    "// 已集成": "",
    "@ldesign/engine-vue3": "workspace:*",
    "@ldesign/router-vue": "workspace:*",
    "@ldesign/i18n-vue": "workspace:*",
    "@ldesign/color-vue": "workspace:*",
    "@ldesign/size-vue": "workspace:*",
    "@ldesign/http-vue": "workspace:*",
    "@ldesign/device-vue": "workspace:*",
    "@ldesign/cache": "workspace:*",
    "@ldesign/crypto-vue": "workspace:*",

    "// 第一阶段": "",
    "@ldesign/store-vue": "workspace:*",
    "@ldesign/logger": "workspace:*",
    "@ldesign/notification": "workspace:*",
    "@ldesign/form": "workspace:*",
    "@ldesign/table": "workspace:*",

    "// 第二阶段": "",
    "@ldesign/chart": "workspace:*",
    "@ldesign/editor-vue": "workspace:*",
    "@ldesign/upload": "workspace:*",
    "@ldesign/calendar": "workspace:*",
    "@ldesign/datepicker": "workspace:*",
    "@ldesign/auth": "workspace:*",
    "@ldesign/permission": "workspace:*",

    "// 第三阶段": "",
    "@ldesign/websocket": "workspace:*",
    "@ldesign/storage": "workspace:*",
    "@ldesign/menu": "workspace:*",
    "@ldesign/tabs": "workspace:*",
    "@ldesign/progress": "workspace:*",
    "@ldesign/timeline": "workspace:*",
    "@ldesign/tree": "workspace:*"
  }
}
```

### 完整的路由配置

```typescript
// src/router/index.ts
export const routes = [
  // 基础页面
  { path: '/', name: 'home', component: () => import('../views/Home.vue'), meta: { title: '首页' } },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },

  // 系统功能
  { path: '/theme', name: 'theme', component: () => import('../views/Theme.vue'), meta: { title: '主题管理' } },
  { path: '/size', name: 'size', component: () => import('../views/Size.vue'), meta: { title: '尺寸管理' } },
  { path: '/http', name: 'http', component: () => import('../views/Http.vue'), meta: { title: 'HTTP 请求' } },
  { path: '/device', name: 'device', component: () => import('../views/Device.vue'), meta: { title: '设备信息' } },
  { path: '/cache', name: 'cache', component: () => import('../views/Cache.vue'), meta: { title: '缓存管理' } },
  { path: '/crypto', name: 'crypto', component: () => import('../views/CryptoDemo.vue'), meta: { title: '加密功能' } },

  // 第一阶段
  { path: '/store', name: 'store', component: () => import('../views/Store.vue'), meta: { title: '状态管理' } },
  { path: '/logger', name: 'logger', component: () => import('../views/Logger.vue'), meta: { title: '日志系统' } },
  { path: '/notification', name: 'notification', component: () => import('../views/Notification.vue'), meta: { title: '通知系统' } },
  { path: '/form', name: 'form', component: () => import('../views/Form.vue'), meta: { title: '表单组件' } },
  { path: '/table', name: 'table', component: () => import('../views/Table.vue'), meta: { title: '表格组件' } },

  // 第二阶段
  { path: '/chart', name: 'chart', component: () => import('../views/Chart.vue'), meta: { title: '图表组件' } },
  { path: '/editor', name: 'editor', component: () => import('../views/Editor.vue'), meta: { title: '富文本编辑器' } },
  { path: '/upload', name: 'upload', component: () => import('../views/Upload.vue'), meta: { title: '文件上传' } },
  { path: '/calendar', name: 'calendar', component: () => import('../views/Calendar.vue'), meta: { title: '日历组件' } },

  // 更多路由...
]
```

### 完整的插件配置

```typescript
// src/plugins/index.ts
import { createI18nEnginePlugin } from '@ldesign/i18n-vue'
import { createRouterEnginePlugin } from '@ldesign/router-vue'
import { createColorEnginePlugin } from '@ldesign/color-vue'
import { createSizeEnginePlugin } from '@ldesign/size-vue'
import { createHttpEnginePlugin } from '@ldesign/http-vue'
import { createDeviceEnginePlugin } from '@ldesign/device-vue'
import { createCacheEnginePlugin } from '@ldesign/cache'
import { createStoreEnginePlugin } from '@ldesign/store-vue'
import { createNotificationEnginePlugin } from '@ldesign/notification'
import { createAuthEnginePlugin } from '@ldesign/auth'

import { routes } from '../router'
import { store } from '../store'
import zhCN from '../locales/zh-CN.json'
import enUS from '../locales/en-US.json'

export function createEnginePlugins() {
  return [
    // 国际化
    createI18nEnginePlugin({
      locale: 'zh-CN',
      fallbackLocale: 'en-US',
      messages: {
        'zh-CN': zhCN,
        'en-US': enUS,
      },
    }),

    // 路由
    createRouterEnginePlugin({
      routes,
      mode: 'history',
    }),

    // 主题
    createColorEnginePlugin({
      theme: 'light',
      primaryColor: '#1890ff',
    }),

    // 尺寸
    createSizeEnginePlugin({
      size: 'medium',
    }),

    // HTTP
    createHttpEnginePlugin({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 10000,
    }),

    // 设备
    createDeviceEnginePlugin(),

    // 缓存
    createCacheEnginePlugin({
      maxSize: 100,
      ttl: 3600000, // 1 小时
    }),

    // 状态管理
    createStoreEnginePlugin({ store }),

    // 通知
    createNotificationEnginePlugin({
      position: 'top-right',
      duration: 3000,
    }),

    // 认证
    createAuthEnginePlugin({
      tokenKey: 'access_token',
      loginUrl: '/api/login',
    }),
  ]
}
```

---

## 📝 总结

### 当前状态
- ✅ 已集成 9 个核心包
- ✅ 已有 9 个演示页面
- ⚠️ 功能覆盖率仅 20%

### 集成后状态
- ✅ 集成 30+ 个功能包
- ✅ 创建 30+ 个演示页面
- ✅ 功能覆盖率达到 80%+

### 预期收益
1. **完整的企业级功能** - 状态管理、日志、通知、权限等
2. **丰富的业务组件** - 表单、表格、图表、编辑器等
3. **专业的功能模块** - 地图、视频、PDF、Excel 等
4. **优秀的开发体验** - 统一的 API、完善的文档、丰富的示例

---

## 🚀 下一步行动

### 立即开始
```bash
# 1. 安装第一阶段的核心包
pnpm add @ldesign/store-vue @ldesign/logger @ldesign/notification @ldesign/form @ldesign/table

# 2. 运行安装
pnpm install

# 3. 创建演示页面
# 参考本文档中的示例代码

# 4. 启动开发服务器
pnpm dev

# 5. 访问演示页面
# http://localhost:3000/store
# http://localhost:3000/logger
# http://localhost:3000/notification
# ...
```

### 持续集成
- 按照优先级逐步集成其他功能包
- 为每个功能创建完整的演示页面
- 编写详细的使用文档
- 添加单元测试和集成测试

---

## 📚 参考资源

- **LDesign 官方文档**: [待补充]
- **各包的 README**: 查看 `packages/*/README.md`
- **示例项目**: 查看 `libraries/*/examples/`
- **API 文档**: 查看各包的 TypeScript 类型定义

---

## 💡 提示

1. **渐进式集成** - 不要一次性集成所有包，按优先级逐步集成
2. **测试验证** - 每集成一个包都要充分测试
3. **文档完善** - 为每个功能编写使用文档和示例
4. **性能优化** - 注意按需加载，避免打包体积过大
5. **类型安全** - 充分利用 TypeScript 的类型检查

---

<div align="center">

**🎉 祝你集成顺利！**

如有问题，请参考各包的文档或提交 Issue。

</div>

