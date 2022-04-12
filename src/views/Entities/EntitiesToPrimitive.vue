<template>
  <CesiumContainer>
    <Toolbar>
      <NInputNumber class="mb" v-model:value="count" :min="0" :step="100" />
      <NButton class="mb" type="primary" @click="createEntities" block>Create Entities</NButton>
      <NButton type="error" @click="convertToPrimitive" block
        >Convert Entities to Primitive</NButton
      >
    </Toolbar>
  </CesiumContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Cartesian3,
  PolygonHierarchy,
  Color,
  CustomDataSource,
  Primitive,
  PolygonGeometry,
  WallGeometry,
  GeometryInstance,
  Entity,
  Property,
  PolygonGraphics,
  MaterialAppearance,
  Material,
  JulianDate
} from 'cesium'
import useCesium from '@/hooks/useCesium'
import { createRandomNumber, getRegularPolygonPositions } from '@/utils'
import CesiumContainer from '@/components/CesiumContainer.vue'
import Toolbar from '@/components/Toolbar.vue'
import { NInputNumber, NButton } from 'naive-ui'

const count = ref(5000)
const dataSource = new CustomDataSource()
let primitive: Primitive | null = null

const viewerRef = useCesium(viewer => {
  viewer.camera.setView({
    destination: new Cartesian3(-2584605.4654915673, 4475348.524553295, 3728355.3229265413),
    orientation: {
      up: new Cartesian3(-0.07822386399328737, 0.13544777297011318, 0.987691717034924),
      direction: new Cartesian3(0.49395504622928466, -0.855303069212324, 0.15641314554922708)
    }
  })
  viewer.dataSources.add(dataSource)
})

/** Create entities. */
function createEntities() {
  const viewer = viewerRef.current
  if (!viewer) return

  clean()

  const longitude = 120
  const latitude = 36
  let i = 0
  while (i++ < Math.round(count.value)) {
    const cetner = Cartesian3.fromDegrees(
      longitude + createRandomNumber(-0.05, 0.05),
      latitude + createRandomNumber(-0.03, 0.03)
    )
    const sides = Math.floor(createRandomNumber(3, 25))

    const radius = createRandomNumber(30, 80)
    const positions = getRegularPolygonPositions(cetner, radius, sides)

    dataSource.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(positions),
        material: Color.WHITE,
        extrudedHeight: createRandomNumber(200, 1500)
      }
    })
  }
}

type PolygonEntity = Entity & {
  polygon: Required<PolygonGraphics> & {
    hierarchy: Property
    extrudedHeight: Property
  }
}

/** Convert entities to primitives */
function convertToPrimitive() {
  const viewer = viewerRef.current
  if (!viewer) return

  const { entities } = dataSource
  const { length } = entities.values

  const geometryInstances = []

  let i = 0
  while (i++ < length) {
    const entity = entities.values[i - 1] as PolygonEntity
    const { polygon } = entity

    const hierarchy = polygon.hierarchy.getValue(new JulianDate()) as PolygonHierarchy
    const height = polygon.extrudedHeight.getValue(new JulianDate()) as number
    const { positions } = hierarchy
    geometryInstances.push(
      new GeometryInstance({
        geometry: new PolygonGeometry({
          polygonHierarchy: hierarchy,
          height
        })
      }),
      new GeometryInstance({
        geometry: new WallGeometry({
          positions,
          minimumHeights: new Array(positions.length).fill(0),
          maximumHeights: new Array(positions.length).fill(height)
        })
      })
    )
  }

  clean()
  primitive = new Primitive({
    geometryInstances,
    appearance: new MaterialAppearance({
      material: Material.fromType(Material.ColorType, {
        color: Color.WHITE
      })
    })
  })
  viewer.scene.primitives.add(primitive)
}

/** Clean function. */
function clean() {
  const viewer = viewerRef.current
  if (!viewer) return

  dataSource.entities.removeAll()
  if (primitive) {
    viewer.scene.primitives.remove(primitive)
    primitive = null
  }
}
</script>

<style scoped>
.mb {
  margin-bottom: 6px;
}
</style>
