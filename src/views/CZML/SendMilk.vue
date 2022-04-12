<template>
  <CesiumContainer />
</template>

<script setup lang="ts">
import {
  createWorldTerrain,
  Color,
  JulianDate,
  CzmlDataSource,
  Cartesian3,
  Math as CesiumMath,
  Transforms,
  Matrix4,
  HeadingPitchRoll,
  Quaternion,
  HeightReference,
  ConstantProperty,
  ModelGraphics,
  Entity
} from 'cesium'
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'
import milkTruck from '@/assets/models/milk_truck.glb?url'
import { getHeadingDegree, getViewFrom, getMetersPerSecond } from '@/utils'
import milkPath from '@/assets/json/milk_path.json'

useCesium(async viewer => {
  viewer.terrainProvider = createWorldTerrain()
  viewer.scene.globe.depthTestAgainstTerrain = true
  viewer.clock.shouldAnimate = true

  const speed: number = getMetersPerSecond(45)
  const turnTime = 0.5
  const id = 'truck'

  const cartesians = Cartesian3.fromDegreesArray(milkPath.flat())
  const { length } = cartesians
  const distances: number[] = [0]
  const headings: number[] = []
  let viewFrom!: [number, number, number]
  const lastIndex = length - 1
  let i = 0
  while (i < length) {
    // Here to get distance pices, heading for every two positions.
    // Because the number of sections is one less than the number
    // of position data, So distance should start with 0, and the last
    // item of headings should be same as the penult.

    const p1 = cartesians[i === lastIndex ? i - 1 : i]
    const p2 = cartesians[i === lastIndex ? i : i + 1]

    const localToWorldMatrix = Transforms.eastNorthUpToFixedFrame(p1)
    const worldToLocalMatrix = Matrix4.inverse(localToWorldMatrix, new Matrix4())

    const lp1 = Matrix4.multiplyByPoint(worldToLocalMatrix, p1, new Cartesian3())
    const lp2 = Matrix4.multiplyByPoint(worldToLocalMatrix, p2, new Cartesian3())

    const heading = getHeadingDegree(lp1, lp2)
    headings.push(heading)

    if (i === 0) {
      viewFrom = getViewFrom(lp1, lp2, heading, -20, 20)
    }
    if (i < lastIndex) {
      distances.push(Cartesian3.distance(lp1, lp2))
    }

    i++
  }

  const cartographicDegrees = []
  const unitQuaternion = []
  let prevOrientation: Quaternion | null = null
  let duration = 0
  let j = 0
  while (j < length) {
    // Get a quaternion to specify heading, pitch and roll.
    const orientation = Transforms.headingPitchRollQuaternion(
      cartesians[j],
      new HeadingPitchRoll(
        CesiumMath.toRadians(headings[j] - 90),
        CesiumMath.toRadians(0), // todo
        CesiumMath.toRadians(0) // todo
      )
    )
    const { x, y, z, w } = orientation

    // Suppose the vehicle is moving in a straight line at
    // a constant speed.
    const time = j ? distances[j] / speed : 0

    duration += time
    cartographicDegrees.push(duration, ...milkPath[j], 0)

    if (prevOrientation) {
      // Cesium will automatically do the time interpolation
      // calculation. So when model moves along a straight
      // line, the orientation will linearly change, this is
      // obviously a wrong behavior. Therefore, we should
      // insert another  orientation value a little bit of
      // time before the time of arrival in the second point,
      // and the value should consistent with the previous
      // point so that we could get more realistic effect
      // when turning model.
      const { x, y, z, w } = prevOrientation

      // Here, the time is generally taken as the current
      // accumulation time minus the turning time. However,
      // if the time consumption of this section is less than
      // the turning time, the current accumulation time is
      // directly taken.
      unitQuaternion.push(time > turnTime ? duration - turnTime : duration, x, y, z, w)
    }
    unitQuaternion.push(duration, x, y, z, w)
    prevOrientation = orientation

    j++
  }

  const start = JulianDate.now()
  const startISO = JulianDate.toIso8601(start)
  const end = JulianDate.addSeconds(start, duration, new JulianDate())
  const endISO = JulianDate.toIso8601(end)
  const czml = [
    {
      id: 'document',
      name: 'Sending Milk',
      version: '1.0',
      clock: {
        interval: `${startISO}/${endISO}`,
        currentTime: startISO,
        multiplier: 1,
        range: 'UNBOUNDED'
      }
    },
    {
      id,
      name: 'Sending Milk',
      model: {
        gltf: milkTruck
      },
      position: {
        epoch: startISO,
        cartographicDegrees
      },
      orientation: {
        epoch: startISO,
        unitQuaternion
      },
      viewFrom: {
        cartesian: viewFrom
      }
    }
  ]

  CzmlDataSource.load(czml).then(dataSource => {
    viewer.dataSources.add(dataSource)
    const entity = dataSource.entities.getById(id) as Entity
    const model = entity.model as ModelGraphics
    model.heightReference = new ConstantProperty(HeightReference.CLAMP_TO_GROUND)
  })

  viewer.entities.add({
    polyline: {
      positions: cartesians,
      material: Color.YELLOW,
      clampToGround: true,
      width: 10
    }
  })
  viewer.camera.setView({
    destination: new Cartesian3(-2589434.2968667294, 4748887.878613406, 3368727.681156099),
    orientation: {
      up: new Cartesian3(0.04844650651821759, 0.8437194661262776, 0.5345936760622685),
      direction: new Cartesian3(0.992550991939435, 0.019232905821419066, -0.12030221832413693)
    }
  })
})
</script>
