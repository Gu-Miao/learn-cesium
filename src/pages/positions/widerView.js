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

    const data = getWiderView(start, end)

    viewer.scene.groundPrimitives.add(
      new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.GroundPolylineGeometry({
            positions: [start, data.groundPosition],
            width: 10
          })
        })
      })
    )

    viewer.entities.add({
      position: data.groundPosition,
      ellipsoid: {
        radii,
        material: Cesium.Color.fromBytes(255, 255, 255, 255)
      }
    })

    viewer.entities.add({
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
    return <div id="stage"></div>
  }
}

/**
 * @param {Cesium.Cartesian3} p1
 * @param  {...Cesium.Cartesian3} rest
 * @returns
 */
function getLocalPositions(p1, ...rest) {
  const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(p1)
  const worldToLocalMatrix = Cesium.Matrix4.inverse(localToWorldMatrix, new Cesium.Matrix4())

  const _p1 = Cesium.Matrix4.multiplyByPoint(worldToLocalMatrix, p1, new Cesium.Cartesian3())

  const _rest = rest.map(p =>
    Cesium.Matrix4.multiplyByPoint(worldToLocalMatrix, p, new Cesium.Cartesian3())
  )

  return {
    positions: [_p1, ..._rest],
    localToWorldMatrix,
    worldToLocalMatrix
  }
}

function getHeadingDegree(x1, y1, x2, y2) {
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

/**
 * @param {Cesium.Cartesian3} prev
 * @param {Cesium.Cartesian3} next
 * @param {number} pitch
 * @param {number} backward
 * @returns
 */
function getWiderView(prev, next, pitch = -45, backward = 1000) {
  const { positions, localToWorldMatrix } = getLocalPositions(prev, next)
  const [p1, p2] = positions
  const heading = getHeadingDegree(p1.x, p1.y, p2.x, p2.y)

  const xDiff = p2.x - p1.x
  const yDiff = p2.y - p1.y

  const x = backward * Math.abs(Math.sin((heading / 180) * Math.PI)) * (xDiff > 0 ? -1 : 1)
  const y = backward * Math.abs(Math.cos((heading / 180) * Math.PI)) * (yDiff > 0 ? -1 : 1)
  const z = backward / Math.abs(Math.tan((pitch / 180) * Math.PI))

  p1.x += x
  p1.y += y

  const gp1 = p1.clone()

  p1.z += z

  const _p1 = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, p1, new Cesium.Cartesian3())
  const _gp1 = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, gp1, new Cesium.Cartesian3())

  return {
    position: _p1,
    groundPosition: _gp1,
    heading,
    pitch,
    roll: 0
  }
}

export default WiderView
