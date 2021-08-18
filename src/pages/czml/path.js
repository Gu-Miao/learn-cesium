import { Component } from 'react'
import Cesium from '@utils/cesium'
import { Button } from 'antd'
import dayjs from 'dayjs'

const startPosition = [-85.0, 36.0]
const endPosition = [-84.9, 36.1]

const start = Cesium.Cartesian3.fromDegrees(...startPosition)
const end = Cesium.Cartesian3.fromDegrees(...endPosition)

const duration = 20
const count = 80
let positions = []

function createCZML(positions) {
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

class Path extends Component {
  state = {
    viewDisabled: true
  }
  async componentDidMount() {
    this.terrainProvider = Cesium.createWorldTerrain()

    this.viewer = new Cesium.Viewer('stage', {
      terrainProvider: this.terrainProvider,
      shouldAnimate: true
    })

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
  setCameraPosition = () => {}
  loadCZML = async toEnd => {
    this.clearPrevDataSource()
    const p = toEnd ? positions : [...positions].reverse()
    try {
      this.ds = await this.viewer.dataSources.add(Cesium.CzmlDataSource.load(createCZML(p)))
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

export default Path
