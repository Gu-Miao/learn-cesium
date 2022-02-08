import useCesium from '@/hooks/useCesium'
import { Cartesian3 } from 'cesium'
import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'

import reactLogo from '@/assets/react.svg'

function Billboard() {
  useCesium(viewer => {
    const entity = viewer.entities.add({
      billboard: {
        image: reactLogo
      },
      position: Cartesian3.fromDegrees(120, 36)
    })

    viewer.zoomTo(entity)
  })

  return <CesiumContainer />
}

export default Billboard
