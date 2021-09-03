import React, { Component } from 'react'
import Cesium, { CesiumNavigation } from '@utils/cesium'
import { Button } from 'antd'
import dayjs from 'dayjs'

const duration = 20
const count = 300
const step = duration / count

const startDegree = [117.128202, 36.209944]
const endDegree = [117.109628, 36.257021]

const startPosition = Cesium.Cartesian3.fromDegrees(...startDegree)
const endPosition = Cesium.Cartesian3.fromDegrees(...endDegree)

const positions = []
let _positions = []

for (let i = 0; i <= count; ++i) {
  const offset = i / count
  positions.push(
    Cesium.Cartesian3.lerp(startPosition, endPosition, offset, new Cesium.Cartesian3())
  )
}

function createCZML(positions, viewFrom) {
  const start = dayjs()
  const end = start.clone().add(duration, 's')

  const startISO = start.toISOString()
  const endISO = end.toISOString()

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
      point: {
        pixelSize: 0.0,
        color: {
          rgba: [0, 0, 0, 0]
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
    position.height + 100.0
  ])
}

export class Path extends Component {
  componentDidMount() {
    this.viewer = new Cesium.Viewer('stage', {
      terrainProvider: Cesium.createWorldTerrain(),
      shouldAnimate: true
    })

    new CesiumNavigation(this.viewer, {})
    this.viewer.scene.debugShowFramesPerSecond = true

    this.getPathPositions()
  }
  setView = () => {
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(...startDegree, 2000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0)
      }
    })
  }
  draw = () => {
    if (!_positions.length) return
    const { clock, scene } = this.viewer
    clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK

    /** @type Cesium.PrimitiveCollection */
    this.path = scene.groundPrimitives.add(new Cesium.PrimitiveCollection())

    let i = 0
    let next = Cesium.JulianDate.now()
    addSecond(next, step)

    const onTick = clock => {
      if (Cesium.JulianDate.greaterThanOrEquals(clock.currentTime, next)) {
        if (i < count) {
          this.path.add(
            new Cesium.GroundPolylinePrimitive({
              geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.GroundPolylineGeometry({
                  positions: [positions[i], positions[i + 1]],
                  width: 6.0,
                  vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
                }),
                attributes: {
                  color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    new Cesium.Color(0.0, 0.0, 1.0, 1.0)
                  )
                }
              }),
              appearance: new Cesium.PolylineColorAppearance({
                translucent: false
              })
            })
          )

          i++
          addSecond(next, step)
        } else {
          clock.onTick.removeEventListener(onTick)
        }
      }
    }

    this.loadCZML(true)
    clock.onTick.addEventListener(onTick)

    function addSecond(julianDate, second) {
      return Cesium.JulianDate.addSeconds(julianDate, second, julianDate)
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
    const p = toEnd ? _positions : [..._positions].reverse()
    const args = toEnd ? [startPosition, endPosition] : [endPosition, startPosition]
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
  getPathPositions = async () => {
    try {
      const p = positions.map(p => Cesium.Cartographic.fromCartesian(p))
      const res = await Cesium.sampleTerrain(this.viewer.terrainProvider, 12, p)
      _positions = [...res]
      this.setState({ viewDisabled: false })
      console.log('_positions ready')
      return positions
    } catch (e) {
      console.error(e)
      return []
    }
  }
  /**
   * @param {Cesium.Cartesian3} prev
   * @param {Cesium.Cartesian3} next
   * @param {number} pitch
   * @param {number} backward
   * @returns
   */
  getXYZ = (prev, next, pitch = -45, backward = 2000) => {
    const [p1, p2] = this.getLocalPositions(prev, next)
    const heading = this.getHeadingDegree(p1.x, p1.y, p2.x, p2.y)

    const xDiff = p2.x - p1.x
    const yDiff = p2.y - p1.y

    const x = backward * Math.abs(Math.sin(heading)) * (xDiff > 0 ? -1 : 1)
    const y = backward * Math.abs(Math.cos(heading)) * (yDiff > 0 ? -1 : 1)
    const z = backward / Math.abs(Math.tan(pitch))

    p1.x += x
    p1.y += y
    p1.z += z

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
  render() {
    return (
      <>
        <div className="toolbar">
          <Button type="primary" className="vtb" onClick={this.setView}>
            Set View
          </Button>
          <Button type="primary" className="vtb" onClick={this.draw}>
            Draw path
          </Button>
        </div>
        <div id="stage"></div>
      </>
    )
  }
}

export default Path
