import React, { Component } from 'react'
import Cesium from '@utils/cesium'

const startPosition = [-85.0, 36.0, 1000.0]

const start = Cesium.Cartesian3.fromDegrees(...startPosition)

class RotateFly extends Component {
  fly = () => {
    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
    const pitch = Cesium.Math.toRadians(-30)
    // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
    const angle = 360 / 5
    // 给定相机距离点多少距离飞行，这里取值为5000m
    const distance = 15000
    const startTime = Cesium.JulianDate.fromDate(new Date())

    const stopTime = Cesium.JulianDate.addSeconds(startTime, 5, new Cesium.JulianDate())

    this.clock.startTime = startTime.clone() // 开始时间
    this.clock.stopTime = stopTime.clone() // 结速时间
    this.clock.currentTime = startTime.clone() // 当前时间
    this.clock.clockRange = Cesium.ClockRange.CLAMPED // 行为方式
    this.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK // 时钟设置为当前系统时间; 忽略所有其他设置。
    // 相机的当前heading
    const initialHeading = this.viewer.camera.heading
    const Exection = () => {
      // 当前已经过去的时间，单位s
      const delTime = Cesium.JulianDate.secondsDifference(
        this.clock.currentTime,
        this.clock.startTime
      )
      const heading = Cesium.Math.toRadians(delTime * angle) + initialHeading
      this.viewer.scene.camera.setView({
        destination: start,
        orientation: {
          heading: heading,
          pitch: pitch
        }
      })
      this.viewer.scene.camera.moveBackward(distance)
      if (Cesium.JulianDate.compare(this.clock.currentTime, this.clock.stopTime) >= 0) {
        this.clock.onTick.removeEventListener(Exection)
      }
    }
    this.clock.onTick.addEventListener(Exection)
  }
  componentDidMount() {
    this.viewer = new Cesium.Viewer('stage')

    this.clock = this.viewer.clock
    this.scene = this.viewer.scene
    this.camera = this.scene.camera

    this.camera.flyTo({
      destination: start,
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: Cesium.Math.toRadians(0.0)
      }
    })
  }
  render() {
    return (
      <>
        <div id="stage"></div>
        <button
          style={{ position: 'absolute', zIndex: 9999, top: 10, left: 10 }}
          onClick={this.fly}
        >
          fly
        </button>
      </>
    )
  }
}

export default RotateFly
