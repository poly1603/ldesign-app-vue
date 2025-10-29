# LDesign Vue App

> 基于 LDesign 引擎和工具集构建的 Vue 3 示例应用

## 📦 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型系统
- **Vite** - 下一代前端构建工具
- **@ldesign/engine-vue3** - 核心引擎（插件系统、中间件、生命周期）
- **@ldesign/router-vue** - 路由管理（基于 vue-router）
- **@ldesign/color-vue** - 颜色管理和主题切换
- **@ldesign/i18n-vue** - 国际化支持
- **@ldesign/size-vue** - 响应式尺寸管理

## 🚀 快速开始

### 安装依赖

```bash
# 在项目根目录执行
pnpm install
```

### 开发模式

```bash
# 启动开发服务器（端口：3001）
pnpm dev
```

### 构建生产版本

```bash
# 类型检查 + 构建
pnpm build

# 预览构建结果
pnpm preview
```

### 代码检查

```bash
# 运行 ESLint 并自动修复
pnpm lint

# 仅类型检查
pnpm type-check
```

## 📁 项目结构

```
apps/app-vue/
├── src/
│   ├── views/              # 页面组件
│   │   ├── Layout.vue      # 布局组件
│   │   ├── HomePage.vue    # 首页
│   │   ├── EnginePage.vue  # Engine 演示
│   │   ├── RouterPage.vue  # Router 演示
│   │   ├── ColorPage.vue   # Color 演示
│   │   ├── I18nPage.vue    # I18n 演示
│   │   └── SizePage.vue    # Size 演示
│   ├── router/
│   │   └── index.ts        # 路由配置
│   ├── App.vue             # 主应用组件
│   ├── main.ts             # 应用入口
│   └── style.css           # 全局样式
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目配置
```

## 🎯 核心功能

### 1. Engine 核心引擎

基于 `@ldesign/engine-vue3` 构建，提供：

- **插件系统** - 灵活的功能扩展机制
- **中间件** - 请求/响应处理管道
- **事件系统** - 发布/订阅模式
- **状态管理** - 跨组件状态共享
- **生命周期** - 应用生命周期钩子

**使用示例**：

```vue
<script setup lang="ts">
import { useEngine, useEngineState, useEngineEvents } from '@ldesign/engine-vue3'

const engine = useEngine()
const count = useEngineState('count', 0)

useEngineEvents('custom:event', (data) => {
  console.log('事件数据:', data)
})
</script>

<template>
  <div>计数: {{ count }}</div>
</template>
```

### 2. Router 路由管理

基于 `vue-router` v4，提供增强功能：

- 路由配置
- 路由守卫
- 路由元信息
- 动态路由
- 嵌套路由

**使用示例**：

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const handleNavigate = () => {
  router.push('/target-page')
}
</script>

<template>
  <div>当前路径: {{ route.path }}</div>
</template>
```

### 3. Color 颜色管理

提供完整的颜色处理和主题管理：

- 颜色格式转换（HEX, RGB, HSL, HSV）
- 颜色调整（亮度、饱和度、透明度）
- 调色板生成
- 主题切换

**使用示例**：

```vue
<script setup lang="ts">
import { Color } from '@ldesign/color-core'
import { useTheme } from '@ldesign/color-vue'

const theme = useTheme()

const color = new Color('#3498db')
console.log(color.toRgb())  // { r: 52, g: 152, b: 219 }
</script>

<template>
  <button @click="theme.toggleMode()">
    切换主题
  </button>
</template>
```

### 4. I18n 国际化

完整的国际化解决方案：

- 多语言支持
- 动态语言切换
- 翻译插值
- 懒加载语言包
- 指令支持

**使用示例**：

```vue
<script setup lang="ts">
import { useI18n, useLocale } from '@ldesign/i18n-vue'

const { t } = useI18n()
const { locale, setLocale } = useLocale()
</script>

<template>
  <div>
    <h1>{{ t('welcome') }}</h1>
    <button @click="setLocale('en-US')">
      English
    </button>
  </div>
</template>
```

也可以使用指令：

```vue
<template>
  <p v-t="'welcome'"></p>
</template>
```

### 5. Size 尺寸管理

响应式尺寸管理系统：

- 基础字体大小管理
- 响应式断点检测
- 尺寸单位转换
- 媒体查询辅助

**使用示例**：

```vue
<script setup lang="ts">
import { useSize } from '@ldesign/size-vue'

const size = useSize()
</script>

<template>
  <div>
    <p>当前断点: {{ size.currentBreakpoint }}</p>
    <button @click="size.setBaseSize(18)">
      增大字体
    </button>
  </div>
</template>
```

## 🔧 配置说明

### Vite 配置

项目使用 Vite 作为构建工具，配置了：

- Vue 插件
- 路径别名 (`@` -> `src`)
- 代码分割优化
- Source map

### TypeScript 配置

启用了严格模式，包括：

- 未使用变量检查
- 未使用参数检查
- Switch case 穿透检查

### Vue 特性

- **Composition API** - 使用 `<script setup>` 语法
- **TypeScript 支持** - 完整的类型推导
- **响应式系统** - Vue 3 的响应式 API

## 📚 学习资源

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Vite 文档](https://vitejs.dev/)
- [Vue Router 文档](https://router.vuejs.org/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
