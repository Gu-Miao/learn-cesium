<template>
  <CesiumContainer>
    <Toolbar>
      <NButton type="primary" @click="triggerEnable">
        Use {{ enable ? 'Original' : 'Custom' }} Fragment Shader
      </NButton>
    </Toolbar>
  </CesiumContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  createWorldTerrain,
  createOsmBuildings,
  Cartesian3,
  Math as CesiumMath,
  Cesium3DTileColorBlendMode
} from 'cesium'
import { NButton } from 'naive-ui'
import useCesium from '@/hooks/useCesium'
import Toolbar from '@/components/Toolbar.vue'
import CesiumContainer from '@/components/CesiumContainer.vue'
import colorBuildingFS from '@/assets/shaders/colorBuildingFS.glsl?raw'

let originalFS = ''
let currentFS = ''

const enable = ref(false)

function triggerEnable() {
  enable.value = !enable.value
  currentFS = enable.value ? colorBuildingFS : originalFS
}

useCesium(viewer => {
  viewer.terrainProvider = createWorldTerrain()

  const tileset = createOsmBuildings()
  tileset.colorBlendMode = Cesium3DTileColorBlendMode.REPLACE
  viewer.scene.primitives.add(tileset)

  viewer.scene.camera.setView({
    destination: Cartesian3.fromDegrees(-122.3472, 47.598, 370),
    orientation: {
      heading: CesiumMath.toRadians(10),
      pitch: CesiumMath.toRadians(-10)
    }
  })

  tileset.tileVisible.addEventListener(tile => {
    const { content } = tile
    const { _model } = content

    if (_model && _model._sourcePrograms && _model._rendererResources) {
      Object.keys(_model._sourcePrograms).forEach(key => {
        const program = _model._sourcePrograms[key]

        if (!originalFS) {
          originalFS = _model._rendererResources.sourceShaders[program.fragmentShader]
          currentFS = originalFS
        }

        // Custom shaders.
        _model._rendererResources.sourceShaders[program.fragmentShader] = currentFS
      })

      // Recompile shader.
      _model._shouldRegenerateShaders = true
    }
  })
})
</script>
