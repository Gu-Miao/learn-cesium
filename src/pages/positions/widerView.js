import React, { Component } from 'react'
import Cesium, { CesiumNavigation } from '@utils/cesium'

const startDegree = [117.128202, 36.209944]
const endDegree = [117.109628, 36.257021]

const start = Cesium.Cartesian3.fromDegrees(...startDegree)
const end = Cesium.Cartesian3.fromDegrees(...endDegree)

const radii = new Cesium.Cartesian3(50, 50, 50)

class WiderView extends Component {
  async componentDidMount() {
    const viewer = new Cesium.Viewer('stage', {
      terrainProvider: Cesium.createWorldTerrain(),
      shouldAnimate: true
    })

    CesiumNavigation(viewer, {})

    const sampledData = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [
      Cesium.Cartographic.fromCartesian(start),
      Cesium.Cartographic.fromCartesian(end)
    ])

    viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(sampledData[0]),
      ellipsoid: {
        radii,
        material: Cesium.Color.fromBytes(255, 255, 255, 255)
      }
    })

    viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(sampledData[1]),
      ellipsoid: {
        radii,
        material: Cesium.Color.fromBytes(255, 255, 255, 255)
      }
    })

    viewer.scene.groundPrimitives.add(
      new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.GroundPolylineGeometry({
            positions: [start, end],
            width: 10
          })
        })
      })
    )

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(...startDegree, 2000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0)
      }
    })
  }
  render() {
    return <div id="stage"></div>
  }
}

export default WiderView
