import { onMounted, onUnmounted } from 'vue'
import { Viewer } from 'cesium'
import { CESIUM_CONTAINER_ID } from '@/common/constants'

type ViewerRef = { current?: Viewer }

/**
 * Use cesium hook.
 * @param callback Callback after viewer is mounted.
 */
function useCesium(callback?: (viewer: Viewer) => void) {
  const viewer: ViewerRef = { current: undefined }

  onMounted(() => {
    viewer.current = createViewer()
    callback && callback(viewer.current)
  })

  onUnmounted(() => {
    try {
      viewer.current?.destroy()
      // eslint-disable-next-line no-empty
    } catch {}
  })

  return viewer
}

/** Create a viewer. */
function createViewer() {
  const viewer = new Viewer(CESIUM_CONTAINER_ID, {
    fullscreenElement: CESIUM_CONTAINER_ID
  })

  viewer.scene.debugShowFramesPerSecond = true
  viewer.scene.postProcessStages.fxaa.enabled = true

  return viewer
}

export default useCesium
