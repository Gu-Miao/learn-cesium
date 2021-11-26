import React, { Component } from 'react'
import Cesium, { CesiumNavigation, getWiderView } from '@utils/cesium'

const startDegree = [117.128202, 36.209944]
const endDegree = [117.109628, 36.257021]

const start = Cesium.Cartesian3.fromDegrees(...startDegree)
const end = Cesium.Cartesian3.fromDegrees(...endDegree)

const radii = new Cesium.Cartesian3(50, 50, 50)

class WiderView extends Component {
  state = {
    pitch: -45,
    backward: 500
  }
  async componentDidMount() {
    const viewer = new Cesium.Viewer('stage')
    this.viewer = viewer

    CesiumNavigation(viewer, {})

    // Add two ellipsoids
    viewer.entities.add({
      position: start,
      ellipsoid: {
        radii,
        material: Cesium.Color.fromBytes(255, 255, 255, 255)
      }
    })
    viewer.entities.add({
      position: end,
      ellipsoid: {
        radii,
        material: Cesium.Color.fromBytes(255, 255, 255, 255)
      }
    })

    // Add red ground line
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

    this.getWiderView()
  }
  componentDidUpdate() {
    this.getWiderView()
  }
  clear = () => {
    const { viewer } = this
    if (this.extendedLine) {
      viewer.scene.groundPrimitives.remove(this.extendedLine)
      viewer.entities.remove(this.groudPoint)
      viewer.entities.remove(this.point)
    }
  }
  getWiderView = () => {
    this.clear()

    const { viewer } = this
    const { pitch, backward } = this.state
    const data = getWiderView(start, end, pitch, backward)

    if (data.pitch !== -90) {
      this.extendedLine = viewer.scene.groundPrimitives.add(
        new Cesium.GroundPolylinePrimitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.GroundPolylineGeometry({
              positions: [start, data.groundPosition],
              width: 10
            })
          })
        })
      )
      this.groudPoint = viewer.entities.add({
        position: data.groundPosition,
        ellipsoid: {
          radii,
          material: Cesium.Color.fromBytes(255, 255, 255, 255)
        }
      })
    }

    this.point = viewer.entities.add({
      position: data.position,
      ellipsoid: {
        radii,
        material: Cesium.Color.fromBytes(255, 255, 255, 255)
      }
    })

    viewer.camera.setView({
      destination: data.position,
      orientation: {
        heading: Cesium.Math.toRadians(data.heading),
        pitch: Cesium.Math.toRadians(data.pitch),
        roll: Cesium.Math.toRadians(data.roll)
      }
    })
  }
  render() {
    const { pitch, backward } = this.state
    return (
      <>
        <div className="toolbar">
          Pitch:{' '}
          <input
            type="number"
            value={pitch}
            onChange={e => this.setState({ pitch: parseFloat(e.target.value) })}
            step={1}
            min={-90}
            max={0}
          />
          <br />
          Backward:{' '}
          <input
            type="number"
            value={backward}
            onChange={e => this.setState({ backward: parseFloat(e.target.value) })}
            step={100}
            min={10}
            max={10000}
          />
          <br />
          <button
            onClick={() => {
              this.setState({
                pitch: Math.random() * -90,
                backward: Math.random() * 10000
              })
            }}
          >
            Random
          </button>
        </div>

        <div id="stage"></div>
      </>
    )
  }
}

export default WiderView
