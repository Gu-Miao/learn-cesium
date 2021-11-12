import { Component } from 'react'
import Cesium, { CesiumNavigation } from '@utils/cesium'
import { Button } from 'antd'
import czml, { positions } from './ClampToGroundCZML'

class ClampTo3DTiles extends Component {
  state = {
    disabled: true
  }
  componentDidMount() {
    this.viewer = new Cesium.Viewer('stage', {
      terrainProvider: Cesium.createWorldTerrain(),
      shouldAnimate: true
    })

    CesiumNavigation(this.viewer, {})

    const { scene, camera, screenSpaceEventHandler } = this.viewer

    scene.postProcessStages.fxaa.enabled = true
    scene.debugShowFramesPerSecond = true

    const tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )

    camera.setView({
      destination: new Cesium.Cartesian3(1216403.8845586285, -4736357.493351395, 4081299.715698949),
      orientation: new Cesium.HeadingPitchRoll(
        4.2892217081808806,
        -0.4799070147502502,
        6.279789177843313
      ),
      endTransform: Cesium.Matrix4.IDENTITY
    })

    this.viewer.entities.add({
      polyline: {
        positions: positions.map(p => Cesium.Cartesian3.fromDegrees(...p)),
        classificationType: Cesium.ClassificationType.BOTH,
        width: 10,
        material: Cesium.Color.RED,
        clampToGround: true
      }
    })

    if (scene.clampToHeightSupported) {
      tileset.initialTilesLoaded.addEventListener(() => {
        this.setState({ disabled: false })
      })
    } else {
      window.alert('This browser does not support clampToHeight.')
    }

    screenSpaceEventHandler.setInputAction(movement => {
      const pick = scene.pickPosition(movement.position)
      if (!pick) return

      const c = Cesium.Cartographic.fromCartesian(pick)
      console.log(Cesium.Math.toDegrees(c.longitude))
      console.log(Cesium.Math.toDegrees(c.latitude))
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  loadCZML = async () => {
    const { scene, dataSources, clock } = this.viewer
    if (this.ds) {
      dataSources.remove(this.ds)
    }
    this.ds = await dataSources.add(Cesium.CzmlDataSource.load(czml))
    const truck = this.ds.entities.getById('CesiumMilkTruck')
    const positionProperty = truck.position

    const objectsToExclude = [truck]
    const postRender = () => {
      const position = positionProperty.getValue(clock.currentTime)
      if (!position) {
        scene.postRender.removeEventListener(postRender)
        return
      }
      truck.position = scene.clampToHeight(position, objectsToExclude)
    }
    scene.postRender.addEventListener(postRender)
  }
  render() {
    return (
      <>
        <div className="toolbar">
          <Button type="primary" onClick={this.loadCZML} disabled={this.state.disabled}>
            Load CZML
          </Button>
        </div>
        <div id="stage"></div>
      </>
    )
  }
}

export default ClampTo3DTiles
