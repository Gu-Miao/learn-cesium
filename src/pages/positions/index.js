import React, { Component } from 'react'
import Cesium from '@utils/cesium'

const position = [-117, 36]

class Positions extends Component {
  componentDidMount() {
    this.viewer = new Cesium.Viewer('stage')
    this.entities = this.viewer.entities
    this.viewer.scene.debugShowFramesPerSecond = true
  }
  createPoint = position => {
    this.entities.add({
      position,
      ellipsoid: {
        radii: new Cesium.Cartesian3(10.0, 10.0, 10.0),
        material: Cesium.Color.RED
      }
    })
  }
  render() {
    return <div id="stage"></div>
  }
}

export default Positions
