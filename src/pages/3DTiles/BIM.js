import React, { Component } from 'react'
import Cesium from '@utils/cesium'

// BIM is Building Information Modeling
class BIM extends Component {
  componentDidMount() {
    const viewer = new Cesium.Viewer('stage')
    const { scene } = viewer

    /** @type Cesium.Cesium3DTileset */
    const tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(8564)
      })
    )

    tileset.readyPromise
      .then(function (tileset) {
        viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0)
        )
      })
      .otherwise(function (err) {
        console.error(err)
      })

    tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE
  }
  render() {
    return <div id="stage"></div>
  }
}

export default BIM
