<template>
  <CesiumContainer />
</template>

<script setup lang="ts">
import {
  JulianDate,
  CzmlDataSource,
  Cartesian3,
  //@ts-ignore
  Check,
  //@ts-ignore
  ApproximateTerrainHeights,
  defined,
  DataSource
} from 'cesium'
import useCesium from '@/hooks/useCesium'
import CesiumContainer from '@/components/CesiumContainer.vue'

type LoopOptions = {
  start: number
  end: number
  duration: number
}

interface CzmlDataSources extends CzmlDataSource {
  loop?: LoopOptions
}

interface DataSources extends DataSource {
  loop?: LoopOptions
}

useCesium(async viewer => {
  viewer.clock.shouldAnimate = true
  const duration = 30
  const id = 'path'
  const startDegrees = [115.32415, 36.157965, 88.5]
  const endDegrees = [115.452157, 36.0943875, 76.33]
  const start = JulianDate.now()
  const startISO = JulianDate.toIso8601(start)
  const startMs = JulianDate.toDate(start).getTime()
  const end = JulianDate.addSeconds(start, duration, new JulianDate())
  const endISO = JulianDate.toIso8601(end)
  const endMs = JulianDate.toDate(end).getTime()
  const czml = [
    {
      id: 'document',
      name: 'CZML Path',
      version: '1.0',
      clock: {
        interval: `${startISO}/${endISO}`,
        currentTime: startISO,
        multiplier: -5,
        range: 'UNBOUNDED'
      }
    },
    {
      id,
      name: 'A czml path',
      path: {
        material: {
          solidColor: {
            color: {
              rgba: [255, 0, 0, 255]
            }
          }
        },
        width: 8,
        leadTime: 10,
        trailTime: 10,
        resolution: 5
      },
      point: {
        color: {
          rgba: [255, 255, 255, 255]
        },
        pixelSize: 20
      },
      position: {
        epoch: startISO,
        cartographicDegrees: [0, ...startDegrees, duration, ...endDegrees]
      }
    }
  ]

  viewer.camera.setView({
    destination: new Cartesian3(-2216967.897895651, 4670068.057300466, 3739467.7760569644),
    orientation: {
      up: new Cartesian3(-0.03622449844129105, -0.08136874107458908, 0.9960255587526926),
      direction: new Cartesian3(0.3888840924668125, -0.9192680097065957, -0.060954810772718575)
    }
  })

  const dataSource: CzmlDataSources = await CzmlDataSource.load(czml)

  dataSource.loop = { start: startMs, end: endMs, duration: duration * 1000 }
  viewer.dataSources.add(dataSource)

  viewer.dataSourceDisplay.update = function (time) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined('time', time)
    //>>includeEnd('debug');

    if (!ApproximateTerrainHeights.initialized) {
      //@ts-ignore
      this._ready = false
      return false
    }
    let result = true

    const date = JulianDate.toDate(time)
    const unix = date.getTime()

    let i
    let x
    let t
    let visualizers
    let vLength
    //@ts-ignore
    const dataSources = this._dataSourceCollection
    const length = dataSources.length
    for (i = 0; i < length; i++) {
      const dataSource = dataSources.get(i) as DataSources
      if (defined(dataSource.update)) {
        result = dataSource.update(time) && result
      }

      t = time

      if (dataSource.loop) {
        const { start, end, duration } = dataSource.loop
        if (unix > end) {
          const newTime = new Date()
          newTime.setTime(((unix - start) % duration) + start)
          t = JulianDate.fromDate(newTime, new JulianDate())
        } else if (unix < start) {
          const newTime = new Date()
          newTime.setTime(((unix - end) % duration) + end)
          t = JulianDate.fromDate(newTime, new JulianDate())
        }
      }

      //@ts-ignore
      visualizers = dataSource._visualizers
      vLength = visualizers.length
      for (x = 0; x < vLength; x++) {
        result = visualizers[x].update(t) && result
      }
    }

    //@ts-ignore
    visualizers = this._defaultDataSource._visualizers
    vLength = visualizers.length
    for (x = 0; x < vLength; x++) {
      result = visualizers[x].update(time) && result
    }

    //@ts-ignore
    this._ready = result

    return result
  }
})
</script>
