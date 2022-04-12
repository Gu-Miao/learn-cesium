import { Cartographic, Cartesian3, Transforms, Matrix4, Math as CesiumMath } from 'cesium'

/**
 * Add height of a Cartesian3 instance.
 * @param cartesian Cartesian3 instance.
 * @param height Height to add.
 */
export function addHeight(cartesian: Cartesian3, height: number) {
  const cartographic = Cartographic.fromCartesian(cartesian)
  cartographic.height += height

  return Cartographic.toCartesian(cartographic)
}

/**
 * Set height of a Cartesian3 instance.
 * @param cartesian Cartesian3 instance.
 * @param height Height to set.
 */
export function setHeight(cartesian: Cartesian3, height: number) {
  const cartographic = Cartographic.fromCartesian(cartesian)
  cartographic.height = height

  return Cartographic.toCartesian(cartographic)
}

/**
 * Get heading pitch and roll.
 * @param p1 The first position.
 * @param p2 Another position.
 */
export function getHeadingPitchRoll(p1: Cartesian3, p2: Cartesian3) {
  const heading = getHeadingDegree(p1, p2)
  const pitch = getPitchDegree(p1, p2)

  return {
    heading,
    pitch,
    roll: 0
  }
}

/**
 * Get heading degree.
 * @param p1 The first position.
 * @param p2 Another position.
 * @returns Heading degree.
 */
export function getHeadingDegree(p1: Cartesian3, p2: Cartesian3) {
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
 * @param p1 The first position.
 * @param p2 Another position.
 * @returns Pitch degree.
 */
export function getPitchDegree(p1: Cartesian3, p2: Cartesian3) {
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
 * Get regular polygon positions.
 * @param center Position of center.
 * @param radius Radius of polygon.
 * @param sides Number of sides.
 * @returns
 */
export function getRegularPolygonPositions(center: Cartesian3, radius: number, sides: number) {
  const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(center)
  const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())

  const localCenter = Matrix4.multiplyByPoint(worldToLocalMatrix, center, new Cartesian3())

  const split = 360 / sides
  const positions = []

  for (let i = 0; i <= sides; i++) {
    const radian = CesiumMath.toRadians(split * i)
    const pointPosition = localCenter.clone()
    pointPosition.x += Math.cos(radian) * radius
    pointPosition.y += Math.sin(radian) * radius
    positions.push(Matrix4.multiplyByPoint(localToWorldMatrix, pointPosition, new Cartesian3()))
  }

  return positions
}

/**
 * 计算 viewFrom
 * @param p1 本地坐标系坐标1
 * @param p2 本地坐标系坐标2
 * @param heading 偏转角
 * @param pitch 俯仰角
 * @param backward 后退距离
 * @returns viewFrom
 */
export function getViewFrom(
  p1: Cartesian3,
  p2: Cartesian3,
  heading = getHeadingDegree(p1, p2),
  pitch = -45,
  backward = 1000
): [number, number, number] {
  if (pitch === -90) {
    return [0, 0, backward]
  }

  const mx = heading > 0 ? -1 : 1
  const my = Math.abs(heading) < 90 ? -1 : 1
  const alpha = Math.abs(heading) <= 90 ? Math.abs(heading) : 180 - Math.abs(heading)
  const alphaRadian = CesiumMath.toRadians(alpha)
  const theta = 90 + pitch
  const thetaRadian = CesiumMath.toRadians(theta)

  const deltaX = backward * Math.sin(alphaRadian) * mx
  const deltaY = backward * Math.cos(alphaRadian) * my
  const deltaZ = backward / Math.tan(thetaRadian)

  return [deltaX, deltaY, deltaZ]
}
