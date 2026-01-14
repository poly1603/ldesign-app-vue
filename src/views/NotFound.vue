<script setup lang="ts">
</script>

<template>
  <div class="notfound">
    <div class="notfound__title">404</div>
    <div class="notfound__desc">页面不存在</div>
  </div>
</template>

<style scoped>
.notfound {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: var(--color-text-secondary, #64748b);
}

.notfound__title {
  font-size: 48px;
  line-height: 1;
  font-weight: 700;
  color: var(--color-text-primary, #0f172a);
}

.notfound__desc {
  font-size: 14px;
}
</style>
