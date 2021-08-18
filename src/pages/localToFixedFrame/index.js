import { Component } from 'react'
import Cesium from '@/utils/cesium'

import './style.less'

const localFrames = [
  {
    position: Cesium.Cartesian3.fromDegrees(-123.075, 44.045, 5000.0),
    converter: Cesium.Transforms.eastNorthUpToFixedFrame,
    comments: 'Classical East North Up\nlocal Frame'
  },
  {
    position: Cesium.Cartesian3.fromDegrees(-123.075, 44.05, 5500.0),
    converter: Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west'),
    comments: 'North West Up\nlocal Frame'
  },
  {
    position: Cesium.Cartesian3.fromDegrees(-123.075, 44.04, 4500.0),
    converter: Cesium.Transforms.localFrameToFixedFrameGenerator('south', 'up'),
    comments: 'South Up West\nlocal Frame'
  },
  {
    position: Cesium.Cartesian3.fromDegrees(-123.075, 44.05, 4500.0),
    converter: Cesium.Transforms.localFrameToFixedFrameGenerator('up', 'east'),
    comments: 'Up East North\nlocal Frame'
  },
  {
    position: Cesium.Cartesian3.fromDegrees(-123.075, 44.04, 5500.0),
    converter: Cesium.Transforms.localFrameToFixedFrameGenerator('down', 'east'),
    comments: 'Down East South\nlocal Frame'
  }
]

const url = '/models/Cesium_Air.glb'

class LocalToFixedFrame extends Component {
  state = {
    heading: 0,
    pitch: 0,
    roll: 0
  }

  componentDidMount() {
    const viewer = new Cesium.Viewer('stage')
    const camera = viewer.camera
    const scene = viewer.scene
    const canvas = viewer.canvas
    const controller = scene.screenSpaceCameraController

    foucusCanvas(canvas)

    const center = new Cesium.Cartesian3()

    const hpRoll = new Cesium.HeadingPitchRoll()
    const hpRange = new Cesium.HeadingPitchRange()
    const deltaRadians = Cesium.Math.toRadians(1.0)

    const primitives = []
    const hprRollZero = new Cesium.HeadingPitchRoll()

    // Iterate localFrames.
    localFrames.forEach(frame => {
      const { position, converter, comments } = frame

      // Create plane model primitive.
      const planePrimitive = scene.primitives.add(
        Cesium.Model.fromGltf({
          url,
          modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            position,
            hpRoll,
            Cesium.Ellipsoid.WGS84,
            converter
          ),
          minimumPixelSize: 128
        })
      )

      // Add it into array.
      primitives.push({
        primitive: planePrimitive,
        converter: converter,
        position: position
      })

      // Add matrix for coordinate system.
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hprRollZero,
        Cesium.Ellipsoid.WGS84,
        converter
      )

      // Add built-in coordinate system primitive.
      scene.primitives.add(
        new Cesium.DebugModelMatrixPrimitive({
          modelMatrix,
          length: 300.0,
          width: 10.0
        })
      )

      // Add lables.
      const positionLabel = position.clone()
      positionLabel.z = position.z + 300.0
      viewer.entities.add({
        position: positionLabel,
        label: {
          text: comments,
          font: '18px Helvetica',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          HorizontalOrigin: Cesium.HorizontalOrigin.RIGHT
        }
      })
    })

    primitives[0].primitive.readyPromise.then(function (model) {
      // Play and loop all animations at half-speed
      model.activeAnimations.addAll({
        multiplier: 0.5,
        loop: Cesium.ModelAnimationLoop.REPEAT
      })

      // Zoom to model
      const r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near)
      controller.minimumZoomDistance = r * 0.5
      Cesium.Matrix4.multiplyByPoint(model.modelMatrix, model.boundingSphere.center, center)
      const heading = Cesium.Math.toRadians(90.0)
      const pitch = Cesium.Math.toRadians(0.0)
      hpRange.heading = heading
      hpRange.pitch = pitch
      hpRange.range = r * 100.0
      camera.lookAt(center, hpRange)
    })

    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowDown':
          // pitch down
          hpRoll.pitch -= deltaRadians
          if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
            hpRoll.pitch += Cesium.Math.TWO_PI
          }
          break
        case 'ArrowUp':
          // pitch up
          hpRoll.pitch += deltaRadians
          if (hpRoll.pitch > Cesium.Math.TWO_PI) {
            hpRoll.pitch -= Cesium.Math.TWO_PI
          }
          break
        case 'ArrowRight':
          if (e.shiftKey) {
            // roll right
            hpRoll.roll += deltaRadians
            if (hpRoll.roll > Cesium.Math.TWO_PI) {
              hpRoll.roll -= Cesium.Math.TWO_PI
            }
          } else {
            // turn right
            hpRoll.heading += deltaRadians
            if (hpRoll.heading > Cesium.Math.TWO_PI) {
              hpRoll.heading -= Cesium.Math.TWO_PI
            }
          }
          break
        case 'ArrowLeft':
          if (e.shiftKey) {
            // roll left until
            hpRoll.roll -= deltaRadians
            if (hpRoll.roll < 0.0) {
              hpRoll.roll += Cesium.Math.TWO_PI
            }
          } else {
            // turn left
            hpRoll.heading -= deltaRadians
            if (hpRoll.heading < 0.0) {
              hpRoll.heading += Cesium.Math.TWO_PI
            }
          }
          break
        default:
      }
    })

    viewer.scene.preUpdate.addEventListener(() => {
      primitives.forEach(primitiveObj => {
        const { primitive, converter, position } = primitiveObj

        Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          hpRoll,
          Cesium.Ellipsoid.WGS84,
          converter,
          primitive.modelMatrix
        )
      })
    })

    viewer.scene.preRender.addEventListener(() => {
      this.setState({
        heading: Cesium.Math.toDegrees(hpRoll.heading),
        pitch: Cesium.Math.toDegrees(hpRoll.pitch),
        roll: Cesium.Math.toDegrees(hpRoll.roll)
      })
    })
  }

  render() {
    const { heading, pitch, roll } = this.state
    return (
      <div id="LocalToFixedFrame">
        <div className="toolbar">
          <p>Heading: {heading.toFixed(1)}</p>
          <p>← to left/→ to right</p>
          <p>Pitch: {pitch.toFixed(1)}</p>
          <p>↑ to up/↓ to down</p>
          <p>Roll: {roll.toFixed(1)}</p>
          <p>← + ⇧ left/→ + ⇧ right</p>
        </div>
        <div id="stage"></div>
      </div>
    )
  }
}

/**
 * Let canvas element focus.
 *
 * @param {HTMLCanvasElement} canvas
 */
function foucusCanvas(canvas) {
  canvas.setAttribute('tabindex', '0')
  canvas.addEventListener('click', () => canvas.focus())
  canvas.focus()
}

export default LocalToFixedFrame
