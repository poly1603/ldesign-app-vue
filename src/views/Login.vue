<script setup lang="ts">
import { useEngine, useRouterService } from '@ldesign/engine-vue3'
import { ref } from 'vue'

const engine = useEngine()
const router = useRouterService()

const username = ref('')
const password = ref('')

function handleLogin() {
  console.log('[Login]', username.value, password.value)

  // 模拟登录成功
  engine.events.emit('user:login', { username: username.value })

  // 跳转到首页
  router.push('/')
}
</script>

<template>
  <div class="container">
    <div class="card" style="max-width: 400px; margin: 4rem auto;">
      <h1>{{ $t('login.title') }}</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">{{ $t('login.username') }}</label>
          <input
            v-model="username"
            type="text"
            class="form-input"
            :placeholder="$t('login.usernamePlaceholder')"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('login.password') }}</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            :placeholder="$t('login.passwordPlaceholder')"
            required
          >
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%">
          {{ $t('login.loginButton') }}
        </button>
      </form>

      <div style="margin-top: 1rem; text-align: center;">
        <router-link to="/">
          {{ $t('common.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: var(--color-text-primary, #2c3e50);
  margin-bottom: 2rem;
  text-align: center;
}

a {
  color: var(--color-primary-default, #3b82f6);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-primary-hover, #2563eb);
  text-decoration: underline;
}
</style>
