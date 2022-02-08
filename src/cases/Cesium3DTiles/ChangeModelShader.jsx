import useCesium from '@/hooks/useCesium'
import { useState } from 'react'
import { Button } from 'rsuite'
import Toolbar from '@/cases/components/Toolbar/Toolbar'
import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'
import {
  createWorldTerrain,
  createOsmBuildings,
  Cartesian3,
  Math as CesiumMath,
  ColorBlendMode
} from 'cesium'
import colorBuildingFS from './colorBuildingFS.glsl'

let originalFS = ''
let currentFS = ''

function ChangeModelShader() {
  const [enable, setEnable] = useState(false)

  useCesium(viewer => {
    viewer.terrainProvider = createWorldTerrain()

    const tileset = createOsmBuildings()
    tileset.colorBlendMode = ColorBlendMode.REPLACE
    viewer.scene.primitives.add(tileset)

    viewer.scene.camera.setView({
      destination: Cartesian3.fromDegrees(-122.3472, 47.598, 370),
      orientation: {
        heading: CesiumMath.toRadians(10),
        pitch: CesiumMath.toRadians(-10)
      }
    })

    tileset.tileVisible.addEventListener(
      /** @param {import('cesium').Cesium3DTile} tile */
      tile => {
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
      }
    )
  })

  return (
    <CesiumContainer>
      <Toolbar>
        <Button
          appearance="primary"
          onClick={() => {
            currentFS = enable ? originalFS : colorBuildingFS
            setEnable(!enable)
          }}
        >
          Use {enable ? 'Original' : 'Custom'} Fragment Shader
        </Button>
      </Toolbar>
    </CesiumContainer>
  )
}

export default ChangeModelShader
