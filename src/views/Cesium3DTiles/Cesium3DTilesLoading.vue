<template>
  <CesiumContainer>
    <Toolbar v-if="show" class="transparent">
      <NIcon size="50">
        <Loading />
      </NIcon>
    </Toolbar>
  </CesiumContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createWorldTerrain, createOsmBuildings, Cartesian3, Math as CesiumMath } from 'cesium'
import { NIcon } from 'naive-ui'
import useCesium from '@/hooks/useCesium'
import Toolbar from '@/components/Toolbar.vue'
import CesiumContainer from '@/components/CesiumContainer.vue'
import Loading from '@/components/icon/Loading.vue'

const show = ref(false)

useCesium(viewer => {
  viewer.terrainProvider = createWorldTerrain()

  const tileset = createOsmBuildings()
  viewer.scene.primitives.add(tileset)

  viewer.scene.camera.setView({
    destination: Cartesian3.fromDegrees(-122.3472, 47.598, 370),
    orientation: {
      heading: CesiumMath.toRadians(10),
      pitch: CesiumMath.toRadians(-10)
    }
  })

  tileset.tileLoad.addEventListener(() => {
    show.value = true
  })

  tileset.allTilesLoaded.addEventListener(() => {
    show.value = false
  })
})
</script>

<style scoped>
.transparent {
  background: #0000;
}
</style>
