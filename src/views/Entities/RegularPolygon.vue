<template>
  <CesiumContainer />
</template>

<script setup lang="ts">
import { Cartesian3, PolygonHierarchy, Color } from 'cesium'
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'
import { getRegularPolygonPositions } from '@/utils'

const center = Cartesian3.fromDegrees(136.038234, 36.88456, 0)

useCesium(viewer => {
  for (let i = 3; i <= 8; i++) {
    const entity = viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(getRegularPolygonPositions(center, i * 100, i)),
        fill: false,
        outline: true,
        outlineColor: Color.RED
      }
    })
    if (i === 3) {
      viewer.zoomTo(entity)
    }
  }
})
</script>
