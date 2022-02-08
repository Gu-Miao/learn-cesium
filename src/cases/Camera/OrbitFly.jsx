import { useState } from 'react'
import CesiumContainer from '@/cases/components/CesiumContainer/CesiumContainer'
import Toolbar from '@/cases/components/Toolbar/Toolbar'
import useCesium from '@/hooks/useCesium'
import { Cartesian3, JulianDate, Math as CesiumMath, ClockStep, ClockRange } from 'cesium'
import { Button } from 'rsuite'

const startDegrees = [-85.0, 36.0, 1000.0]
const startPosition = Cartesian3.fromDegrees(...startDegrees)

const OrbitFly = () => {
  const viewerRef = useCesium()
  const [flying, setFlying] = useState(false)

  function oribtFly() {
    const viewer = viewerRef.current
    if (!viewer) return

    const { clock } = viewer

    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
    const pitch = CesiumMath.toRadians(-30)
    // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
    const angle = 360 / 5
    // 给定相机距离点多少距离飞行，这里取值为5000m
    const distance = 15000
    const startTime = JulianDate.fromDate(new Date())

    const stopTime = JulianDate.addSeconds(startTime, 5, new JulianDate())

    clock.startTime = startTime.clone() // 开始时间
    clock.stopTime = stopTime.clone() // 结速时间
    clock.currentTime = startTime.clone() // 当前时间
    clock.clockRange = ClockRange.CLAMPED // 行为方式
    clock.clockStep = ClockStep.SYSTEM_CLOCK // 时钟设置为当前系统时间; 忽略所有其他设置。
    // 相机的当前heading
    const initialHeading = viewer.camera.heading
    const Exection = () => {
      // 当前已经过去的时间，单位s
      const delTime = JulianDate.secondsDifference(clock.currentTime, clock.startTime)
      const heading = CesiumMath.toRadians(delTime * angle) + initialHeading
      viewer.scene.camera.setView({
        destination: startPosition,
        orientation: {
          heading: heading,
          pitch: pitch
        }
      })
      viewer.scene.camera.moveBackward(distance)
      if (JulianDate.compare(clock.currentTime, clock.stopTime) >= 0) {
        clock.onTick.removeEventListener(Exection)
        setFlying(false)
      }
    }
    setFlying(true)
    clock.onTick.addEventListener(Exection)
  }

  return (
    <CesiumContainer>
      <Toolbar>
        <Button appearance="primary" size="sm" onClick={oribtFly} disabled={flying}>
          {flying ? 'Flying' : 'Orbit Fly'}
        </Button>
      </Toolbar>
    </CesiumContainer>
  )
}

export default OrbitFly
