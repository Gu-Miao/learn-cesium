<template>
  <div class="error">
    <h1>404 Not Found</h1>
    <h3>Something went wrong, please go back or return home.</h3>
    <NButton>
      <RouterLink to="/" replace>Back Home</RouterLink>
    </NButton>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="less">
.error {
  padding: 5% 0 0 50px;
}
h1,
h3 {
  margin-bottom: 20px;
}
</style>
