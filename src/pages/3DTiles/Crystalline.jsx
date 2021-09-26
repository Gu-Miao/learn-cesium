/* eslint-disable no-template-curly-in-string */
import React, { Component } from 'react'
import Cesium from '@utils/cesium'
import fs from './crystallineFS'

function colorByDistanceToCoordinate(lon = -122.33317436409693, lat = 47.608251670406524) {
  return new Cesium.Cesium3DTileStyle({
    defines: {
      height: '${feature["cesium#estimatedHeight"]}',
      distance: `distance(vec2(\${feature['cesium#longitude']}, \${feature['cesium#latitude']}), vec2(${lon}, ${lat}))`
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
        ['${distance} < 0.035', 'color("#145bb5")'],
        // normal
        ['true', 'color("#1423c1")']
      ]
    }
  })
}

class Crystalline extends Component {
  async componentDidMount() {
    const viewer = new Cesium.Viewer('stage', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    viewer.scene.debugShowFramesPerSecond = true
    viewer.scene.postProcessStages.fxaa.enabled = true
    viewer.scene.globe.depthTestAgainstTerrain = true

    // Set the initial camera to look at Seattle
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-122.3472, 47.598, 370),
      orientation: {
        heading: Cesium.Math.toRadians(10),
        pitch: Cesium.Math.toRadians(-10)
      }
    })

    const set = Cesium.createOsmBuildings()

    const tileset = await set.readyPromise

    tileset.colorBlendMode = Cesium.ColorBlendMode.REPLACE

    tileset.style = colorByDistanceToCoordinate()

    viewer.scene.primitives.add(tileset)

    // Add visible calcutaion function.
    tileset.tileVisible.addEventListener(
      /** @param {Cesium.Cesium3DTile} tile */
      tile => {
        const { content } = tile
        const { _model } = content

        if (_model._fsUpdated) {
          _model._shouldRegenerateShaders = false
          return
        }

        if (_model && _model._sourcePrograms && _model._rendererResources && !_model._fsUpdated) {
          Object.keys(_model._sourcePrograms).forEach(key => {
            const program = _model._sourcePrograms[key]

            // Custom shaders.
            // console.log(_model._rendererResources.sourceShaders[program.fragmentShader])
            // _model._rendererResources.sourceShaders[program.vertexShader] = vs
            _model._rendererResources.sourceShaders[program.fragmentShader] = fs
          })

          // Recompile shader.
          _model._shouldRegenerateShaders = true

          // Add own flag.
          _model._fsUpdated = true

          // console.log(_model)
        }
      }
    )

    viewer.screenSpaceEventHandler.setInputAction(e => {
      viewer.selectedEntity = undefined
      var pickedBuilding = viewer.scene.pick(e.position)
      if (pickedBuilding) {
        var pickedLatitude = pickedBuilding.getProperty('cesium#latitude')
        var pickedLongitude = pickedBuilding.getProperty('cesium#longitude')
        console.log(pickedLatitude, pickedLongitude)
        tileset.style = colorByDistanceToCoordinate(pickedLongitude, pickedLatitude)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  render() {
    return <div id="stage"></div>
  }
}

export default Crystalline
