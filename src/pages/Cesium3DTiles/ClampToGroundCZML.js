import gltf from '@assets/CesiumMilkTruck.glb'
import Cesium from '@utils/cesium'
import dayjs from 'dayjs'

const positions = [
  [-75.59682640355302, 40.0377282591004, 30],
  [-75.59721134830173, 40.037671211919225, 30],
  [-75.59747878476885, 40.037898069427314, 30],
  [-75.59700518759936, 40.03799476320532, 30]
]

const duration = 1 * 60
const modelDefaultHeading = -90
const turnDuration = 2
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
  time = time + (distances[i - 1] / totalDistance) * duration
  cartographicDegrees.push(time, ...positions[i])
  if (i === positions.length - 1) break
  const { x: _x, y: _y, z: _z, w: _w } = orientations[i - 1]

  unitQuaternion.push(time - turnDuration, _x, _y, _z, _w)
  unitQuaternion.push(time, x, y, z, w)
}

const startTime = dayjs()
const endTime = startTime.add(duration, 's')
const startTimeISO = startTime.toISOString()
const endTimeISO = endTime.toISOString()

const czml = [
  {
    id: 'document',
    version: '1.0',
    clock: {
      interval: `${startTimeISO}/${endTimeISO}`,
      currentTime: startTimeISO,
      multiplier: 3,
      range: 'UNBOUNDED'
    }
  },
  {
    id: 'CesiumMilkTruck',
    availability: `${startTimeISO}/${endTimeISO}`,
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
 * @param {Cesium.Cartesian3} prev Prev Cartesian3 position.
 * @param {Cesium.Cartesian3} next Bext Cartesian3 position.
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

export default czml
