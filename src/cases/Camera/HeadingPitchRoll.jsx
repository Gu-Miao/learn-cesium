import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'
import Toolbar from '@/cases/components/Toolbar/Toolbar'
import { Form, InputNumber, Row, Col, Button, ButtonToolbar } from 'rsuite'
import { useState } from 'react'
import { Cartesian3, Color, Transforms, Matrix4, Math as CesiumMath } from 'cesium'
import viewerCesiumNavigationMixin from 'cesium-navigation-es6'
import { getHeadingPitchRoll } from '@/utils/cesium'

/** Create random integer between 0~1000 */
function createRandomInteger() {
  return parseInt((Math.random() - 0.5) * 1000)
}

/** Create random cartesian3 */
function createRandomOffset() {
  return new Cartesian3(createRandomInteger(), createRandomInteger(), createRandomInteger())
}

function InputItem({ name }) {
  return (
    <Col xs={8}>
      <Form.Group>
        <Form.ControlLabel>{name.toUpperCase()}:</Form.ControlLabel>
        <Form.Control
          style={{ width: '100%' }}
          name={name}
          accepter={InputNumber}
          size="sm"
          min={-500}
          max={500}
        />
      </Form.Group>
    </Col>
  )
}

const formDefaultValue = { x: '0', y: '0', z: '0' }
const position = Cartesian3.fromDegrees(136.66, 35.8934, 1500)
const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(position)
const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())
const localPosition = Matrix4.multiplyByPoint(worldToLocalMatrix, position, new Cartesian3())

function HeadingPitchRoll() {
  const [formValue, setFormValue] = useState(formDefaultValue)
  const viewerRef = useCesium(viewer => {
    viewerCesiumNavigationMixin(viewer)
    resetCamera()
  })

  // Reset view of camera.
  function resetCamera() {
    const viewer = viewerRef.current
    if (!viewer) return

    viewer.camera.flyTo({
      destination: position,
      orientation: {
        heading: 0,
        pitch: 0,
        roll: 0
      }
    })
  }

  /**
   * Create point entity.
   *
   * @param {Cartesian3} position The position to set point.
   * @returns {Entity}
   */
  function createPoint(position) {
    const viewer = viewerRef.current
    if (!viewer) return

    return viewer.entities.add({
      position,
      ellipsoid: {
        radii: new Cartesian3(5, 5, 5),
        material: Color.fromBytes(
          Math.abs(position.x),
          Math.abs(position.y),
          Math.abs(position.z),
          255
        )
      }
    })
  }

  /**
   * Create a point and look at it.
   *
   * @param {Cartesian3} offset Relative offset cartesian3.
   */
  function createPointAndLook(offset) {
    const viewer = viewerRef.current
    if (!viewer) return

    const pointLocalPosition = Cartesian3.add(localPosition, offset, new Cartesian3())
    const pointPosition = Matrix4.multiplyByPoint(
      localToWorldMatrix,
      pointLocalPosition,
      new Cartesian3()
    )

    const { heading, pitch, roll } = getHeadingPitchRoll(localPosition, pointLocalPosition)

    createPoint(pointPosition)

    viewer.camera.flyTo({
      destination: position,
      orientation: {
        heading: CesiumMath.toRadians(heading),
        pitch: CesiumMath.toRadians(pitch),
        roll: CesiumMath.toRadians(roll)
      }
    })
  }

  /**
   * Remove all point entities.
   */
  function clearAllPoints() {
    const viewer = viewerRef.current
    if (!viewer) return

    viewer.entities.removeAll()
  }

  return (
    <CesiumContainer>
      <Toolbar>
        <Form
          formValue={formValue}
          onChange={formvalue => setFormValue({ ...formvalue })}
          onSubmit={() => {
            const { x, y, z } = formValue
            createPointAndLook(new Cartesian3(parseFloat(x), parseFloat(y), parseFloat(z)))
          }}
          formDefaultValue={formDefaultValue}
          style={{ width: 240 }}
        >
          <Row style={{ marginBottom: 10 }}>
            <InputItem name="x" />
            <InputItem name="y" />
            <InputItem name="z" />
          </Row>
          <ButtonToolbar>
            <Button appearance="primary" type="submit" size="sm" block>
              Create Point
            </Button>
            <Button
              type="button"
              size="sm"
              block
              onClick={() => {
                const offset = createRandomOffset()
                const { x, y, z } = offset
                createPointAndLook(offset)
                setFormValue({ x, y, z })
              }}
            >
              Create Random Point
            </Button>
            <Button
              appearance="primary"
              color="red"
              type="button"
              size="sm"
              block
              onClick={clearAllPoints}
            >
              Clear all points
            </Button>
            <Button type="button" size="sm" block onClick={resetCamera}>
              Reset Camera
            </Button>
          </ButtonToolbar>
        </Form>
      </Toolbar>
    </CesiumContainer>
  )
}

export default HeadingPitchRoll
