import { Component } from 'react'
import Cesium from '@utils/cesium'
import Heatmap from '@utils/Heatmap'
import { CESIUM_3D_TILESET_PREFIX } from '@utils/path'

class HeatMapBuildings extends Component {
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

    window.v = viewer

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

    let bounds = {
      west: 121.2,
      east: 121.6,
      south: 30.2,
      north: 31.26
    }

    // init heatmap
    let heatMap = Heatmap.create(
      viewer, // your cesium viewer
      bounds, // bounds for heatmap layer
      {
        // heatmap.js options go here
        // maxOpacity: 0.3
        radius: 40
      }
    )

    // random example data
    let data = [{ x: 121.49532705453251, y: 31.240605851735456, value: 99 }]
    let valueMin = 0
    let valueMax = 100

    // add data to heatmap
    heatMap.setWGS84Data(valueMin, valueMax, data)
  }
  render() {
    return <div id="stage"></div>
  }
}

export default HeatMapBuildings
