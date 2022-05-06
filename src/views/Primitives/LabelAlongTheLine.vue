<template>
  <CesiumContainer />
</template>

<script setup lang="ts">
import {
  Cartesian3,
  Primitive,
  GeometryInstance,
  LabelCollection,
  HorizontalOrigin,
  PolylineColorAppearance,
  ColorGeometryInstanceAttribute,
  PolylineGeometry,
  DistanceDisplayCondition,
  Color,
  BlendOption,
  OpenStreetMapImageryProvider
} from 'cesium'
import { increaseHeight } from 'cesium-toolkit'
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'

useCesium(viewer => {
  viewer.imageryLayers.removeAll()
  viewer.imageryLayers.addImageryProvider(new OpenStreetMapImageryProvider({}))

  const names = [
    '光',
    '安',
    '民',
    '龙',
    '建',
    '平',
    '和',
    '风',
    '广',
    '兴',
    '隆',
    '万',
    '晴',
    '秀',
    '四',
    '东',
    '七',
    '天',
    '阳',
    '明',
    '顺',
    '理',
    '文',
    '胜',
    '武'
  ]
  const names1 = [
    '路',
    '街',
    '大街',
    '西路',
    '中路',
    '东路',
    '北街',
    '北大街',
    '中街',
    '南街',
    '南大街'
  ]
  const l = names.length
  const l1 = names1.length

  function createDegrees() {
    const length = Math.round(Math.random() * 100) + 2
    const m1 = Math.random() > 0.5 ? 1 : -1
    const m2 = Math.random() > 0.5 ? 1 : -1
    let startLon = -90 + m1 * 90 * Math.random()
    let startLat = 36 + m2 * 45 * Math.random()

    const degrees = []

    let i = 0
    const m3 = Math.random() > 0.5 ? 1 : -1
    const m4 = Math.random() > 0.5 ? 1 : -1
    while (i < length) {
      startLon += Math.random() * 0.15 * m3
      startLat += Math.random() * 0.1 * m4
      degrees.push(startLon, startLat)
      i++
    }

    return degrees
  }

  const labels = new LabelCollection({ blendOption: BlendOption.TRANSLUCENT })
  viewer.scene.primitives.add(labels)
  const geometryInstances: GeometryInstance[] = []
  const distanceDisplayCondition = new DistanceDisplayCondition(0, 2000000)
  const color = ColorGeometryInstanceAttribute.fromColor(Color.RED)

  for (let i = 0; i < 200; i++) {
    const first = names[Math.floor(Math.random() * l)]
    const scend = names[Math.floor(Math.random() * l)]
    const last = names1[Math.floor(Math.random() * l1)]
    const name = `${first}${scend}${last}`

    createRoadAndName(name)
  }

  viewer.scene.primitives.add(
    new Primitive({
      geometryInstances,
      appearance: new PolylineColorAppearance()
    })
  )

  /**
   * 创建道路 Entity 及其名称 Label
   *
   * @param name 道路名称
   */
  function createRoadAndName(name: string) {
    const degrees = createDegrees()
    const positions = Cartesian3.fromDegreesArray(degrees)

    // 将根据数据生成的 geometryInstance 推入数组中
    geometryInstances.push(
      new GeometryInstance({
        geometry: new PolylineGeometry({
          positions,
          width: 3,
          vertexFormat: PolylineColorAppearance.VERTEX_FORMAT
        }),
        attributes: {
          color
        }
      })
    )

    /** 道路总长度 */
    let total = 0
    /**  每段道路长度 */
    const distances: number[] = []
    /** 从起始点到当前位置的距离 */
    const distanceSums: number[] = []

    // 遍历点位数据以求得道路总长度，每段道路长度和从起始点到当前位置的距离，
    // 并将它们保存起来
    for (let i = 0; i < positions.length - 1; ++i) {
      const start = positions[i]
      const end = positions[i + 1]
      const distance = Cartesian3.distance(start, end)
      // console.log(distance)
      distances.push(distance)
      total += distance
      distanceSums.push(total)
    }

    /** 道路总长度的一半 */
    const totalOverTwo = total / 2
    /** 道路名称长度 */
    const { length } = name
    /** 每两个 label 之间的距离，总距离为道路总长的五分之一 */
    const diff = (total * 0.2) / (length - 1)

    // 想求得每个字的 label 所处的位置，需先求得其位置距起点的距离，现已规定两字之间距离为 diff，
    // 则可用道路总长的一半去加减一定倍数（设此倍数为 n）的 diff 算出
    //
    // 如果名称长度为奇数，以 5 为例：
    //     0    1    2    3    4    名称索引 i
    // ----x----x----x----x----x----
    //     -2   -1   0    1    2    倍数 n
    //
    // 若名称长度为偶数，以 4 为例：
    //      0     1     2     3     名称索引 i
    // -----x-----x-----x-----x-----
    //    -1.5  -0.5   0.5   1.5    倍数 n
    //
    // 从上图易得，倍数 n = i - (length - 1) / 2，索引 i 当写于循环之中，因而将中间量先算出，用一
    // 变量保存，方便调用

    /** 计算当前 label 位置到起始点距离的中间量 */
    const m = (length - 1) / 2

    /** 保存内层循环位置 */
    let startJ = 0

    for (let i = 0; i < length; ++i) {
      /** 从起始位置到当前 label 位置的距离 */
      const startToCurrent = totalOverTwo + (i - m) * diff

      // 遍历 distanceSums 数组，找到大于 startToCurrent 的值，再通过其索引
      // 可确定 label 的位置处于哪两个点位之间
      for (let j = startJ; j < distanceSums.length; ++j) {
        const sum = distanceSums[j]
        if (sum >= startToCurrent) {
          // 先计算出 label 位置与点 p1 之间的距离 Δd：
          // p1----Δd-----label------p2
          //
          // 再算得其距离占两点间距得百分比，接着即可通过插值计算出 label 得具体
          // 位置了
          const deltaDistance = sum - startToCurrent
          const p1 = positions[j]
          const p2 = positions[j + 1]
          const distance = distances[j]
          const precent = deltaDistance / distance
          const position = Cartesian3.lerp(p2, p1, precent, new Cartesian3())
          labels.add({
            text: name[i],
            font: '24px sans-serif',
            fillColor: new Color(0.1, 0.1, 0.1, 0.9),
            horizontalOrigin: HorizontalOrigin.CENTER,
            distanceDisplayCondition,
            position: increaseHeight(position, 200)
          })

          // 因为每个 label 到起始点得位置是递增的，因而遍历 distanceSums 时，除首次
          // 循环，剩余循环不必从 0 开始，从当前位置开始即可。
          startJ = j

          break
        }
      }
    }
  }
})
</script>
