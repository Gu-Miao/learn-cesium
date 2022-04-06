<template>
  <div class="case-item">
    <RouterLink :to="`${props.path}`" class="link">{{ props.title }}</RouterLink>
    <p>{{ props.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
const props = defineProps<{
  path: string
  title: string
  description: string
}>()
</script>

<style scoped lang="less">
.case-item {
  padding: 5px;
  padding-left: 10px;
  max-width: 200px;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 1px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: #aaa;
  }
}
.link {
  display: inline-block;
  margin-bottom: 10px;
}
</style>
