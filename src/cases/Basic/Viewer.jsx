import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'

function ViewerCase() {
  useCesium()

  return <CesiumContainer />
}

export default ViewerCase
