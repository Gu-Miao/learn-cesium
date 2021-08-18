import { Component } from 'react'
import Cesium from '@utils/cesium'
import dayjs from 'dayjs'

const startPosition = [-85.0, 36.0]
const endPosition = [-84.9, 36.1]

const start = Cesium.Cartesian3.fromDegrees(...startPosition)
const end = Cesium.Cartesian3.fromDegrees(...endPosition)

const duration = 30
const count = 100
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
        pixelSize: 0.0
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
    position.height + 200.0
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
      const res = await Cesium.sampleTerrain(this.terrainProvider, 15, p)
      positions = [...res]
      console.log('positions ready\n', positions)
      return positions
    } catch (e) {
      console.error(e)
      return []
    }
  }
  loadCZML = toEnd => {
    const e = this.viewer.entities.getById('path')
    console.log(e)
    const p = toEnd ? positions : [...positions].reverse()
    if (this.ds) {
      this.viewer.dataSources.remove(this.ds, true)
    }
    this.viewer.dataSources.add(Cesium.CzmlDataSource.load(createCZML(p))).then(ds => {
      this.ds = ds
      this.viewer.trackedEntity = ds.entities.getById('path')
    })
  }
  flyTo = (toEnd = false) => {
    this.viewer.trackedEntity = undefined
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
        <button
          disabled={viewDisabled}
          className="tool-btn"
          style={{ top: 60 }}
          onClick={() => this.loadCZML()}
        >
          view to start
        </button>
        <button
          disabled={viewDisabled}
          className="tool-btn"
          style={{ top: 105 }}
          onClick={() => this.loadCZML(true)}
        >
          view to end
        </button>
        <button className="tool-btn" style={{ top: 150 }} onClick={() => this.flyTo()}>
          Fly to Start
        </button>
        <button className="tool-btn" style={{ top: 195 }} onClick={() => this.flyTo(true)}>
          Fly to end
        </button>
        <div id="stage"></div>
      </>
    )
  }
}

export default Path
