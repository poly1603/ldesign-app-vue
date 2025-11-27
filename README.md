# LDesign Vue3 应用

<div align="center">

**基于 LDesign 设计系统和 @ldesign/engine-vue3 构建的现代化 Vue3 应用**

[快速开始](#快速开始) • [功能特性](#功能特性) • [项目结构](#项目结构) • [开发指南](#开发指南)

</div>

---

## 📖 简介

这是一个完整的 Vue3 应用示例，展示了如何使用 LDesign 设计系统的各个功能模块：

- 🎨 **主题系统** - 动态颜色主题和深色模式支持
- 🌍 **国际化** - 完整的多语言支持（中文/英文）
- 📏 **尺寸系统** - 灵活的尺寸配置和响应式设计
- 🔌 **插件架构** - 模块化的功能集成
- 🚀 **零配置启动** - 基于 @ldesign/launcher 的开发环境

## ✨ 功能特性

### 核心功能

- ✅ **引擎系统** - 基于 `@ldesign/engine-vue3` 的应用引擎
- ✅ **路由管理** - 使用 `@ldesign/router-vue` 的声明式路由
- ✅ **国际化** - `@ldesign/i18n-vue` 提供的完整 i18n 支持
- ✅ **主题系统** - `@ldesign/color-vue` 的动态主题切换
- ✅ **尺寸管理** - `@ldesign/size-vue` 的响应式尺寸系统
- ✅ **HTTP 客户端** - `@ldesign/http-vue` 的请求管理
- ✅ **设备检测** - `@ldesign/device-vue` 的设备信息获取

### 开发特性

- 🔥 **HMR 热更新** - 修改源码立即生效
- 📦 **源码别名** - 直接使用 monorepo 包源码开发
- 🎯 **TypeScript** - 完整的类型支持
- 🔍 **ESLint** - 代码质量检查
- 🎨 **代码格式化** - Prettier 自动格式化

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
# 在 monorepo 根目录
pnpm install
```

### 开发模式

```bash
# 进入项目目录
cd apps/app-vue

# 启动开发服务器
pnpm dev

# 其他环境
pnpm dev:staging  # 预发布环境
pnpm dev:prod     # 生产环境配置
```

访问 http://localhost:3000

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 预览构建产物
pnpm preview
```

### 代码质量

```bash
# TypeScript 类型检查
pnpm type-check

# ESLint 检查
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

## 📁 项目结构

```
apps/app-vue/
├── .ldesign/                 # Launcher 配置
│   ├── launcher.config.ts    # 基础配置
│   ├── launcher.config.*.ts  # 环境特定配置
│   ├── app.config.ts         # 应用配置
│   └── app.config.*.ts       # 环境特定应用配置
├── docs/                     # 项目文档
│   ├── archive/              # 历史文档归档
│   ├── development/          # 开发文档
│   └── architecture/         # 架构文档
├── src/
│   ├── api/                  # API 接口
│   │   ├── http.ts           # HTTP 客户端配置
│   │   └── users.ts          # 用户 API
│   ├── components/           # 公共组件
│   │   ├── LanguageSwitcher.vue
│   │   └── SharedStateDemo.vue
│   ├── locales/              # 国际化语言包
│   │   ├── zh-CN.ts          # 简体中文
│   │   ├── en-US.ts          # 英文
│   │   └── index.ts          # 导出
│   ├── utils/                # 工具函数
│   │   └── state-bridge.ts  # 状态桥接
│   ├── views/                # 页面组件
│   │   ├── Home.vue          # 首页
│   │   ├── Login.vue         # 登录页
│   │   ├── Theme.vue         # 主题管理
│   │   ├── Size.vue          # 尺寸管理
│   │   ├── Http.vue          # HTTP 示例
│   │   └── Device.vue        # 设备信息
│   ├── App.vue               # 根组件
│   ├── main.ts               # 应用入口
│   └── style.css             # 全局样式
├── .env                      # 通用环境变量
├── .env.development          # 开发环境变量
├── .env.production           # 生产环境变量
├── .env.staging              # 预发布环境变量
├── .gitignore                # Git 忽略规则
├── eslint.config.js          # ESLint 配置
├── index.html                # HTML 模板
├── package.json              # 项目配置
├── tsconfig.json             # TypeScript 配置
├── tsconfig.node.json        # Node TypeScript 配置
└── README.md                 # 项目说明
```

## 🎯 技术栈

### 核心框架

- **Vue 3.4+** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite 7+** - 下一代前端构建工具

### LDesign 生态

- **@ldesign/engine-vue3** - Vue3 应用引擎
- **@ldesign/router-vue** - 路由管理
- **@ldesign/i18n-vue** - 国际化支持
- **@ldesign/color-vue** - 主题系统
- **@ldesign/size-vue** - 尺寸管理
- **@ldesign/http-vue** - HTTP 客户端
- **@ldesign/device-vue** - 设备检测
- **@ldesign/launcher** - 零配置启动器

### 开发工具

- **ESLint** - 代码质量检查（@antfu/eslint-config）
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 创建 Vue 组件
2. 在 `src/main.ts` 的路由配置中添加路由
3. 在 `src/locales/` 添加国际化文本

```typescript
// main.ts
const routes = [
  {
    path: '/my-page',
    name: 'my-page',
    component: () => import('./views/MyPage.vue'),
    meta: { title: '我的页面' },
  },
]
```

### 使用插件功能

所有 LDesign 功能都通过引擎插件系统集成：

```typescript
// 使用主题
import { useColor } from '@ldesign/color-vue'

// 使用 i18n
import { useI18n } from '@ldesign/i18n-vue'

// 使用尺寸
import { useSize } from '@ldesign/size-vue'

const { t, locale, setLocale } = useI18n()
const { applyTheme, currentTheme } = useColor()
const { applySize, currentSize } = useSize()
```

### 环境配置

项目支持 3 个环境：

- **development** - 开发环境（默认）
- **staging** - 预发布环境
- **production** - 生产环境

配置文件位于 `.ldesign/` 目录：

- `launcher.config.*.ts` - 构建和服务器配置
- `app.config.*.ts` - 应用运行时配置

### 源码开发

项目配置了源码别名，可以直接修改 packages 下的包源码：

```typescript
// 修改这些包的源码会立即生效（HMR）
import { xxx } from '@ldesign/engine-vue3'
import { xxx } from '@ldesign/i18n-vue'
import { xxx } from '@ldesign/router-vue'
// ... 其他 @ldesign 包
```

## 📚 相关文档

- [项目文档](./docs/README.md)
- [开发规范](./CONTRIBUTING.md)
- [LDesign 引擎文档](../../packages/engine/README.md)
- [Launcher 文档](../../tools/launcher/README.md)

## 📄 许可证

MIT

---

<div align="center">
Built with ❤️ using LDesign
</div>
