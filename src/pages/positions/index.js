import React, { Component } from 'react'
import Cesium, { CesiumNavigation } from '@utils/cesium'

const position = [-117, 36, 2000]
const p = Cesium.Cartesian3.fromDegrees(...position)

class Positions extends Component {
  componentDidMount() {
    this.viewer = new Cesium.Viewer('stage', {
      shadows: true,
      shouldAnimate: true
    })
    this.scene = this.viewer.scene
    this.entities = this.viewer.entities

    this.scene.debugShowFramesPerSecond = true
    this.scene.globe.depthTestAgainstTerrain = true
    CesiumNavigation(this.viewer, {})

    this.createPoint(p, Cesium.Color.WHITE)
  }
  resetCamera = () => {
    this.viewer.camera.flyTo({
      destination: p,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(0),
        roll: Cesium.Math.toRadians(0)
      }
    })
  }
  getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  createRandomPointAndFlyTo = () => {
    // this.entities.removeAll()
    const r = 300
    const x = 0
    const y = this.getRandomIntInclusive(-r, r)
    const z = this.getRandomIntInclusive(-r, r)
    const p1 = this.getNewPosition(p, x, y, z)
    this.createPoint(p1.Cartesian3, Cesium.Color.BLUE)

    const { prev, next } = p1

    const headingPitchRoll = this.getHeadingPitchRoll(prev, next)

    console.log({ x, y, z }, headingPitchRoll)

    this.viewer.camera.flyTo({
      destination: p,
      orientation: {
        heading: Cesium.Math.toRadians(headingPitchRoll.heading),
        pitch: Cesium.Math.toRadians(headingPitchRoll.pitch),
        roll: Cesium.Math.toRadians(headingPitchRoll.roll)
      }
    })
  }
  /**
   *
   * @param {Cesium.Cartesian3} p1
   * @param {Cesium.Cartesian3} p2
   */
  getHeadingPitchRoll = (p1, p2) => {
    const { x: x1, y: y1, z: z1 } = p1
    const { x: x2, y: y2, z: z2 } = p2

    let heading = this.getHeadingDegree(x1, y1, x2, y2)
    let pitch = this.getPitchDegree(y1, z1, y2, z2)

    const rest = pitch % 360
    const isPositive = rest > 0
    const abs = Math.abs(rest)

    console.log('p', pitch)

    if (abs > 90) {
      pitch = (180 - abs) * (isPositive ? 1 : -1)
    }

    return {
      heading,
      pitch,
      roll: 0
    }
  }
  getHeadingDegree = (x1, y1, x2, y2) => {
    const dividend = x2 - x1
    const divisor = y2 - y1

    if (dividend === 0 && divisor === 0) return 0
    if (dividend === 0) {
      return y2 > y1 ? 0 : 180
    } else if (divisor === 0) {
      return x2 > x1 ? 90 : 270
    } else {
      let degree = (Math.atan(dividend / divisor) / Math.PI) * 180
      if (divisor < 0) {
        degree += dividend < 0 ? -180 : 180
      }

      return degree
    }
  }
  getPitchDegree = (y1, z1, y2, z2) => {
    const dividend = z2 - z1
    const divisor = y2 - y1

    if (dividend === 0 && divisor === 0) return 0
    if (dividend === 0) {
      return y2 > y1 ? 0 : 180
    } else if (divisor === 0) {
      return z2 > z1 ? 90 : 270
    } else {
      let degree = (Math.atan(dividend / divisor) / Math.PI) * 180
      if (divisor < 0) {
        degree += dividend < 0 ? -180 : 180
      }

      return degree
    }
  }

  /**
   * @param {Cesium.Cartesian3} position Where to add point.
   * @returns {Cesium.Entity}
   */
  createPoint = (position, color = Cesium.Color.RED) =>
    this.entities.add({
      position,
      ellipsoid: {
        radii: new Cesium.Cartesian3(10.0, 10.0, 10.0),
        material: color
      }
    })

  /**
   * @param {number[]} prev Prev position lon lat height array.
   */
  getNewPosition = (prev, x = 300.0, y = 0.0, h = 0.0) => {
    const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(prev)
    const worldToLocalMatrix = Cesium.Matrix4.inverse(localToWorldMatrix, new Cesium.Matrix4())

    const localPosition = Cesium.Matrix4.multiplyByPoint(
      worldToLocalMatrix,
      prev,
      new Cesium.Cartesian3()
    )

    const newPosition = Cesium.clone(localPosition, true)

    newPosition.x += x
    newPosition.y += y
    newPosition.z += h

    return {
      Cartesian3: Cesium.Matrix4.multiplyByPoint(
        localToWorldMatrix,
        newPosition,
        new Cesium.Cartesian3()
      ),
      prev: localPosition,
      next: newPosition
    }
  }
  render() {
    return (
      <>
        <div className="toolbar">
          <button className="vtb" onClick={this.createRandomPointAndFlyTo}>
            Create Random Point
          </button>
          <button className="vtb" onClick={this.resetCamera}>
            Reset Camera
          </button>
        </div>
        <div id="stage"></div>
      </>
    )
  }
}

export default Positions
