<template>
  <div class="Home">
    <h2>Cesium Cases</h2>

    <ul>
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
  </div>
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
  display: flex;
  flex-direction: column;
}
h2 {
  height: 50px;
  margin-bottom: 30px;
}
ul {
  flex: 1 0;
  max-height: calc(100% - 120px);
  overflow-y: auto;
}
.category {
  margin-bottom: 20px;
}
h4 {
  margin-bottom: 10px;
}
</style>
