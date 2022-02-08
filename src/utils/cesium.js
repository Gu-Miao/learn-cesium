import { Cartographic, Transforms, Matrix4, Cartesian3 } from 'cesium'

/**
 * Add height of a Cartesian3 instance.
 *
 * @param {Cartesian3} cartesian Cartesian3 instance.
 * @param {number} height Height to add.
 */
export function addHeight(cartesian, height) {
  const cartographic = Cartographic.fromCartesian(cartesian)
  cartographic.height += height

  return Cartographic.toCartesian(cartographic)
}

/**`
 * Set height of a Cartesian3 instance.
 *
 * @param {Cartesian3} cartesian Cartesian3 instance.
 * @param {number} height Height to set.
 */
export function setHeight(cartesian, height) {
  const cartographic = Cartographic.fromCartesian(cartesian)
  cartographic.height = height

  return Cartographic.toCartesian(cartographic)
}

/**
 * Get heading pitch and roll
 *
 * @param {Cartesian3} p1 The first position.
 * @param {Cartesian3} p2 Another position.
 */
export function getHeadingPitchRoll(p1, p2) {
  let heading = getHeadingDegree(p1, p2)
  let pitch = getPitchDegree(p1, p2)

  return {
    heading,
    pitch,
    roll: 0
  }
}

/**
 * Get heading degree.
 *
 * @param {Cartesian3} p1 The first position.
 * @param {Cartesian3} p2 Another position.
 * @returns Heading degree.
 */
export function getHeadingDegree(p1, p2) {
  const { x: x1, y: y1 } = p1
  const { x: x2, y: y2 } = p2

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
 * Get pitch degree.
 *
 * @param {Cartesian3} p1 The first position.
 * @param {Cartesian3} p2 Another position.
 * @returns Pitch degree.
 */
export function getPitchDegree(p1, p2) {
  const { x: x1, y: y1, z: z1 } = p1
  const { x: x2, y: y2, z: z2 } = p2

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

  const distance = Cartesian3.distance(p1, p2)

  // tanθ=distance from new position to sub point / distance from
  // sub point to previous position.
  const sinTheta = (z2 - z1) / distance
  const theta = (Math.abs(Math.asin(sinTheta)) / Math.PI) * 180

  // Pitch's plus or minus is according to z2-z1, if z2-z1>0, positive
  // otherwise negative.
  return zDiff > 0 ? theta : -theta
}

/**
 * Get local positions.
 *
 * @param {Cartesian3} prev Prev Cartesian3 position.
 * @param {Cartesian3} next Next Cartesian3 position.
 * @returns {{prev: Cartesian3, next: Cartesian3, localToWorldMatrix: Matrix4, worldToLocalMatrix: Matrix4}} Local positions
 */
export function getLocalPositions(prev, next) {
  const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(prev)
  const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())

  const localPosition = Matrix4.multiplyByPoint(worldToLocalMatrix, prev, new Cartesian3())
  const newPosition = Matrix4.multiplyByPoint(worldToLocalMatrix, next, new Cartesian3())

  return {
    prev: localPosition,
    next: newPosition,
    localToWorldMatrix,
    worldToLocalMatrix
  }
}

/**
 * @param {Cartesian3} postion1
 * @param {Cartesian3} postion2
 * @param {number} pitch
 * @param {number} backward
 * @returns
 */
export function getWiderView(postion1, postion2, pitch = -45, backward = 600) {
  const { prev, next, localToWorldMatrix } = getLocalPositions(postion1, postion2)
  const heading = getHeadingDegree(prev, next)

  if (pitch === -90) {
    const _position = prev.clone()
    _position.z += backward
    const position = Matrix4.multiplyByPoint(localToWorldMatrix, _position, new Cartesian3())
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
  const alphaRadian = Math.toRadians(alpha)
  const theta = 90 + pitch
  const thetaRadian = Math.toRadians(theta)

  const deltaX = backward * Math.sin(alphaRadian) * mx
  const deltaY = backward * Math.cos(alphaRadian) * my
  const deltaZ = backward / Math.tan(thetaRadian)

  const _groundPosition = prev.clone()

  _groundPosition.x += deltaX
  _groundPosition.y += deltaY

  const _position = _groundPosition.clone()

  _position.z += deltaZ

  const position = Matrix4.multiplyByPoint(localToWorldMatrix, _position, new Cartesian3())
  const groundPosition = Matrix4.multiplyByPoint(
    localToWorldMatrix,
    _groundPosition,
    new Cartesian3()
  )

  return {
    position,
    groundPosition,
    heading,
    pitch,
    roll: 0
  }
}
