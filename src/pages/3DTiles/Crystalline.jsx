import React, { Component } from 'react'
import Cesium from '@utils/cesium'
import { CESIUM_3D_TILESET_PREFIX } from '@utils/path'
import fs from './crystallineFS'

class Crystalline extends Component {
  async componentDidMount() {
    const viewer = new Cesium.Viewer('stage')

    viewer.scene.debugShowFramesPerSecond = true
    viewer.scene.postProcessStages.fxaa.enabled = true

    const set = new Cesium.Cesium3DTileset({
      url: CESIUM_3D_TILESET_PREFIX + '/shanghai/tileset.json'
    })

    const tileset = await set.readyPromise

    viewer.scene.primitives.add(tileset)

    console.log('tileset: ', tileset)

    viewer.screenSpaceEventHandler.setInputAction(e => {
      const c3 = viewer.scene.pickPosition(e.position)
      if (c3) {
        const c = Cesium.Cartographic.fromCartesian(c3)
        console.log(Cesium.Math.toDegrees(c.longitude))
        console.log(Cesium.Math.toDegrees(c.latitude))
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // Set camera view.
    let radius = tileset.boundingSphere.radius
    if (tileset.boundingSphere.radius > 10000) {
      radius = tileset.boundingSphere.radius / 10
    }
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, radius))

    const h = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    viewer.screenSpaceEventHandler.setInputAction(e => {
      console.log(viewer.scene.pick(e.position))
      h(e)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // Add visible calcutaion function.
    tileset.tileVisible.addEventListener(
      /** @param {Cesium.Cesium3DTile} tile */
      tile => {
        const content = tile.content

        const { _model } = content

        if (_model && _model._sourcePrograms && _model._rendererResources) {
          Object.keys(_model._sourcePrograms).forEach(key => {
            const program = _model._sourcePrograms[key]

            // Custom fragment shader.
            _model._rendererResources.sourceShaders[program.fragmentShader] = fs
          })

          // Recompile shader.
          _model._shouldRegenerateShaders = true
        }
      }
    )
  }
  render() {
    return <div id="stage"></div>
  }
}

export default Crystalline
