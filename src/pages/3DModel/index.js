import { useEffect } from 'react'
import Cesium from '@/utils/cesium'
import plane from '@assets/plane.glb'

/** @type import('cesium').Model **/
let model

const Model = () => {
  useEffect(() => {
    const viewer = new Cesium.CesiumWidget('stage')

    const { scene } = viewer

    function createModel(url, height = 0.0, heading = 0.0, pitch = 0.0, roll = 0.0) {
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)

      const origin = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, height)
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hpr)

      scene.primitives.removeAll()

      model = scene.primitives.add(
        Cesium.Model.fromGltf({
          url,
          modelMatrix: modelMatrix,
          minimumPixelSize: 128
        })
      )

      model.readyPromise
        .then(function (model) {
          model.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, 1)
          model.colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT
          model.colorBlendAmount = 0.5

          // Play and loop all animations at half-speed
          model.activeAnimations.addAll({
            multiplier: 0.5,
            loop: Cesium.ModelAnimationLoop.REPEAT
          })

          const camera = viewer.camera

          // Zoom to model
          const controller = scene.screenSpaceCameraController
          const r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near)
          controller.minimumZoomDistance = r * 0.5

          const center = Cesium.Matrix4.multiplyByPoint(
            model.modelMatrix,
            model.boundingSphere.center,
            new Cesium.Cartesian3()
          )

          const heading = Cesium.Math.toRadians(230.0)
          const pitch = Cesium.Math.toRadians(-20.0)
          camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, r * 2.0))
        })
        .otherwise(function (error) {
          console.error(error)
        })
    }

    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction(function (movement) {
      const pick = scene.pick(movement.endPosition)
      if (Cesium.defined(pick) && Cesium.defined(pick.node) && Cesium.defined(pick.mesh)) {
        // Output glTF node and mesh under the mouse.
        console.log('node: ' + pick.node.name + '. mesh: ' + pick.mesh.name)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    const height = 300.0
    const heading = 0.0
    const pitch = Cesium.Math.toRadians(10.0)
    const roll = Cesium.Math.toRadians(-20.0)
    createModel(plane, height, heading, pitch, roll)
  }, [])

  return <div id="stage"></div>
}

export default Model
