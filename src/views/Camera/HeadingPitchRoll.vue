<template>
  <CesiumContainer class="hpr">
    <Toolbar>
      <NForm :model="formValue">
        <NFormItem label="Offset X" path="x" size="small" label-style="color: #fff;">
          <NInputNumber
            v-model:value="formValue.x"
            placeholder="x"
            :min="-maxOffset"
            :max="maxOffset"
            :step="20"
          />
        </NFormItem>
        <NFormItem label="Offset Y" path="y" size="small" label-style="color: #fff;">
          <NInputNumber
            v-model:value="formValue.y"
            placeholder="y"
            :min="-maxOffset"
            :max="maxOffset"
            :step="20"
          />
        </NFormItem>
        <NFormItem label="Offset Z" path="z" size="small" label-style="color: #fff;">
          <NInputNumber
            v-model:value="formValue.z"
            placeholder="z"
            :min="-maxOffset"
            :max="maxOffset"
            :step="20"
          />
        </NFormItem>
        <NButton type="info" block @click="createPointByPosition">Create Point</NButton>
        <NButton type="primary" block @click="createRandomPoint"> Create Random Point </NButton>
        <NButton type="error" block @click="clearAllPoints"> Clear all points </NButton>
        <NButton type="info" block @click="resetCamera"> Reset Camera </NButton>
      </NForm>
    </Toolbar>
  </CesiumContainer>
</template>

<script setup lang="ts">
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'
import Toolbar from '@/components/Toolbar.vue'
import { NForm, NFormItem, NInputNumber, NButton } from 'naive-ui'
import { Cartesian3, Color, Transforms, Matrix4, Math as CesiumMath } from 'cesium'
import viewerCesiumNavigationMixin from 'cesium-navigation-es6'
import { getHeadingPitchRoll, getFixedNumber, createRandomNumber } from '@/utils'
import { ref } from 'vue'

const position = Cartesian3.fromDegrees(136.66, 35.8934, 1500)
const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(position)
const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())
const localPosition = Matrix4.multiplyByPoint(worldToLocalMatrix, position, new Cartesian3())
const maxOffset = 1000

const formValue = ref({ x: 0, y: 0, z: 0 })
const viewerRef = useCesium(viewer => {
  new viewerCesiumNavigationMixin(viewer, {})
  resetCamera()
})

/** Create random float */
function createRandomFloat() {
  return getFixedNumber(createRandomNumber(-maxOffset, maxOffset), 2)
}

/** Create random cartesian3. */
function createRandomOffset() {
  return new Cartesian3(createRandomFloat(), createRandomFloat(), createRandomFloat())
}

/** Create point by position. */
function createPointByPosition() {
  const { x, y, z } = formValue.value
  const position = new Cartesian3(x, y, z)
  createPointAndLook(position)
}

/** Create point by random position. */
function createRandomPoint() {
  const offset = createRandomOffset()
  createPointAndLook(offset)
  const { x, y, z } = offset
  formValue.value.x = x
  formValue.value.y = y
  formValue.value.z = z
}

/** Reset view of camera. */
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
        Math.abs(position.x % 255),
        Math.abs(position.y % 255),
        Math.abs(position.z % 255),
        255
      )
    }
  })
}

/**
 * Create a point and look at it.
 * @param offset Relative offset cartesian3.
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

/** Remove all point entities. */
function clearAllPoints() {
  const viewer = viewerRef.current
  if (!viewer) return

  viewer.entities.removeAll()
}
</script>

<style lang="less">
.hpr {
  .n-form-item-feedback-wrapper {
    min-height: 6px;
  }
  button {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
