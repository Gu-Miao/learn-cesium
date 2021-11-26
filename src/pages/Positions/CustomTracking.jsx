import Cesium, {
  CesiumNavigation,
  getLocalPositions,
  getHeadingDegree,
  getWiderView,
  trackAnimateEntity
} from '@utils/cesium'
import { useEffect } from 'react'
import plane from '@assets/plane.glb'

const area = [
  [115, 36, 100],
  [115.001, 36, 100],
  [115.001, 36.001, 100],
  [115, 36.001, 100]
]

const positions = [
  [115.00001, 36.00001, 102],
  [115.00001, 36.00002, 102],
  [115.00003, 36.00002, 102],
  [115.000015, 36.0000266, 102],
  [115.00007, 36.00004, 102],
  [115.000083, 36.00003, 102],
  [115.000158, 36.00044, 102]
]

function createCZML() {
  const duration = 25
  const modelDefaultHeading = -90
  const turnDuration = 0.5
  let totalDistance = 0
  let time = 0
  const distances = []
  const orientations = []
  const unitQuaternion = []
  const cartographicDegrees = []

  for (let i = 1; i < positions.length; ++i) {
    const prev = Cesium.Cartesian3.fromDegrees(...positions[i - 1])
    const next = Cesium.Cartesian3.fromDegrees(...positions[i])
    const distance = Cesium.Cartesian3.distance(prev, next)
    totalDistance += distance
    distances.push(distance)

    const { prev: localPrev, next: localNext } = getLocalPositions(prev, next)
    const heading = getHeadingDegree(localPrev, localNext)

    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      prev,
      new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(heading + modelDefaultHeading),
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(0)
      )
    )
    orientations.push(orientation)
  }

  for (let i = 0; i < positions.length; i++) {
    const { x, y, z, w } = orientations[i] || {}
    if (i === 0) {
      cartographicDegrees.push(0, ...positions[0])
      unitQuaternion.push(0, x, y, z, w)
      continue
    }
    const timeDiff = (distances[i - 1] / totalDistance) * duration
    time = time + timeDiff
    cartographicDegrees.push(time, ...positions[i])
    const { x: _x, y: _y, z: _z, w: _w } = orientations[i - 1]
    unitQuaternion.push(timeDiff >= turnDuration ? time - turnDuration : time, _x, _y, _z, _w)
    if (i === positions.length - 1) {
      unitQuaternion.push(time, _x, _y, _z, _w)
    } else {
      unitQuaternion.push(time, x, y, z, w)
    }
  }

  const startTime = Cesium.JulianDate.now()
  const startTimeISO = Cesium.JulianDate.toIso8601(startTime)
  const endTime = Cesium.JulianDate.addSeconds(startTime, duration, new Cesium.JulianDate())

  return {
    endTime,
    czml: [
      {
        id: 'document',
        version: '1.0',
        clock: {
          currentTime: startTimeISO,
          multiplier: 1,
          range: 'UNBOUNDED'
        }
      },
      {
        id: 'plane',
        model: {
          gltf: plane,
          scale: 0.08
        },
        position: {
          epoch: startTimeISO,
          cartographicDegrees
        },
        orientation: {
          epoch: startTimeISO,
          unitQuaternion
        }
      }
    ]
  }
}

const CustomTracking = () => {
  useEffect(() => {
    const viewer = new Cesium.Viewer('stage')

    CesiumNavigation(viewer, {})

    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions.flat()),
        material: Cesium.Color.WHITE
      },
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArrayHeights(area.flat())
        ),
        material: Cesium.Color.GREEN.withAlpha(0.5),
        height: 100
      }
    })

    const { czml, endTime } = createCZML()
    viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(ds => {
      const fly = ds.entities.getById('plane')
      viewer.trackedEntity = fly
      viewer.clock.shouldAnimate = true
      const position1 = Cesium.Cartesian3.fromDegrees(...positions[0])
      const position2 = Cesium.Cartesian3.fromDegrees(...positions[1])
      const pitch = -30
      const backward = 5
      const data = getWiderView(position1, position2, pitch, backward)
      viewer.camera.setView({
        destination: data.position,
        orientation: {
          heading: Cesium.Math.toRadians(data.heading),
          pitch: Cesium.Math.toRadians(data.pitch),
          roll: Cesium.Math.toRadians(data.roll)
        }
      })

      trackAnimateEntity({ viewer, entity: fly, pitch, range: 10, endTime })
    })

    return () => viewer.destroy()
  }, [])

  return <div id="stage"></div>
}

export default CustomTracking
