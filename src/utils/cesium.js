import * as Cesium from 'cesium'
import CesiumNavigation from 'cesium-navigation-es6'

function addHeight(c, h) {
  const _c = Cesium.Cartographic.fromCartesian(c)
  _c.height += h
  return Cesium.Cartographic.toCartesian(_c)
}
function setHeight(c, h) {
  const _c = Cesium.Cartographic.fromCartesian(c)
  _c.height = h
  return Cesium.Cartographic.toCartesian(_c)
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

/**
 * Get local positions.
 * @param {Cesium.Cartesian3} prev Prev Cartesian3 position.
 * @param {Cesium.Cartesian3} next Bext Cartesian3 position.
 * @returns {{prev: Cesium.Cartesian3, next: Cesium.Cartesian3, localToWorldMatrix: Cesium.Matrix4, worldToLocalMatrix: Cesium.Matrix4}} Local positions
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
    next: newPosition,
    localToWorldMatrix,
    worldToLocalMatrix
  }
}

/**
 * @param {Cesium.Cartesian3} postion1
 * @param {Cesium.Cartesian3} postion2
 * @param {number} pitch
 * @param {number} backward
 * @returns
 */
function getWiderView(postion1, postion2, pitch = -45, backward = 600) {
  const { prev, next, localToWorldMatrix } = getLocalPositions(postion1, postion2)
  const heading = getHeadingDegree(prev, next)

  if (pitch === -90) {
    const _position = prev.clone()
    _position.z += backward
    const position = Cesium.Matrix4.multiplyByPoint(
      localToWorldMatrix,
      _position,
      new Cesium.Cartesian3()
    )
    return {
      position,
      groundPosition: prev,
      heading,
      pitch,
      roll: 0
    }
  }

  const mx = heading > 0 ? -1 : 1
  const my = Math.abs(heading) < 90 ? -1 : 1
  const alpha = Math.abs(heading) <= 90 ? Math.abs(heading) : 180 - Math.abs(heading)
  const alphaRadian = Cesium.Math.toRadians(alpha)
  const theta = 90 + pitch
  const thetaRadian = Cesium.Math.toRadians(theta)

  const deltaX = backward * Math.sin(alphaRadian) * mx
  const deltaY = backward * Math.cos(alphaRadian) * my
  const deltaZ = backward / Math.tan(thetaRadian)

  const _groundPosition = prev.clone()

  _groundPosition.x += deltaX
  _groundPosition.y += deltaY

  const _position = _groundPosition.clone()

  _position.z += deltaZ

  const position = Cesium.Matrix4.multiplyByPoint(
    localToWorldMatrix,
    _position,
    new Cesium.Cartesian3()
  )
  const groundPosition = Cesium.Matrix4.multiplyByPoint(
    localToWorldMatrix,
    _groundPosition,
    new Cesium.Cartesian3()
  )

  return {
    position,
    groundPosition,
    heading,
    pitch,
    roll: 0
  }
}

export { CesiumNavigation, addHeight, setHeight, getHeadingDegree, getLocalPositions, getWiderView }
export default Cesium
