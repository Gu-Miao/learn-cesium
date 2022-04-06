/* eslint-disable no-template-curly-in-string */
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'
import Toolbar from '@/cases/components/Toolbar/Toolbar'
import {
  createWorldTerrain,
  createOsmBuildings,
  ColorBlendMode,
  Cesium3DTileStyle,
  Cartesian3,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType
} from 'cesium'
import colorBuildingFS from './colorBuildingFS.glsl'

const HeatZone = () => {
  useCesium(async viewer => {
    viewer.terrainProvider = createWorldTerrain()

    const tileset = createOsmBuildings()

    viewer.scene.primitives.add(tileset)
    tileset.colorBlendMode = ColorBlendMode.REPLACE
    tileset.style = colorByDistanceToCoordinate()

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

            // Custom shaders.
            _model._rendererResources.sourceShaders[program.fragmentShader] = colorBuildingFS
          })

          // Recompile shader.
          _model._shouldRegenerateShaders = true
        }
      }
    )

    const handler = new ScreenSpaceEventHandler(viewer.canvas)
    handler.setInputAction(movement => {
      viewer.selectedEntity = undefined
      var pickedBuilding = viewer.scene.pick(movement.position)
      if (pickedBuilding) {
        var pickedLatitude = pickedBuilding.getProperty('cesium#latitude')
        var pickedLongitude = pickedBuilding.getProperty('cesium#longitude')
        console.log(pickedLatitude, pickedLongitude)
        tileset.style = colorByDistanceToCoordinate(pickedLongitude, pickedLatitude)
      }
    }, ScreenSpaceEventType.LEFT_CLICK)
  })

  return (
    <CesiumContainer>
      <Toolbar>Click a building to set it as center of heat zone.</Toolbar>
    </CesiumContainer>
  )
}

function colorByDistanceToCoordinate(
  longitude = -122.33317436409693,
  latitude = 47.608251670406524
) {
  return new Cesium3DTileStyle({
    defines: {
      height: '${feature["cesium#estimatedHeight"]}',
      distance: `distance(vec2(\${feature['cesium#longitude']}, \${feature['cesium#latitude']}), vec2(${longitude}, ${latitude}))`
    },
    color: {
      conditions: [
        // red
        ['${distance} < 0.001', 'color("#fd3215")'],
        ['${distance} < 0.002', 'color("#d95612")'],
        ['${distance} < 0.003', 'color("#b25632")'],
        // yellow
        ['${distance} < 0.005', 'color("#a67325")'],
        ['${distance} < 0.008', 'color("#969325")'],
        ['${distance} < 0.01', 'color("#76b205")'],
        // green
        ['${distance} < 0.01', 'color("#56c205")'],
        ['${distance} < 0.015', 'color("#31d315")'],
        ['${distance} < 0.02', 'color("#16ec37")'],
        // blue
        ['${distance} < 0.02', 'color("#16cc77")'],
        ['${distance} < 0.0275', 'color("#159c92")'],
        ['${distance} < 0.035', 'color("#145bb5")']
      ]
    }
  })
}

export default HeatZone
