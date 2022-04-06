<template>
  <CesiumContainer>
    <Toolbar>
      <NButton type="primary" @click="oribtFly" :disabled="flying">
        {{ flying ? 'Flying' : 'Orbit Fly' }}
      </NButton>
    </Toolbar>
  </CesiumContainer>
</template>

<script setup lang="ts">
import CesiumContainer from '@/components/CesiumContainer.vue'
import Toolbar from '@/components/Toolbar.vue'
import useCesium from '@/hooks/useCesium'
import { Cartesian3, JulianDate, Math as CesiumMath } from 'cesium'
import { NButton } from 'naive-ui'
import { ref } from 'vue'
import type { LongLatHeight } from '@/common/types'
import type { Clock } from 'cesium'

const startDegrees: LongLatHeight = [-85.0, 36.0, 1000.0]
const startPosition = Cartesian3.fromDegrees(...startDegrees)

const viewerRef = useCesium()
const flying = ref(false)

function oribtFly() {
  const viewer = viewerRef.current
  if (!viewer) return

  const { clock, camera } = viewer

  const duration = 10
  const pitch = CesiumMath.toRadians(-30)
  const anglePerSecond = 360 / duration
  const distance = 15000
  const startTime = JulianDate.now()
  const stopTime = JulianDate.addSeconds(startTime, duration, new JulianDate())

  const initialHeading = viewer.camera.heading
  function listener(clock: Clock) {
    const deltaTime = JulianDate.secondsDifference(clock.currentTime, startTime)
    const heading = CesiumMath.toRadians(deltaTime * anglePerSecond) + initialHeading
    camera.setView({
      destination: startPosition,
      orientation: { heading, pitch }
    })
    camera.moveBackward(distance)
    if (JulianDate.compare(clock.currentTime, stopTime) >= 0) {
      clock.onTick.removeEventListener(listener)
      flying.value = false
    }
  }
  flying.value = true
  clock.shouldAnimate = true
  clock.onTick.addEventListener(listener)
}
</script>
