<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import type { MenuItem } from '../api/leap/auth'

const auth = useAuth()
const route = useRoute()
const router = useRouter()

const canRedirect = computed(() => auth.loggedIn.value && (auth.menuList.value?.length ?? 0) > 0)

function findFirstLeafPath(items: MenuItem[] | undefined): string | undefined {
  if (!items || items.length === 0) return undefined

  for (const it of items) {
    const children = it.children
    const inChildren = findFirstLeafPath(children)
    if (inChildren) return inChildren

    const p = it.path
    if (typeof p === 'string' && p.startsWith('/')) return p
  }

  return undefined
}

watchEffect(() => {
  if (route.path !== '/') return
  if (!canRedirect.value) return

  const target = findFirstLeafPath(auth.menuList.value as MenuItem[])
  if (!target) return
  if (target === '/') return

  router.replace(target)
})
</script>

<template>
  <div class="home-entry">
    <div v-if="auth.loggedIn.value" class="home-entry__text">正在进入...</div>
    <div v-else class="home-entry__text">请先登录</div>
  </div>
</template>

<style scoped>
.home-entry {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--color-text-secondary, #64748b);
}

.home-entry__text {
  font-size: 14px;
}
</style>
