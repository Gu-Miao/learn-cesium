import { Component } from 'react'
import Cesium from '@utils/cesium'
import { PUBLIC_URL } from '@utils/path'

class AjustHeight extends Component {
  state = {
    height: 0
  }
  componentDidUpdate() {
    const { height } = this.state
    const cartographic = Cesium.Cartographic.fromCartesian(this.tileset.boundingSphere.center)
    const surface = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      0.0
    )
    const offset = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      height
    )
    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
    this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
  }
  componentDidMount() {
    const viewer = new Cesium.Viewer('stage', {
      shadows: true // Show shadows of 3D tils.
    })

    // If set this to true, primitives may disappear undergound.
    viewer.scene.globe.depthTestAgainstTerrain = true

    this.tileset = new Cesium.Cesium3DTileset({
      url: `${PUBLIC_URL}/tileset/tileset.json`
    })

    this.tileset.readyPromise
      .then(function (tileset) {
        viewer.scene.primitives.add(tileset)
        viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0)
        )
      })
      .otherwise(function (error) {
        console.log(error)
      })
  }
  render() {
    const { height } = this.state
    return (
      <>
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 10,
            zIndex: 9999,
            padding: 10,
            background: '#fff',
            borderRadius: 5
          }}
        >
          <label htmlFor="height">Set height of 3D tiles</label>
          <br />
          <input
            id="height"
            type="number"
            value={height}
            onChange={e =>
              this.setState({
                height: Number(e.target.value)
              })
            }
          />
        </div>
        <div id="stage"></div>
      </>
    )
  }
}

export default AjustHeight
