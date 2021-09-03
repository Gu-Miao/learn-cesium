import { Component } from 'react'
import Cesium from '@/utils/cesium'

export class Terrain extends Component {
  componentDidMount() {
    const worldTerrain = Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true
    })
    const viewer = new Cesium.Viewer('stage', {
      terrainProvider: worldTerrain
    })

    viewer.scene.globe.enableLighting = true
  }

  render() {
    return <div id="stage"></div>
  }
}

export default Terrain
