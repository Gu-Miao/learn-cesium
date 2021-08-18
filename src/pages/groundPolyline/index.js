import React, { Component } from 'react'
import Cesium from '@utils/cesium'

const startPosition = [-85.0, 36.0]
const endPosition = [-84.9, 36.1]

const start = Cesium.Cartesian3.fromDegrees(...startPosition)
const end = Cesium.Cartesian3.fromDegrees(...endPosition)

const count = 30
const positions = []

class GroundPolyline extends Component {
  async componentDidMount() {
    const terrainProvider = Cesium.createWorldTerrain()

    this.viewer = new Cesium.Viewer('stage', {
      terrainProvider
    })

    this.scene = this.viewer.scene
    this.camera = this.scene.camera

    this.scene.groundPrimitives.add(
      new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.GroundPolylineGeometry({
            positions: [start, end],
            width: 4.0
          })
        })
      })
    )

    for (let i = 0; i < count; ++i) {
      const offset = i / (count - 1)
      positions.push(
        Cesium.Cartographic.fromCartesian(
          Cesium.Cartesian3.lerp(start, end, offset, new Cesium.Cartesian3())
        )
      )
    }

    this.camera.flyTo({
      destination: new Cesium.Cartesian3.fromDegrees(...endPosition),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: Cesium.Math.toRadians(0.0)
      }
    })

    try {
      const res = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions)
      console.log(res)
      res.forEach(position => {
        this.viewer.entities.add({
          position: Cesium.Cartographic.toCartesian(position),
          ellipsoid: {
            radii: new Cesium.Cartesian3(30.0, 30.0, 30.0),
            material: Cesium.Color.WHITE
          }
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
  render() {
    return <div id="stage"></div>
  }
}

export default GroundPolyline
