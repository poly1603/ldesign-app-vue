# 依赖管理功能 / Dependency Management Feature

## 概述 / Overview

本功能为项目添加了一个完整的依赖管理页面，支持直观的依赖管理和 .npmrc 配置。

This feature adds a complete dependency management page to the project, supporting intuitive dependency management and .npmrc configuration.

## 功能特性 / Features

### 1. 依赖列表管理 / Dependency List Management

- ✅ 查看所有项目依赖（生产依赖和开发依赖）
- ✅ 搜索和筛选依赖
- ✅ 查看依赖的当前版本和最新版本
- ✅ 一键升级依赖到最新版本
- ✅ 删除不需要的依赖
- ✅ 添加新依赖

### 2. .npmrc 配置管理 / .npmrc Configuration

- ✅ 配置默认 npm 源
- ✅ 快速切换到常用镜像（npm 官方、淘宝镜像、Yarn）
- ✅ 配置 scope 级别的源（例如 @ldesign 包从特定源安装）
- ✅ 自定义 .npmrc 配置
- ✅ 直观的可视化操作界面

## 文件结构 / File Structure

```
src/
├── api/
│   └── dependencies.ts          # 依赖管理 API
├── views/
│   └── DependencyManagement.vue # 依赖管理页面组件
└── router/
    └── index.ts                 # 路由配置（已添加 /dependencies 路由）
```

## 使用方法 / Usage

### 访问页面 / Access the Page

1. 在首页点击"📦 依赖管理 / Dependencies"按钮
2. 或直接访问 `/dependencies` 路由

### 依赖列表操作 / Dependency List Operations

#### 查看依赖 / View Dependencies
- 依赖卡片显示包名、版本信息、描述
- 可以通过搜索框搜索依赖
- 可以通过类型筛选（全部、生产依赖、开发依赖）

#### 添加依赖 / Add Dependency
1. 点击"➕ 添加依赖"按钮
2. 输入包名（必填）
3. 输入版本（可选，留空安装最新版）
4. 选择依赖类型（生产依赖/开发依赖）
5. 点击"安装"

#### 升级依赖 / Upgrade Dependency
- 如果依赖有新版本可用，会显示"⬆️ 升级"按钮
- 点击按钮即可升级到最新版本

#### 删除依赖 / Remove Dependency
- 点击"🗑️ 删除"按钮
- 确认后即可删除依赖

### .npmrc 配置 / .npmrc Configuration

#### 设置默认源 / Set Default Registry
1. 切换到".npmrc 配置"标签
2. 输入 Registry URL
3. 或点击预设按钮快速切换（npm 官方、淘宝镜像、Yarn）

#### 配置 Scope / Configure Scope
1. 在"Scope 配置"区域
2. 输入 scope 名称（例如：ldesign）
3. 输入对应的 Registry URL
4. 点击"➕ 添加 Scope"
5. 可以删除已有的 scope 配置

示例：
```
@ldesign → https://npm.your-company.com/
@babel → https://registry.npmjs.org/
```

#### 自定义配置 / Custom Configuration
在"自定义配置"文本区域直接编辑 .npmrc 内容，例如：
```
always-auth=true
strict-ssl=false
```

#### 保存配置 / Save Configuration
点击"💾 保存配置"按钮保存所有更改

## API 接口 / API Endpoints

后端需要实现以下 API 端点：

### 依赖管理 / Dependency Management

- `GET /api/dependencies` - 获取依赖列表
- `POST /api/dependencies/install` - 安装依赖
  ```json
  {
    "name": "lodash",
    "version": "^4.17.21",
    "type": "dependencies"
  }
  ```
- `PUT /api/dependencies/upgrade` - 升级依赖
  ```json
  {
    "name": "vue",
    "version": "3.4.27"
  }
  ```
- `DELETE /api/dependencies/{name}` - 删除依赖
- `GET /api/dependencies/{name}/check-updates` - 检查更新

### .npmrc 配置 / .npmrc Configuration

- `GET /api/dependencies/npmrc` - 获取 .npmrc 配置
- `PUT /api/dependencies/npmrc` - 更新 .npmrc 配置
  ```json
  {
    "registry": "https://registry.npmjs.org/",
    "scopes": {
      "ldesign": "https://npm.your-company.com/"
    },
    "customConfig": "always-auth=true"
  }
  ```

## 演示模式 / Demo Mode

当前实现包含模拟数据，即使后端 API 不可用也可以查看界面和功能。

The current implementation includes mock data, so you can view the interface and functionality even if the backend API is unavailable.

## 技术栈 / Tech Stack

- Vue 3 Composition API
- TypeScript
- CSS Variables for theming
- Fetch API for HTTP requests

## 样式特性 / Style Features

- 响应式设计，支持移动端
- 流畅的动画效果
- 卡片式布局
- 模态对话框
- 主题变量支持

## 后续改进 / Future Improvements

- [ ] 集成真实的包管理器 API（npm, pnpm, yarn）
- [ ] 依赖树可视化
- [ ] 批量操作（批量升级、批量删除）
- [ ] 依赖安全性检查
- [ ] 依赖分析报告
- [ ] 版本历史记录
- [ ] 依赖冲突检测
- [ ] 支持 pnpm workspace 特性
