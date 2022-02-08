import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'
import Toolbar from '@/cases/components/Toolbar/Toolbar'
import useCesium from '@/hooks/useCesium'
import { Cartesian3, JulianDate, CzmlDataSource, Transforms, Matrix4 } from 'cesium'
import { Button } from 'rsuite'
import { getHeadingDegree } from '@/utils/cesium'

const duration = 30
const startDegrees = [115.32415, 36.157965, 88.5]
const endDegrees = [115.452157, 36.0943875, 76.33]
const startPosition = Cartesian3.fromDegrees(...startDegrees)
const endPosition = Cartesian3.fromDegrees(...endDegrees)

const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(startPosition)
const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())
const startLocalPosition = Matrix4.multiplyByPoint(
  worldToLocalMatrix,
  startPosition,
  new Cartesian3()
)
const endLocalPosition = Matrix4.multiplyByPoint(worldToLocalMatrix, endPosition, new Cartesian3())
const heading = getHeadingDegree(startLocalPosition, endLocalPosition)

/**
 * Calculate viewFrom of czml.
 *
 * @param {Number} pitch Pitch of view.
 * @param {Number} backwardDistance Backwward sitance.
 */
export function getViewFrom(pitch = -45, backwardDistance = 1000) {
  if (pitch === -90) {
    return [0, 0, backwardDistance]
  }
  console.log(heading)
}

function BroaderVision() {
  const viewerRef = useCesium(viewer => {
    viewer.clock.shouldAnimate = true
  })

  /**
   * Load CZML data. If withViewFrom is true, then we should see
   * it from start position to end position with specific pitch and
   * backward distance.
   *
   * @param {Boolean} withViewFrom Should use viewFrom property.
   */
  async function loadCZML(withViewFrom = false) {
    const viewer = viewerRef.current
    if (!viewer) return

    const { currentTime } = viewer.clock
    const startISO = JulianDate.toIso8601(currentTime)
    const endTime = JulianDate.addSeconds(currentTime, duration, new JulianDate())
    const endISO = JulianDate.toIso8601(endTime)

    const czml = [
      {
        id: 'document',
        name: 'CZML Path',
        version: '1.0',
        clock: {
          interval: `${startISO}/${endISO}`,
          currentTime: startISO,
          multiplier: 3
        }
      },
      {
        id: 'path',
        name: 'A czml path',
        availability: `${startISO}/${endISO}`,
        path: {
          material: {
            solidColor: {
              color: {
                rgba: [255, 0, 0, 255]
              }
            }
          },
          width: 8,
          leadTime: 10,
          trailTime: 1000,
          resolution: 5
        },
        point: {
          color: {
            rgba: [255, 255, 255, 255]
          },
          pixelSize: 20
        },
        position: {
          epoch: startISO,
          cartographicDegrees: [0, ...startDegrees, duration, ...endDegrees]
        }
      }
    ]

    viewer.dataSources.removeAll()

    const dataSource = await CzmlDataSource.load(czml)
    viewer.dataSources.add(dataSource)
    const path = dataSource.entities.getById('path')
    viewer.trackedEntity = path
  }

  return (
    <CesiumContainer>
      <Toolbar>
        <Button appearance="primary" onClick={loadCZML} size="sm">
          Load CZML
        </Button>
        &nbsp;&nbsp;
        <Button onClick={() => loadCZML(true)} size="sm">
          Load CZML With ViewFrom
        </Button>
      </Toolbar>
    </CesiumContainer>
  )
}

export default BroaderVision
