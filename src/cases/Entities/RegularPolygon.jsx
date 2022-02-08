import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'
import {
  Cartesian3,
  Transforms,
  Matrix4,
  Math as CesiumMath,
  PolygonHierarchy,
  Color
} from 'cesium'

/**
 * Get regular polygon positions.
 *
 * @param {Cartesian3} center Position of center.
 * @param {number} radius Radius of polygon.
 * @param {number} sides Number of sides.
 * @returns
 */
function getRegularPolygonPositions(center, radius, sides) {
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

const center = Cartesian3.fromDegrees(136.038234, 36.88456, 0)

function RegularPolygonEntity() {
  useCesium(viewer => {
    for (let i = 3; i <= 8; i++) {
      const entity = viewer.entities.add({
        polygon: {
          hierarchy: new PolygonHierarchy(getRegularPolygonPositions(center, i * 100, i)),
          fill: false,
          outline: true,
          outlineColor: Color.RED
        }
      })
      if (i === 3) {
        viewer.zoomTo(entity)
      }
    }
  })

  return <CesiumContainer />
}

export default RegularPolygonEntity
