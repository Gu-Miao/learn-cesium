import { useEffect } from 'react'
import Cesium, { setHeight } from '@utils/cesium'

export default function CameraOn3DTiles() {
  useEffect(() => {
    const viewer = new Cesium.Viewer('stage', {
      terrainProvider: Cesium.createWorldTerrain()
    })

    const { scene, camera } = viewer

    const tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )

    tileset.readyPromise.then(tileset => {
      viewer.zoomTo(tileset)
    })

    scene.preRender.addEventListener(() => {
      const { position } = camera
      const { height } = Cesium.Cartographic.fromCartesian(position)
      if (height < 100) {
        camera.position = setHeight(position, 100)
      }
    })

    return () => viewer.destroy()
  }, [])

  return <div id="stage"></div>
}
