import { Component } from 'react'
import Cesium, { CesiumNavigation } from '@utils/cesium'
import { Button } from 'antd'

const startPosition = [-85.0, 36.0]
const endPosition = [-84.9, 36.1]

const start = Cesium.Cartesian3.fromDegrees(...startPosition)
const end = Cesium.Cartesian3.fromDegrees(...endPosition)

const duration = 20
const count = 80
let positions = []

function createCZML(positions, viewFrom) {
  const start = Cesium.JulianDate.now()
  const end = Cesium.JulianDate.addSeconds(start, duration, new Cesium.JulianDate())

  const startISO = Cesium.JulianDate.toIso8601(start)
  const endISO = Cesium.JulianDate.toIso8601(end)

  return [
    {
      id: 'document',
      name: '观光路线',
      version: '1.0',
      clock: {
        interval: `${startISO}/${endISO}`,
        currentTime: startISO,
        multiplier: 1,
        range: 'UNBOUNDED'
      }
    },
    {
      id: 'path',
      name: '观光路线',
      description: '<p>观光路线</p>',
      availability: `${startISO}/${endISO}`,
      path: {
        material: {
          polylineOutline: {
            color: {
              rgba: [0, 0, 0, 255]
            },
            outlineColor: {
              rgba: [0, 0, 0, 255]
            },
            outlineWidth: 5
          }
        },
        width: 8,
        leadTime: 0,
        trailTime: 1000,
        resolution: 5
      },
      point: {
        pixelSize: 0.0,
        color: {
          rgba: [0, 0, 0, 255]
        }
      },
      viewFrom: {
        cartesian: viewFrom
      },
      position: {
        epoch: startISO,
        cartographicDegrees: getCartographicDegrees(positions)
      }
    }
  ]
}

/**
 *
 * @param {Cesium.Cartographic[]} positions
 */
function getCartographicDegrees(positions) {
  return positions.flatMap((position, i) => [
    (i * duration) / count,
    Cesium.Math.toDegrees(position.longitude),
    Cesium.Math.toDegrees(position.latitude),
    position.height + 30.0
  ])
}

class CZMLPath extends Component {
  state = {
    viewDisabled: true
  }
  async componentDidMount() {
    this.terrainProvider = Cesium.createWorldTerrain()

    this.viewer = new Cesium.Viewer('stage', {
      terrainProvider: this.terrainProvider,
      shouldAnimate: true
    })

    new CesiumNavigation(this.viewer, {})

    this.scene = this.viewer.scene
    this.camera = this.scene.camera

    this.scene.groundPrimitives.add(
      new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.GroundPolylineGeometry({
            positions: [start, end],
            width: 4.0
          })
        })
      })
    )

    this.flyTo()

    this.getPathPositions()
  }
  /**
   * @param {Cesium.Cartesian3} prev
   * @param {Cesium.Cartesian3} next
   * @param {number} pitch
   * @param {number} backward
   * @returns
   */
  getXYZ = (prev, next, pitch = -45, backward = 1000) => {
    const [p1, p2] = this.getLocalPositions(prev, next)
    const heading = this.getHeadingDegree(p1.x, p1.y, p2.x, p2.y)

    const xDiff = p2.x - p1.x
    const yDiff = p2.y - p1.y

    const x = backward * Math.abs(Math.sin(heading)) * (xDiff > 0 ? -1 : 1)
    const y = backward * Math.abs(Math.cos(heading)) * (yDiff > 0 ? -1 : 1)
    const z = backward / Math.abs(Math.tan(pitch))

    return [x, y, z]
  }
  /**
   * @param {Cesium.Cartesian3[]} prev Prev position lon lat height array.
   */
  getLocalPositions = (prev, next) => {
    const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(prev)
    const worldToLocalMatrix = Cesium.Matrix4.inverse(localToWorldMatrix, new Cesium.Matrix4())

    const p1 = Cesium.Matrix4.multiplyByPoint(worldToLocalMatrix, prev, new Cesium.Cartesian3())

    const p2 = Cesium.Matrix4.multiplyByPoint(worldToLocalMatrix, next, new Cesium.Cartesian3())

    return [p1, p2]
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
  getPathPositions = async () => {
    const p = []
    for (let i = 0; i <= count; ++i) {
      const offset = i / count
      p.push(
        Cesium.Cartographic.fromCartesian(
          Cesium.Cartesian3.lerp(start, end, offset, new Cesium.Cartesian3())
        )
      )
    }
    try {
      const res = await Cesium.sampleTerrain(this.terrainProvider, 12, p)
      positions = [...res]
      this.setState({ viewDisabled: false })
      return positions
    } catch (e) {
      console.error(e)
      return []
    }
  }
  clearPrevDataSource = () => {
    if (this.ds) {
      this.viewer.dataSources.remove(this.ds, true)
      this.viewer.trackedEntity = undefined
    }
  }
  loadCZML = async toEnd => {
    this.clearPrevDataSource()
    const p = toEnd ? positions : [...positions].reverse()
    const args = toEnd ? [start, end] : [end, start]
    const viewFrom = this.getXYZ(...args)
    console.log(viewFrom)
    try {
      this.ds = await this.viewer.dataSources.add(
        Cesium.CzmlDataSource.load(createCZML(p, viewFrom))
      )
      const entity = this.ds.entities.getById('path')
      this.viewer.zoomTo(entity)
      this.viewer.trackedEntity = entity
    } catch (e) {
      console.error(e)
      this.flyTo(toEnd)
    }
  }
  flyTo = (toEnd = false) => {
    this.clearPrevDataSource()
    this.camera.flyTo({
      destination: new Cesium.Cartesian3.fromDegrees(
        ...(toEnd ? endPosition : startPosition),
        1000.0
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: Cesium.Math.toRadians(0.0)
      }
    })
  }
  render() {
    const { viewDisabled } = this.state
    return (
      <>
        <div className="toolbar">
          <Button
            className="vtb"
            disabled={viewDisabled}
            type="primary"
            onClick={() => this.loadCZML()}
          >
            view to start
          </Button>
          <Button
            className="vtb"
            disabled={viewDisabled}
            type="primary"
            onClick={() => this.loadCZML(true)}
          >
            view to end
          </Button>
          <Button className="vtb" type="primary" onClick={() => this.flyTo()}>
            Fly to Start
          </Button>
          <Button className="vtb" type="primary" onClick={() => this.flyTo(true)}>
            Fly to end
          </Button>
        </div>

        <div id="stage"></div>
      </>
    )
  }
}

export default CZMLPath
