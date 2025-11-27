# 贡献指南

感谢您对 LDesign Vue App 项目的关注！本文档将帮助您了解如何参与项目开发。

## 📋 目录

- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [开发流程](#开发流程)
- [测试指南](#测试指南)

## 🛠️ 开发环境设置

### 前置要求

- Node.js >= 18
- pnpm >= 8
- Git

### 初始化开发环境

```bash
# 克隆仓库（如果是首次）
git clone <repository-url>

# 安装依赖
pnpm install

# 进入项目目录
cd apps/app-vue

# 启动开发服务器
pnpm dev
```

### IDE 配置

推荐使用 **Visual Studio Code** 并安装以下扩展：

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- EditorConfig for VS Code

## 📐 代码规范

### TypeScript 规范

- ✅ 始终使用 TypeScript 编写代码
- ✅ 为函数参数和返回值添加类型注解
- ✅ 避免使用 `any` 类型，使用 `unknown` 或具体类型
- ✅ 使用接口（interface）定义对象结构
- ✅ 使用类型别名（type）定义联合类型和交叉类型

```typescript
// ✅ 好的示例
interface User {
  id: number
  name: string
  email: string
}

function getUser(id: number): Promise<User> {
  // ...
}

// ❌ 避免
function getUser(id): any {
  // ...
}
```

### Vue 组件规范

#### 组件命名

- 使用 PascalCase 命名组件文件：`MyComponent.vue`
- 组件名应该由多个单词组成（除了 App.vue）

#### 组件结构

使用 `<script setup>` 语法：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

// Props 定义
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

// Emits 定义
const emit = defineEmits<{
  update: [value: string]
  close: []
}>()

// 响应式状态
const data = ref('')

// 计算属性
const displayText = computed(() => {
  return `${props.title}: ${props.count}`
})
</script>

<template>
  <div class="my-component">
    <!-- 模板内容 -->
  </div>
</template>

<style scoped>
.my-component {
  /* 样式 */
}
</style>
```

### CSS 规范

- 使用 BEM 命名约定或语义化类名
- 优先使用 CSS 变量（主题系统）
- 使用 `scoped` 样式避免污染全局

```vue
<style scoped>
.user-card {
  background: var(--color-bg-container);
  border: 1px solid var(--color-border);
  padding: var(--size-spacing-md);
}

.user-card__title {
  color: var(--color-text-primary);
  font-size: var(--size-font-lg);
}

.user-card__content {
  color: var(--color-text-secondary);
}
</style>
```

### 目录和文件组织

```
src/
├── api/              # API 接口层
│   └── users.ts      # 单一职责的 API 模块
├── components/       # 公共组件
│   └── Button/       # 复杂组件可以有自己的目录
│       ├── index.ts
│       ├── Button.vue
│       └── types.ts
├── composables/      # 可复用的组合式函数
│   └── useUser.ts
├── locales/          # 国际化
├── types/            # 类型定义
├── utils/            # 工具函数
└── views/            # 页面组件
```

## 📝 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
# 添加新功能
feat(theme): 添加自定义主题预设功能

支持用户创建和保存自定义主题预设

Closes #123

# 修复 bug
fix(i18n): 修复语言切换时页面标题未更新的问题

# 文档更新
docs(readme): 更新快速开始章节

# 重构代码
refactor(api): 重构用户 API 模块
```

## 🔄 开发流程

### 1. 创建功能分支

```bash
# 从 main 分支创建新分支
git checkout -b feat/my-new-feature main
```

### 2. 开发和测试

```bash
# 启动开发服务器
pnpm dev

# 运行类型检查
pnpm type-check

# 运行 ESLint
pnpm lint

# 自动修复 ESLint 问题
pnpm lint:fix
```

### 3. 提交代码

```bash
# 添加修改的文件
git add .

# 提交（遵循提交规范）
git commit -m "feat(theme): 添加自定义主题功能"
```

### 4. 推送和创建 PR

```bash
# 推送到远程
git push origin feat/my-new-feature

# 在 GitHub/GitLab 创建 Pull Request
```

## 🧪 测试指南

### 单元测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage
```

### 手动测试清单

开发新功能时，请确保：

- ✅ 在不同浏览器中测试（Chrome, Firefox, Safari）
- ✅ 测试响应式布局（桌面、平板、手机）
- ✅ 测试主题切换（浅色/深色模式）
- ✅ 测试多语言切换
- ✅ 检查控制台无错误和警告
- ✅ 验证类型检查通过
- ✅ 确保 ESLint 检查通过

## 🎨 代码风格

项目使用 ESLint 和 Prettier 自动格式化代码。

### 运行格式化

```bash
# 格式化所有文件
pnpm format

# ESLint 自动修复
pnpm lint:fix
```

### 编辑器配置

确保您的编辑器：

- 使用项目的 EditorConfig 设置
- 保存时自动运行 ESLint 修复
- 保存时自动格式化（Prettier）

## 📖 文档编写

- 为公共 API 添加 JSDoc 注释
- 更新相关的 Markdown 文档
- 为复杂功能编写使用示例

````typescript
/**
 * 获取用户信息
 * @param userId - 用户 ID
 * @returns 用户信息对象
 * @throws {Error} 当用户不存在时抛出错误
 * @example
 * ```ts
 * const user = await getUser(123)
 * console.log(user.name)
 * ```
 */
export async function getUser(userId: number): Promise<User> {
  // ...
}
````

## ❓ 获取帮助

如果您有任何问题：

1. 查看 [项目文档](./docs/README.md)
2. 搜索 [Issues](../../issues) 查看是否有类似问题
3. 创建新的 Issue 提问
4. 在 Pull Request 中 @提及维护者

## 📜 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。

---

感谢您的贡献！🎉
