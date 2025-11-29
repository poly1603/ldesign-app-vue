# Launcher 别名配置示例

本文档展示了如何使用新的 `stage` 模式配置别名。

## 配置说明

### Stage 模式

`stage` 字段支持三个值：

- `'dev'` - 仅在开发模式生效
- `'build'` - 仅在构建模式生效
- `'all'` - 在所有模式下生效

### 配置策略

1. **项目内部别名** - 使用 `stage: 'all'`，在所有模式下生效
2. **@ldesign 包别名** - 使用 `stage: 'dev'`，仅在开发模式使用源码，构建时使用 node_modules 中的打包产物

## 配置示例

```typescript
import { defineConfig } from '@ldesign/launcher'
import type { AliasConfig } from '@ldesign/launcher'

export default defineConfig({
  resolve: {
    alias: ([
      // 项目内部别名 - 所有模式生效
      { find: '@', replacement: './src', stage: 'all' as const },
      { find: '@components', replacement: './src/components', stage: 'all' as const },

      // @ldesign 包别名 - 仅开发模式生效
      // 支持子路径导入
      { find: /^@ldesign\/engine-vue3\/(.+)$/, replacement: '../../../packages/engine/packages/vue3/src/$1', stage: 'dev' as const },
      { find: '@ldesign/engine-vue3', replacement: '../../../packages/engine/packages/vue3/src/index.ts', stage: 'dev' as const },

      // 单包结构
      { find: /^@ldesign\/cache\/(.+)$/, replacement: '../../../packages/cache/src/$1', stage: 'dev' as const },
      { find: '@ldesign/cache', replacement: '../../../packages/cache/src/index.ts', stage: 'dev' as const },

      // 仅构建时生效的别名
      { find: 'lodash', replacement: 'lodash-es', stage: 'build' as const },
    ] satisfies AliasConfig[]) as any,
  },
})
```

## 优势

### 1. 开发体验优化

- **开发模式**：使用源码，支持 HMR 热更新，修改包源码立即生效
- **构建模式**：使用打包产物，性能更好，体积更小

### 2. 配置简化

使用 `stage` 字段替代 `stages` 数组，配置更简洁：

```typescript
// ❌ 旧方式
{ find: '@ldesign/core', replacement: './packages/core/src', stages: ['dev'] }

// ✅ 新方式
{ find: '@ldesign/core', replacement: './packages/core/src', stage: 'dev' as const }
```

### 3. 类型安全

使用 `as const` 确保类型推断正确，配合 `satisfies AliasConfig[]` 提供完整的类型检查。

## 注意事项

1. **别名顺序很重要**：更具体的规则（正则表达式）要放在前面
2. **使用 `as const`**：确保 TypeScript 正确推断字面量类型
3. **类型断言**：由于 Vite 类型限制，需要使用 `as any` 进行类型断言
4. **子路径支持**：使用正则表达式匹配子路径导入（如 `@ldesign/router-vue/plugins`）

## 完整配置

参考 `launcher.config.ts` 文件查看完整的别名配置示例。

