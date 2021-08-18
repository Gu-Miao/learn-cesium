import { useEffect, useRef } from 'react'
import Cesium from '@utils/cesium'

export default function Widget() {
  const div = useRef(null)
  useEffect(() => {
    new Cesium.CesiumWidget('widget1')
  }, [])
  return <div id="widget1" style={{ height: 700 }}></div>
}
