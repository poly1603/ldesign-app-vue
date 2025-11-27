import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    formatters: true,
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/.ldesign/cache',
      '**/coverage',
    ],
  },
  {
    rules: {
      // 禁用有兼容性问题的规则
      'unicorn/error-message': 'off',

      // Vue 相关规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',

      // TypeScript 相关规则
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      // 通用规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-unused-vars': 'off', // 使用 TypeScript 的规则
    },
  },
)
