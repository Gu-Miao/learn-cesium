import { Component } from 'react'
import Cesium from '@utils/cesium'
import geojson from './china.geojson'

class China extends Component {
  async componentDidMount() {
    const viewer = new Cesium.Viewer('stage')

    viewer.scene.debugShowFramesPerSecond = true

    const res = await Cesium.GeoJsonDataSource.load(geojson)

    const entities = res.entities.values

    const provinceMap = {}
    entities.forEach(entity => {
      const { name, id, polygon } = entity
      if (!provinceMap[name]) provinceMap[name] = []
      provinceMap[name].push({
        id,
        positions: polygon.hierarchy.getValue().positions
      })
    })

    const polygonCollection = viewer.scene.primitives.add(new Cesium.PrimitiveCollection())
    const polylineCollection = viewer.scene.primitives.add(new Cesium.PrimitiveCollection())

    Object.keys(provinceMap).forEach(name => {
      const province = provinceMap[name]

      const polygons = []
      const polylines = []

      province.forEach(chunk => {
        const polygon = new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(chunk.positions)
        })
        const polyline = new Cesium.PolylineGeometry({
          positions: chunk.positions,
          width: 2.0,
          vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
        })
        polygons.push(
          new Cesium.GeometryInstance({
            geometry: polygon,
            id: name + '-polygon-' + chunk.id
          })
        )
        polylines.push(
          new Cesium.GeometryInstance({
            geometry: polyline,
            id: name + '-polyline-' + chunk.id,
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                Cesium.Color.fromCssColorString('#77a9cc')
              )
            }
          })
        )
      })
      polygonCollection.add(
        new Cesium.Primitive({
          geometryInstances: polygons,
          appearance: new Cesium.MaterialAppearance({
            flat: true,
            material: Cesium.Material.fromType('Color', {
              color: new Cesium.Color(0, 0, 1, 0.1)
            })
          }),
          releaseGeometryInstances: false
        })
      )
      polylineCollection.add(
        new Cesium.Primitive({
          geometryInstances: polylines,
          appearance: new Cesium.PolylineColorAppearance({ flat: true })
        })
      )
    })

    console.log(polygonCollection)

    let currentPprovince

    function clear() {
      const current = polygonCollection._primitives.find(primitive =>
        primitive._instanceIds[0].includes(currentPprovince)
      )
      current.appearance.material = Cesium.Material.fromType('Color', {
        color: new Cesium.Color(0, 0, 1, 0.1)
      })

      currentPprovince = undefined
    }

    viewer.screenSpaceEventHandler.setInputAction(function (e) {
      const pick = viewer.scene.pick(e.position)

      if (!pick?.id) {
        if (currentPprovince) clear()
        return
      }
      const name = pick.id.split('-')[0]
      if (name === currentPprovince) {
        return
      } else {
        if (currentPprovince) clear()
      }
      currentPprovince = name
      pick.primitive.appearance.material = Cesium.Material.fromType('Color', {
        color: new Cesium.Color(1, 0, 0, 0.1)
      })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  render() {
    return <div id="stage"></div>
  }
}

export default China
