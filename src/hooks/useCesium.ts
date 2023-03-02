import { onMounted, onBeforeUnmount } from 'vue'
import { Viewer, Ion } from 'cesium'
import { CESIUM_CONTAINER_ID } from '@/common/constants'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODY1YTUwZC03ODgxLTQ2ODgtOTdlYy01YTk0MzZhYzliNTgiLCJpZCI6MTAyOTY4LCJpYXQiOjE2NTkwNzc5MDZ9.YypWWZvSdxCnNEVSygS-GPWAGpx5wNYsgz7V3SPOLWs'

type ViewerRef = { current?: Viewer }

/**
 * Use cesium hook.
 * @param callback Callback after viewer is mounted.
 */
function useCesium(callback?: (viewer: Viewer) => void) {
  const viewerRef: ViewerRef = { current: undefined }

  onMounted(() => {
    viewerRef.current = createViewer()
    if (callback) {
      callback(viewerRef.current)
    }
  })

  onBeforeUnmount(() => {
    const viewer = viewerRef.current as Viewer
    viewer.destroy()
  })

  return viewerRef
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
