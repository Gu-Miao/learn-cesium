import { useEffect, useRef } from 'react'
import Cesium from '@utils/cesium'

export default function Widget() {
  const div = useRef(null)
  useEffect(() => {
    new Cesium.CesiumWidget('stage')
  }, [])
  return <div id="stage"></div>
}
