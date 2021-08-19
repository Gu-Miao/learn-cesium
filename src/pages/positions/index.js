import React, { Component } from 'react'
import Cesium, { CesiumNavigation } from '@utils/cesium'

const position = [-117, 36, 2000]
const p = Cesium.Cartesian3.fromDegrees(...position)

const max = 255

class Positions extends Component {
  state = {
    x: 0,
    y: 0,
    z: 0
  }
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
  createPointAndFlyTo = (_x, _y, _z) => {
    const x = _x ?? this.getRandomIntInclusive(-max, max)
    const y = _y ?? this.getRandomIntInclusive(-max, max)
    const z = _z ?? this.getRandomIntInclusive(-max, max)
    this.setState({ x, y, z })
    const p1 = this.getNewPosition(p, x, y, z)
    this.createPoint(p1.Cartesian3)

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
    let pitch = this.getPitchDegree(x1, y1, z1, x2, y2, z2)

    return {
      heading,
      pitch,
      roll: 0
    }
  }
  getHeadingDegree = (x1, y1, x2, y2) => {
    const dividend = x2 - x1
    const divisor = y2 - y1

    // If x2=x1, alpha could only be 0 or 180.
    if (dividend === 0) {
      return divisor >= 0 ? 0 : 180
    }

    // If y2=y1, alpha could only be 90 or -90.
    if (divisor === 0) {
      // There is no equal judgement due to it already be done above.
      return dividend > 0 ? 90 : -90
    }

    // Calculate the alpha angle.
    const tanAlpha = (x2 - x1) / (y2 - y1)
    const alpha = (Math.atan(tanAlpha) / Math.PI) * 180

    if (divisor > 0) {
      return alpha
    } else {
      // If y2-y1<0, alpha is just the supplement of real angle.
      const multiplier = x2 - x1 > 0 ? 1 : -1
      const realAlpha = (180 - Math.abs(alpha)) * multiplier
      return realAlpha
    }
  }
  getPitchDegree = (x1, y1, z1, x2, y2, z2) => {
    const xDiff = x2 - x1
    const yDiff = y2 - y1
    const zDiff = z2 - z1

    // The new position is laid on x-y surface, so there
    // is no pitch.
    if (zDiff === 0) {
      return 0
    }

    // The new position is laid on z-axis, so if z2-z1>0,
    // 90; if z2-z1<0, -90.
    if (xDiff === 0 && yDiff === 0) {
      return zDiff > 0 ? 90 : -90
    }

    const subPoint = new Cesium.Cartesian3(x2, y2, z1)
    const prevPostion = new Cesium.Cartesian3(x1, y1, z1)

    const distance = Cesium.Cartesian3.distance(subPoint, prevPostion)

    // tanθ=distance from new position to sub point / distance from
    // sub point to previous position.
    const tanTheta = (z2 - z1) / distance
    const theta = (Math.abs(Math.atan(tanTheta)) / Math.PI) * 180

    // Pitch's plus or minus is according to z2-z1, if z2-z1>0, positive
    // otherwise negative.
    return zDiff > 0 ? theta : -theta
  }

  /**
   * @param {Cesium.Cartesian3} position Where to add point.
   * @returns {Cesium.Entity}
   */
  createPoint = (position, color) =>
    this.entities.add({
      position,
      ellipsoid: {
        radii: new Cesium.Cartesian3(10.0, 10.0, 10.0),
        material:
          color ??
          Cesium.Color.fromBytes(
            Math.abs(position.x),
            Math.abs(position.y),
            Math.abs(position.z),
            255
          )
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
    const { x, y, z } = this.state
    return (
      <>
        <div className="toolbar">
          <button className="vtb" onClick={() => this.createPointAndFlyTo()}>
            Create Random Point
          </button>
          <button className="vtb" onClick={this.resetCamera}>
            Reset Camera
          </button>
          <label htmlFor="x">x</label>
          <input
            min={-max}
            max={max}
            id="x"
            type="number"
            value={x}
            onChange={e => this.setState({ x: parseFloat(e.target.value) })}
          />
          <label htmlFor="y">y</label>
          <input
            min={-max}
            max={max}
            id="y"
            type="number"
            value={y}
            onChange={e => this.setState({ y: parseFloat(e.target.value) })}
          />
          <label htmlFor="z">z</label>
          <input
            min={-max}
            max={max}
            id="z"
            type="number"
            value={z}
            onChange={e => this.setState({ z: parseFloat(e.target.value) })}
          />
          <br />
          <br />
          <button className="vtb" onClick={() => this.createPointAndFlyTo(x, y, z)}>
            Create Point
          </button>
        </div>
        <div id="stage"></div>
      </>
    )
  }
}

export default Positions
