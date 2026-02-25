/**
 * 表单校验插件配置
 *
 * 提供全局校验引擎和预定义的常用 Schema：
 * - 登录表单校验
 * - 用户信息校验
 * - 通用字段校验
 */
import { definePlugin } from '@ldesign/engine-vue3'
import { ValidationEngine } from '@ldesign/validate-core'
import { createValidatePlugin } from '@ldesign/validate-vue'

/**
 * 创建表单校验引擎插件
 */
export function createValidateEnginePlugin() {
  const engine = new ValidationEngine()

  // ========== 预定义常用 Schema ==========

  // 登录表单
  engine.registerSchema('login', {
    username: {
      label: '用户名',
      required: '请输入用户名',
      min: 2,
      max: 50,
    },
    password: {
      label: '密码',
      required: '请输入密码',
      min: 6,
      max: 128,
    },
    captcha: {
      label: '验证码',
      required: '请输入验证码',
      min: 4,
      max: 6,
    },
  })

  // 用户信息
  engine.registerSchema('userProfile', {
    displayName: {
      label: '显示名称',
      required: '请输入显示名称',
      min: 2,
      max: 30,
    },
    email: {
      label: '邮箱',
      type: 'email',
      message: '邮箱格式不正确',
    },
    phone: {
      label: '手机号',
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
    },
  })

  // 修改密码
  engine.registerSchema('changePassword', {
    oldPassword: {
      label: '原密码',
      required: '请输入原密码',
    },
    newPassword: {
      label: '新密码',
      required: '请输入新密码',
      min: 6,
      max: 128,
    },
    confirmPassword: {
      label: '确认密码',
      required: '请输入确认密码',
      min: 6,
      max: 128,
    },
  })

  return definePlugin({
    name: 'validate',
    version: '1.0.0',

    async install(context) {
      const { app } = context as any
      if (!app) return

      // 安装 Vue 插件
      app.use(createValidatePlugin({ globalEngine: true }))

      // 覆盖全局实例为已配置的 engine
      app.provide('ldesign-validate-engine', engine)
      app.config.globalProperties.$validate = engine
    },
  })
}

// 导出校验引擎实例供组件直接使用
export { ValidationEngine }
