<template>
  <CesiumContainer />
</template>

<script setup lang="ts">
import {
  Cartesian3,
  Color,
  createWorldTerrain,
  ClippingPlane,
  ClippingPlaneCollection
} from 'cesium'
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'

const positions = [
  new Cartesian3(-2312118.759715161, -3083965.2032759394, 5047550.829375319),
  new Cartesian3(-2313671.923833837, -3084677.648065952, 5046397.601617599),
  new Cartesian3(-2318828.039357948, -3089168.600406022, 5041260.387195298),
  new Cartesian3(-2320946.6885084896, -3091127.6247283346, 5039079.49536364),
  new Cartesian3(-2319020.719750485, -3095388.696551315, 5037341.884986691),
  new Cartesian3(-2314989.0775538436, -3095943.5116008213, 5038855.013325326),
  new Cartesian3(-2312024.7303106408, -3092827.36290459, 5042137.443312626),
  new Cartesian3(-2309784.1525668195, -3090056.4455184382, 5044874.330562411)
]

useCesium(viewer => {
  viewer.terrainProvider = createWorldTerrain()

  viewer.camera.setView({
    destination: new Cartesian3(-2339365.0927023664, -3126767.2947265133, 5055140.23289624),
    orientation: {
      up: new Cartesian3(-0.03180037910994021, 0.07265555304143229, 0.9968499919750754),
      direction: new Cartesian3(0.5301459730912256, 0.8467219659699952, -0.044801334344682586)
    }
  })

  viewer.scene.globe.clippingPlanes = createClippingPlanes(positions)
})

function createClippingPlanes(positions: Cartesian3[]) {
  const { length } = positions
  const planes = positions.map((p1, index) => {
    const nextIndex = (index + 1) % length
    const p2 = positions[nextIndex]
    const normal = Cartesian3.normalize(
      Cartesian3.cross(p1, reverse(p2), new Cartesian3()),
      new Cartesian3()
    )
    return new ClippingPlane(normal, 0)
  })

  return new ClippingPlaneCollection({
    planes,
    edgeWidth: 20,
    edgeColor: Color.YELLOW
  })
}

/**
 * Reverse items of a Cartesian3
 * @param cartesian Cartesian3 vector
 */
function reverse(cartesian: Cartesian3) {
  const result = cartesian.clone()
  result.x = -result.x
  result.y = -result.y
  result.z = -result.z
  return result
}
</script>
