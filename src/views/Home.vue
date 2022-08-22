<template>
  <ul class="Home">
    <li v-for="(cases, category) in caseMap" :key="category" class="category">
      <h4>{{ category }}</h4>
      <NSpace>
        <CaseItem
          v-for="c in cases"
          :key="c.name"
          :path="c.path"
          :title="c.name"
          :description="c.description"
        />
      </NSpace>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui'
import CaseItem from '@/components/CaseItem.vue'
import { caseMap } from './cases'
</script>

<style scoped lang="less">
.Home {
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  margin: 0;
  flex: 1 0;
  overflow-y: auto;
}
.category {
  margin-bottom: 20px;
}
h4 {
  margin-bottom: 10px;
}
</style>
