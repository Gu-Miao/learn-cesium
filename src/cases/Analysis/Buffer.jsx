import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'
import Toolbar from '@/cases/components/Toolbar/Toolbar'
import useCesium from '@/hooks/useCesium'
import { ScreenSpaceEventType } from 'cesium'
import { Form, InputNumber, Button, Row, Col } from 'rsuite'
import { useState } from 'react'

const formDefaultValue = { radius: 100 }
const formWidth = 240

function Buffer() {
  const [formValue, setFormValue] = useState(formDefaultValue)
  const [active, setActive] = useState(0)
  const viewerRef = useCesium(viewer => {
    viewer.clock.shouldAnimate = true
    viewer.scene.postProcessStages.fxaa.enabled = true

    viewer.screenSpaceEventHandler.setInputAction(movement => {
      console.log(active)
    }, ScreenSpaceEventType.LEFT_CLICK)

    viewer.screenSpaceEventHandler.setInputAction(movement => {}, ScreenSpaceEventType.MOUSE_MOVE)

    viewer.screenSpaceEventHandler.setInputAction(movement => {}, ScreenSpaceEventType.RIGHT_CLICK)
  })

  function changeActive(active) {
    const viewer = viewerRef.current
    if (!viewer) return

    viewer.entities.removeAll()
    setActive(active)
  }

  return (
    <CesiumContainer>
      <Toolbar>
        <Form
          formValue={formValue}
          onChange={formvalue => setFormValue({ ...formvalue })}
          formDefaultValue={formDefaultValue}
          style={{ width: formWidth }}
        >
          <Form.Group style={{ marginBottom: 10 }}>
            <Form.ControlLabel>radius:</Form.ControlLabel>
            <Form.Control
              style={{ width: formWidth }}
              name="radius"
              accepter={InputNumber}
              size="sm"
              min={0}
              step={10}
            />
          </Form.Group>
          <Row style={{ marginBottom: 10 }}>
            <Col xs={8}>
              <Button
                appearance="primary"
                type="submit"
                size="sm"
                block
                onClick={() => changeActive(0)}
              >
                Point
              </Button>
            </Col>
            <Col xs={8}>
              <Button type="button" size="sm" block onClick={() => changeActive(1)}>
                Polyline
              </Button>
            </Col>
            <Col xs={8}>
              <Button type="button" size="sm" block onClick={() => changeActive(2)}>
                Polygon
              </Button>
            </Col>
          </Row>
          <em style={{ display: [1, 2].includes(active) ? 'block' : '' }}>
            Left click to <b style={{ color: 'orange' }}>set position point</b>, right click to{' '}
            <b style={{ color: 'orange' }}>draw the buffer graphic</b>.
          </em>
        </Form>
      </Toolbar>
    </CesiumContainer>
  )
}

export default Buffer
