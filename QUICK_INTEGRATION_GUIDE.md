# ⚡ 快速集成指南

> 5 分钟快速了解如何集成 LDesign 功能包到 app-vue

---

## 📦 集成三步走

### Step 1: 安装依赖

```bash
# 添加到 package.json
pnpm add @ldesign/包名
```

### Step 2: 配置插件（如果需要）

```typescript
// src/plugins/index.ts
import { create包名EnginePlugin } from '@ldesign/包名'

export function createEnginePlugins() {
  return [
    // ... 其他插件
    create包名EnginePlugin({ /* 配置 */ }),
  ]
}
```

### Step 3: 在组件中使用

```vue
<script setup lang="ts">
import { use包名 } from '@ldesign/包名'

const 实例 = use包名()
</script>

<template>
  <div>使用功能</div>
</template>
```

---

## 🎯 优先级清单

### 🔴 第一阶段 (必须) - 1-2 天

- [ ] **@ldesign/store-vue** - 状态管理
  ```bash
  pnpm add @ldesign/store-vue
  ```

- [ ] **@ldesign/logger** - 日志系统
  ```bash
  pnpm add @ldesign/logger
  ```

- [ ] **@ldesign/notification** - 通知系统
  ```bash
  pnpm add @ldesign/notification
  ```

- [ ] **@ldesign/form** - 表单组件
  ```bash
  pnpm add @ldesign/form
  ```

- [ ] **@ldesign/table** - 表格组件
  ```bash
  pnpm add @ldesign/table
  ```

### 🟡 第二阶段 (推荐) - 2-3 天

- [ ] **@ldesign/chart** - 图表组件
- [ ] **@ldesign/editor-vue** - 富文本编辑器
- [ ] **@ldesign/upload** - 文件上传
- [ ] **@ldesign/calendar** - 日历组件
- [ ] **@ldesign/datepicker** - 日期选择器
- [ ] **@ldesign/auth** - 认证系统
- [ ] **@ldesign/permission** - 权限管理

### 🟢 第三阶段 (增强) - 3-5 天

- [ ] **@ldesign/websocket** - WebSocket
- [ ] **@ldesign/storage** - 存储管理
- [ ] **@ldesign/menu** - 菜单系统
- [ ] **@ldesign/tabs** - 标签页
- [ ] **@ldesign/progress** - 进度条
- [ ] **@ldesign/timeline** - 时间轴
- [ ] **@ldesign/tree** - 树形组件

### 🔵 第四阶段 (专业) - 按需

- [ ] **@ldesign/map-vue** - 地图组件
- [ ] **@ldesign/video** - 视频播放器
- [ ] **@ldesign/pdf-vue** - PDF 查看器
- [ ] **@ldesign/excel-vue** - Excel 处理
- [ ] **@ldesign/code-editor-vue** - 代码编辑器
- [ ] **@ldesign/cropper-vue** - 图片裁剪
- [ ] **@ldesign/qrcode** - 二维码
- [ ] **@ldesign/signature-vue** - 电子签名

---

## 🚀 一键安装脚本

### 安装第一阶段（核心功能）

```bash
pnpm add @ldesign/store-vue @ldesign/logger @ldesign/notification @ldesign/form @ldesign/table
```

### 安装第二阶段（常用功能）

```bash
pnpm add @ldesign/chart @ldesign/editor-vue @ldesign/upload @ldesign/calendar @ldesign/datepicker @ldesign/auth @ldesign/permission
```

### 安装第三阶段（增强功能）

```bash
pnpm add @ldesign/websocket @ldesign/storage @ldesign/menu @ldesign/tabs @ldesign/progress @ldesign/timeline @ldesign/tree
```

### 安装全部（一次性）

```bash
pnpm add \
  @ldesign/store-vue \
  @ldesign/logger \
  @ldesign/notification \
  @ldesign/form \
  @ldesign/table \
  @ldesign/chart \
  @ldesign/editor-vue \
  @ldesign/upload \
  @ldesign/calendar \
  @ldesign/datepicker \
  @ldesign/auth \
  @ldesign/permission \
  @ldesign/websocket \
  @ldesign/storage \
  @ldesign/menu \
  @ldesign/tabs \
  @ldesign/progress \
  @ldesign/timeline \
  @ldesign/tree
```

---

## 📝 创建演示页面模板

```vue
<!-- src/views/功能名.vue -->
<script setup lang="ts">
import { ref } from 'vue'
// 导入功能

// 状态定义

// 方法定义
</script>

<template>
  <div class="demo-page">
    <h1>🎯 功能名演示</h1>
    
    <section class="demo-section">
      <h2>基础用法</h2>
      <!-- 演示内容 -->
    </section>
    
    <section class="demo-section">
      <h2>高级用法</h2>
      <!-- 演示内容 -->
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  padding: 20px;
}

.demo-section {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
```

---

## 🔧 常见问题

### Q1: 包安装后找不到模块？
```bash
# 重新安装依赖
pnpm install

# 清理缓存
pnpm store prune
```

### Q2: TypeScript 类型错误？
```bash
# 重新生成类型
pnpm build

# 检查 tsconfig.json 配置
```

### Q3: 开发环境热更新不生效？
```bash
# 检查 launcher.config.development.ts 中的 optimizeDeps 配置
# 确保新包已添加到 exclude 列表
```

---

## 📚 详细文档

查看完整的集成指南：[MISSING_FEATURES_GUIDE.md](./MISSING_FEATURES_GUIDE.md)

---

<div align="center">

**🎉 开始集成吧！**

</div>

