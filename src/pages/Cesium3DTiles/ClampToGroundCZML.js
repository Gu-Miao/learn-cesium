import gltf from '@assets/CesiumMilkTruck.glb'
import Cesium from '@utils/cesium'

export const positions = [
  [-75.59685701983534, 40.03777212564437, 0],
  [-75.59751284840819, 40.037625784396035, 0],
  [-75.59752436893649, 40.03762521293061, 0],
  [-75.59753556564439, 40.0376272278541, 0],
  [-75.59755235855748, 40.03763093311733, 0],
  [-75.59756354026823, 40.03763717624739, 0],
  [-75.59757299408281, 40.03764388127161, 0],
  [-75.59758417874735, 40.037654826771465, 0],
  [-75.59759281350301, 40.03766684520388, 0],
  [-75.59767412977382, 40.03784933701905, 0]
]

const duration = 10
const modelDefaultHeading = -90
const turnDuration = 0.5
let totalDistance = 0
let time = 0
const distances = []
const orientations = []
const cartographicDegrees = []
const unitQuaternion = []

for (let i = 1; i < positions.length; ++i) {
  const prev = Cesium.Cartesian3.fromDegrees(...positions[i - 1])
  const next = Cesium.Cartesian3.fromDegrees(...positions[i])
  const distance = Cesium.Cartesian3.distance(prev, next)
  totalDistance += distance
  distances.push(distance)

  const { prev: localPrev, next: localNext } = getLocalPositions(prev, next)
  const heading = getHeadingDegree(localPrev, localNext)

  const orientation = Cesium.Transforms.headingPitchRollQuaternion(
    prev,
    new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(heading + modelDefaultHeading),
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(0)
    )
  )
  orientations.push(orientation)
}

for (let i = 0; i < positions.length; i++) {
  const { x, y, z, w } = orientations[i] || {}
  if (i === 0) {
    cartographicDegrees.push(0, ...positions[0])
    unitQuaternion.push(0, x, y, z, w)
    continue
  }
  const timeDiff = (distances[i - 1] / totalDistance) * duration
  time = time + timeDiff
  cartographicDegrees.push(time, ...positions[i])
  const { x: _x, y: _y, z: _z, w: _w } = orientations[i - 1]
  unitQuaternion.push(timeDiff >= turnDuration ? time - turnDuration : time, _x, _y, _z, _w)
  if (i === positions.length - 1) {
    unitQuaternion.push(time, _x, _y, _z, _w)
  } else {
    unitQuaternion.push(time, x, y, z, w)
  }
}

const startTime = Cesium.JulianDate.now()
const endTime = Cesium.JulianDate.addSeconds(startTime, duration, new Cesium.JulianDate())
const startTimeISO = Cesium.JulianDate.toIso8601(startTime)
const endTimeISO = Cesium.JulianDate.toIso8601(endTime)

const czml = [
  {
    id: 'document',
    version: '1.0',
    clock: {
      interval: `${startTimeISO}/${endTimeISO}`,
      currentTime: startTimeISO,
      multiplier: 1,
      range: 'UNBOUNDED'
    }
  },
  {
    id: 'CesiumMilkTruck',
    model: {
      gltf
    },
    position: {
      epoch: startTimeISO,
      cartographicDegrees
    },
    orientation: {
      epoch: startTimeISO,
      unitQuaternion
    }
  }
]

/**
 * Get local positions.
 * @param {Cesium.Cartesian3} prev Prev Cartesian3 position.
 * @param {Cesium.Cartesian3} next Bext Cartesian3 position.
 * @returns {{prev: Cesium.Cartesian3, next: Cesium.Cartesian3}} Local positions
 */
function getLocalPositions(prev, next) {
  const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(prev)
  const worldToLocalMatrix = Cesium.Matrix4.inverse(localToWorldMatrix, new Cesium.Matrix4())

  const localPosition = Cesium.Matrix4.multiplyByPoint(
    worldToLocalMatrix,
    prev,
    new Cesium.Cartesian3()
  )
  const newPosition = Cesium.Matrix4.multiplyByPoint(
    worldToLocalMatrix,
    next,
    new Cesium.Cartesian3()
  )

  return {
    prev: localPosition,
    next: newPosition
  }
}

/**
 * Get heading degree
 * @param {Cesium.Cartesian3} prev Prev Cartesian3 position.
 * @param {Cesium.Cartesian3} next Bext Cartesian3 position.
 * @returns {number} Heading degree
 */
function getHeadingDegree(prev, next) {
  const { x: x1, y: y1 } = prev
  const { x: x2, y: y2 } = next

  const dividend = x2 - x1
  const divisor = y2 - y1

  // If x2=x1, α could only be 0 or 180.
  if (dividend === 0) {
    return divisor >= 0 ? 0 : 180
  }

  // If y2=y1, α could only be 90 or -90.
  if (divisor === 0) {
    // There is no equal judgement due to it already be done above.
    return dividend > 0 ? 90 : -90
  }

  // Calculate the α angle.
  const tanα = (x2 - x1) / (y2 - y1)
  const α = (Math.atan(tanα) / Math.PI) * 180

  if (divisor > 0) {
    return α
  } else {
    // If y2-y1<0, α is just the supplement of real angle.
    const multiplier = x2 - x1 > 0 ? 1 : -1
    const realα = (180 - Math.abs(α)) * multiplier
    return realα
  }
}

console.log(czml)

export const lastPosition = positions[positions.length - 1]

export const lastOrientation = orientations[orientations.length - 1]

export default czml
