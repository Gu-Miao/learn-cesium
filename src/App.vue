<template>
  <NConfigProvider>
    <NGlobalStyle />
    <NLayout>
      <NLayoutHeader class="header">
        <div class="brand">
          <RouterLink to="/">Learn Cesium</RouterLink>
        </div>
      </NLayoutHeader>
      <NLayoutContent class="content">
        <RouterView />
      </NLayoutContent>
      <NLayoutFooter class="footer">Made by Gu-Miao 💖</NLayoutFooter>
    </NLayout>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NGlobalStyle,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter
} from 'naive-ui'
import { RouterLink, RouterView } from 'vue-router'
</script>

<style lang="less">
@import '/node_modules/cesium/Build/Cesium/Widgets/widgets.css';

body {
  margin: 0;
  font-size: 14px;
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  line-height: 1.6;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;

  input {
    font-family: inherit;
    font-size: inherit;
  }
}

@scrollbarWidth: 8px;
::-webkit-scrollbar {
  width: @scrollbarWidth;
}
::-webkit-scrollbar-track {
  border-radius: @scrollbarWidth;
  background: #eee;
}
::-webkit-scrollbar-thumb {
  border-radius: @scrollbarWidth;
  background: #ccc;
}

ul {
  list-style: none;
  padding-inline-start: 0;
}
</style>

<style scoped lang="less">
@height: 56px;
.header {
  height: @height;
  background-color: #3498ff;
  color: #fff;
}
.brand {
  height: 100%;
  padding: 18px 20px;
  box-sizing: border-box;
  font-size: 18px;
  a {
    text-decoration: none;
    color: inherit;
  }
}
.content {
  height: ~'calc(100vh - @{height} * 2)';
}
.footer {
  height: @height;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}
</style>
