import { Component } from 'react'
import Cesium from '@utils/cesium'
import { PUBLIC_URL } from '@utils/path'

class Labels extends Component {
  componentDidMount() {
    const imageryProvider = Cesium.createWorldImagery()
    // imageryProvider.maximumLevel = 2

    console.log(imageryProvider)

    const viewer = new Cesium.Viewer('stage', {
      // terrainProvider: Cesium.createWorldTerrain(),
      imageryProvider
    })

    const { scene, camera } = viewer

    const center = Cesium.Cartesian3.fromDegrees(-85.0, 35.0, 1000.0)

    /** @type Cesium.GroundPrimitive */
    scene.primitives.add(
      new Cesium.GroundPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
          id: '123',
          geometry: new Cesium.RectangleGeometry({
            rectangle: getRectByCenter(-85.0, 35.0),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            ellipsoid: viewer.scene.globe.ellipsoid
          })
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: Cesium.Material.fromType('Image', {
            image: `${PUBLIC_URL}/images/number_1.png`,
            repeat: {
              x: 1.0,
              y: 1.0
            }
          })
        })
      })
    )

    flyToCenter()

    createEventHandler()

    scene.screenSpaceCameraController.maximumZoomDistance = 100
    scene.screenSpaceCameraController.maximumZoomDistance = 2000

    function flyToCenter(pitch = -40.0, distance = 10000.0) {
      const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)

      const worldToLocalMatrix = Cesium.Matrix4.inverse(localToWorldMatrix, new Cesium.Matrix4())

      const position = Cesium.Matrix4.multiplyByPoint(
        worldToLocalMatrix,
        center,
        new Cesium.Cartesian3()
      )

      const r = (-pitch * Math.PI) / 180

      position.y = position.y - Math.cos(r) * distance - distance * 0.1
      position.z = position.z + Math.sin(r) * distance

      const final = Cesium.Matrix4.multiplyByPoint(
        localToWorldMatrix,
        position,
        new Cesium.Cartesian3()
      )

      camera.flyTo({
        destination: final,
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(pitch),
          roll: Cesium.Math.toRadians(0.0)
        }
      })
    }

    function getRectByCenter(centerLon, centerLat, size = 0.05) {
      var radius = size * 0.5

      return Cesium.Rectangle.fromDegrees(
        centerLon - radius,
        centerLat - radius,
        centerLon + radius,
        centerLat + radius
      )
    }

    function createEventHandler() {
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
      handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position)
        if (!Cesium.defined(pick)) return

        if (pick.id === '123') {
          flyToCenter(-20.0)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
  render() {
    return <div id="stage"></div>
  }
}

export default Labels
