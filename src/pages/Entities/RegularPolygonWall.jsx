import { useEffect } from 'react'
import Cesium from '@utils/cesium'

/**
 * Get wall positions
 * @param {[number,number,number]} position Tuple of position [long, lat, height]
 * @param {number} radius radius
 * @param {number} sample sample number
 * @returns
 */
function getWallPositions(position, radius, sample) {
  const center = Cesium.Cartesian3.fromDegrees(...position)

  const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
  const worldToLocalMatrix = Cesium.Matrix4.inverse(localToWorldMatrix, new Cesium.Matrix4())

  const localCenter = Cesium.Matrix4.multiplyByPoint(
    worldToLocalMatrix,
    center,
    new Cesium.Cartesian3()
  )

  const split = 360 / sample
  const positions = []

  for (let i = 0; i <= sample; i++) {
    const radian = ((i * split) / 180) * Math.PI
    const pointPosition = localCenter.clone()
    pointPosition.x += Math.cos(radian) * radius
    pointPosition.y += Math.sin(radian) * radius
    positions.push(
      Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, pointPosition, new Cesium.Cartesian3())
    )
  }

  return positions
}

function RegularPolygonWall() {
  useEffect(() => {
    const viewer = new Cesium.Viewer('stage')

    viewer.entities.add({
      wall: {
        positions: getWallPositions([115.124145, 26.41574654131, 100], 30, 3),
        minimumHeights: new Array(4).fill(20),
        material: Cesium.Color.RED.withAlpha(0.8)
      }
    })
    viewer.entities.add({
      wall: {
        positions: getWallPositions([115.124145, 26.41674654131, 100], 30, 4),
        minimumHeights: new Array(5).fill(20),
        material: Cesium.Color.RED.withAlpha(0.8)
      }
    })
    viewer.entities.add({
      wall: {
        positions: getWallPositions([115.124145, 26.41774654131, 100], 30, 5),
        minimumHeights: new Array(6).fill(20),
        material: Cesium.Color.RED.withAlpha(0.8)
      }
    })
    viewer.entities.add({
      wall: {
        positions: getWallPositions([115.124145, 26.41874654131, 100], 30, 6),
        minimumHeights: new Array(7).fill(20),
        material: Cesium.Color.RED.withAlpha(0.8)
      }
    })
    viewer.entities.add({
      wall: {
        positions: getWallPositions([115.124145, 26.41974654131, 100], 30, 8),
        minimumHeights: new Array(9).fill(20),
        material: Cesium.Color.RED.withAlpha(0.8)
      }
    })
    const entity = viewer.entities.add({
      wall: {
        positions: getWallPositions([115.124145, 26.42074654131, 100], 30, 100),
        minimumHeights: new Array(101).fill(20),
        material: Cesium.Color.RED.withAlpha(0.8)
      }
    })

    viewer.zoomTo(entity)

    return () => viewer.destroy()
  }, [])

  return <div id="stage" />
}

export default RegularPolygonWall
