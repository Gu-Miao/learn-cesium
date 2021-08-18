import { useEffect } from 'react'
import Cesium from '@utils/cesium'

const FromIonResource = () => {
  useEffect(() => {
    const viewer = new Cesium.Viewer('stage', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(40866)
    })

    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)
  }, [])
  return <div id="stage"></div>
}

export default FromIonResource
