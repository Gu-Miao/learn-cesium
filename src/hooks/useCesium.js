import { useEffect, useRef } from 'react'
import { Viewer } from 'cesium'

/**
 * @callback CesiumHandler
 *
 * @param {Viewer} viewer Viewer instance.
 */

/** @typedef {import('react')} React */

/**
 * Use cesium hook.
 *
 * @param {CesiumHandler} callback
 * @returns {React.MutableRefObject.<null|Viewer>}
 */
function useCesium(callback) {
  const viewerRef = useRef(null)
  useEffect(() => {
    const viewer = createViewer()
    viewerRef.current = viewer

    callback && callback(viewer)

    return () => {
      try {
        viewer.destroy()
      } catch {}
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return viewerRef
}

function createViewer() {
  const viewer = new Viewer('cesiumContainer', {
    fullscreenElement: 'cesiumContainer'
  })

  viewer.scene.debugShowFramesPerSecond = true
  viewer.scene.postProcessStages.fxaa.enabled = true

  return viewer
}

export default useCesium
