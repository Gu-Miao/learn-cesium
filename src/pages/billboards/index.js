import { useEffect } from 'react'
import Cesium from '@/utils/cesium'
import logo from '@assets/logo.svg'

console.log('logo', logo)

const Billboard = () => {
  useEffect(() => {
    const viewer = new Cesium.Viewer('stage')
    const entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 0),
      billboard: {
        image: logo,
        show: true,
        color: Cesium.Color.LIME,
        // sizeInMeters: true,
        scaleByDistance: new Cesium.NearFarScalar(100, 1.5, 1.5e5, 0.2)
      }
    })

    viewer.zoomTo(entity)
  }, [])

  return <div id="stage"></div>
}

export default Billboard
