import { Component } from 'react'
import Cesium from '@/utils/cesium'

class Polyline extends Component {
  componentDidMount() {
    const viewer = new Cesium.Viewer('stage')

    /** @type Cesium.PolylineCollection */
    const polylines = viewer.scene.primitives.add(new Cesium.PolylineCollection())

    // Sample polyline.
    polylines.add({
      positions: Cesium.PolylinePipeline.generateCartesianArc({
        positions: Cesium.Cartesian3.fromDegreesArray([-120.0, 40.0, -50.0, 30.0])
      }),
      material: Cesium.Material.fromType('Color', {
        color: new Cesium.Color(1.0, 0.1, 0.1, 1.0)
      })
    })

    // Polyline with outline.
    polylines.add({
      positions: Cesium.PolylinePipeline.generateCartesianArc({
        positions: Cesium.Cartesian3.fromDegreesArray([
          -105.0, 40.0, -100.0, 38.0, -105.0, 35.0, -100.0, 32.0
        ])
      }),
      material: Cesium.Material.fromType(Cesium.Material.PolylineOutlineType, {
        outlineWidth: 5.0
      }),
      width: 10.0
    })

    // Polyline with glow material.
    polylines.add({
      positions: Cesium.PolylinePipeline.generateCartesianArc({
        positions: Cesium.Cartesian3.fromDegreesArray([-95.0, 30.0, -85.0, 40.0])
      }),
      material: Cesium.Material.fromType(Cesium.Material.PolylineGlowType, {
        glowPower: 0.2,
        taperPower: 0.2,
        color: new Cesium.Color(0.3, 0.5, 0.2, 1.0)
      }),
      width: 20.0
    })

    // Loop polyline.
    polylines.add({
      positions: Cesium.PolylinePipeline.generateCartesianArc({
        positions: Cesium.Cartesian3.fromDegreesArray([-105.0, 30.0, -105.0, 25.0, -100.0, 22.0])
      }),
      material: Cesium.Material.fromType('Color', {
        color: new Cesium.Color(0.2, 0.8, 0.1, 1.0)
      }),
      width: 5.0,
      loop: true
    })

    // Rhumb polyline.
    polylines.add({
      positions: Cesium.PolylinePipeline.generateCartesianRhumbArc({
        positions: Cesium.Cartesian3.fromDegreesArray([-130.0, 30.0, -75.0, 30.0])
      }),
      width: 5,
      material: Cesium.Material.fromType('Color', {
        color: new Cesium.Color(0.0, 1.0, 0.0, 1.0)
      })
    })
  }
  render() {
    return <div id="stage"></div>
  }
}

export default Polyline
