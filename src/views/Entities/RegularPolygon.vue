<template>
  <CesiumContainer />
</template>

<script setup lang="ts">
import {
  Cartesian3,
  Transforms,
  Matrix4,
  Math as CesiumMath,
  PolygonHierarchy,
  Color
} from 'cesium'
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'

/**
 * Get regular polygon positions.
 * @param center Position of center.
 * @param radius Radius of polygon.
 * @param sides Number of sides.
 * @returns
 */
function getRegularPolygonPositions(center: Cartesian3, radius: number, sides: number) {
  const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(center)
  const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())

  const localCenter = Matrix4.multiplyByPoint(worldToLocalMatrix, center, new Cartesian3())

  const split = 360 / sides
  const positions = []

  for (let i = 0; i <= sides; i++) {
    const radian = CesiumMath.toRadians(split * i)
    const pointPosition = localCenter.clone()
    pointPosition.x += Math.cos(radian) * radius
    pointPosition.y += Math.sin(radian) * radius
    positions.push(Matrix4.multiplyByPoint(localToWorldMatrix, pointPosition, new Cartesian3()))
  }

  return positions
}

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
