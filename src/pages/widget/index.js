import { useEffect } from 'react'
import Cesium from '@utils/cesium'

export default function Widget() {
  useEffect(() => {
    new Cesium.CesiumWidget('stage')
  }, [])
  return <div id="stage"></div>
}
