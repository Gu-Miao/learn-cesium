import { Component } from 'react'
import Cesium from '@utils/cesium'
import geojson from './china.geojson'

const position = new Cesium.Cartesian3(-3444903.601210806, 9615228.302818255, 3942619.829365022)
const direction = new Cesium.Cartesian3(
  0.320106289880714,
  -0.9356545881622562,
  -0.14860166496282323
)

class China extends Component {
  async componentDidMount() {
    const viewer = new Cesium.Viewer('stage')

    viewer.scene.debugShowFramesPerSecond = true

    const defaultColor = Cesium.Color.fromBytes(0, 0, 128, 128)

    const res = await Cesium.GeoJsonDataSource.load(geojson, {
      stroke: Cesium.Color.WHITE,
      fill: defaultColor
    })

    viewer.camera.direction = direction
    viewer.camera.position = position

    viewer.dataSources.add(res)

    const entities = res.entities.values
    const entityIds = []
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
      const { id } = entity
      entityIds.push(id)
      entity.polygon.extrudedHeight = 4e4
    }

    let curr = null

    viewer.screenSpaceEventHandler.setInputAction(e => {
      const p = viewer.scene.pick(e.position)
      if (entityIds.includes(p?.id?.id)) {
        if (curr) {
          if (curr.id === p.id.id) {
            return
          } else {
            curr.polygon.material = defaultColor
            curr = null
          }
        }
        const entity = p.id
        curr = entity
        entity.polygon.outline = true
        entity.polygon.material = new Cesium.GmMaterialProperty(Cesium.Color.RED, 3000)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  render() {
    return <div id="stage"></div>
  }
}

export default China
