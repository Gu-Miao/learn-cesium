<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<style scoped>
.toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  border-radius: 6px;
  background: rgba(3, 3, 3, 0.7);
  padding: 12px 16px;
  color: #fefefe;
}
</style>
