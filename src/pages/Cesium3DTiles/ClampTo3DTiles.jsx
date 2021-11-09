import { Component } from 'react'
import Cesium from '@utils/cesium'
import czml from './ClampToGroundCZML'

class AjustHeight extends Component {
  async componentDidMount() {
    const viewer = new Cesium.Viewer('stage', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    const { scene, clock, dataSources } = viewer

    scene.postProcessStages.fxaa.enabled = true
    scene.debugShowFramesPerSecond = true

    const ds = await dataSources.add(Cesium.CzmlDataSource.load(czml))
    const truck = ds.entities.getById('CesiumMilkTruck')
    const positionProperty = truck.position

    const tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )

    viewer.camera.setView({
      destination: new Cesium.Cartesian3(1216403.8845586285, -4736357.493351395, 4081299.715698949),
      orientation: new Cesium.HeadingPitchRoll(
        4.2892217081808806,
        -0.4799070147502502,
        6.279789177843313
      ),
      endTransform: Cesium.Matrix4.IDENTITY
    })

    if (scene.clampToHeightSupported) {
      tileset.initialTilesLoaded.addEventListener(start)
    } else {
      window.alert('This browser does not support clampToHeight.')
    }

    function start() {
      clock.shouldAnimate = true
      const objectsToExclude = [truck]
      scene.postRender.addEventListener(function () {
        const position = positionProperty.getValue(clock.currentTime)
        truck.position = scene.clampToHeight(position, objectsToExclude)
      })
    }
  }
  render() {
    return <div id="stage"></div>
  }
}

export default AjustHeight
