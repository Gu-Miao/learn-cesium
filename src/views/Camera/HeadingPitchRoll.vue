<template>
  <CesiumContainer>
    <Toolbar>
      <NForm :model="formValue" ref="formRef">
        <NFormItem label="x" path="x">
          <NInput v-model:value="formValue.x" placeholder="x" />
        </NFormItem>
        <NFormItem label="y" path="y">
          <NInput v-model:value="formValue.y" placeholder="y" />
        </NFormItem>
        <NFormItem label="z" path="z">
          <NInput v-model:value="formValue.z" placeholder="z" />
        </NFormItem>
        <NButton appearance="primary"> Create Point </NButton>
        <NButton
          @click="
            () => {
              const offset = createRandomOffset()
              const { x, y, z } = offset
              createPointAndLook(offset)
            }
          "
        >
          Create Random Point
        </NButton>
        <NButton type="primary" @click="clearAllPoints"> Clear all points </NButton>
        <NButton @click="resetCamera"> Reset Camera </NButton>
      </NForm>
    </Toolbar>
  </CesiumContainer>
</template>

<script setup lang="ts">
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'
import Toolbar from '@/components/Toolbar.vue'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { Cartesian3, Color, Transforms, Matrix4, Math as CesiumMath } from 'cesium'
import viewerCesiumNavigationMixin from 'cesium-navigation-es6'
import { getHeadingPitchRoll } from '@/utils/cesium'
import { ref } from 'vue'
import type { FormInst } from 'naive-ui'

const formRef = ref<FormInst | null>(null)

/** Create random integer between 0~1000 */
function createRandomInteger() {
  return Math.floor((Math.random() - 0.5) * 1000)
}

/** Create random cartesian3 */
function createRandomOffset() {
  return new Cartesian3(createRandomInteger(), createRandomInteger(), createRandomInteger())
}

// function InputItem({ name }) {
//   return (
//     <Col xs={8}>
//       <Form.Group>
//         <Form.ControlLabel>{name.toUpperCase()}:</Form.ControlLabel>
//         <Form.Control
//           style={{ width: '100%' }}
//           name={name}
//           accepter={InputNumber}
//           size="sm"
//           min={-500}
//           max={500}
//         />
//       </Form.Group>
//     </Col>
//   )
// }

const formDefaultValue = { x: '0', y: '0', z: '0' }
const position = Cartesian3.fromDegrees(136.66, 35.8934, 1500)
const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(position)
const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())
const localPosition = Matrix4.multiplyByPoint(worldToLocalMatrix, position, new Cartesian3())

const formValue = ref(formDefaultValue)
const viewerRef = useCesium(viewer => {
  new viewerCesiumNavigationMixin(viewer, {})
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
 * @param position The position to set point.
 */
function createPoint(position: Cartesian3) {
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
 * @param  offset Relative offset cartesian3.
 */
function createPointAndLook(offset: Cartesian3) {
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
</script>

<style lang="less">
.n-form-item .n-form-item-label {
  color: #fff !important;
}
</style>
