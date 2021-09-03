import React, { Component } from 'react'
import Cesium from '@utils/cesium'
import { TILES_URL } from '@utils/path'

/* eslint-disable no-template-curly-in-string */
const styles = [
  {
    name: 'No style',
    style: {}
  },
  {
    name: 'Color by building',
    style: {
      color: {
        conditions: [
          ["${building_name} === 'building0'", "color('purple')"],
          ["${building_name} === 'building1'", "color('white')"],
          ["${building_name} === 'building2'", "color('orange')"],
          ['true', "color('blue')"]
        ]
      }
    }
  },
  {
    name: 'Color all doors',
    style: {
      color: {
        conditions: [
          ["isExactClass('door')", "color('orange')"],
          ['true', "color('white')"]
        ]
      }
    }
  },
  {
    name: 'Color all features derived from door',
    style: {
      color: {
        conditions: [
          ["isClass('door')", "color('orange')"],
          ['true', "color('white')"]
        ]
      }
    }
  },
  {
    name: 'Color features by class name',
    style: {
      defines: {
        suffix: "regExp('door(.*)').exec(getExactClassName())"
      },
      color: {
        conditions: [
          ["${suffix} === 'knob'", "color('yellow')"],
          ["${suffix} === ''", "color('lime')"],
          ['${suffix} === null', "color('gray')"],
          ['true', "color('blue')"]
        ]
      }
    }
  },
  {
    name: 'Style by height',
    style: {
      color: {
        conditions: [
          ['${height} >= 10', "color('purple')"],
          ['${height} >= 6', "color('red')"],
          ['${height} >= 5', "color('orange')"],
          ['true', "color('blue')"]
        ]
      }
    }
  }
]
/* eslint-enable */

class BatchTableHierarchy extends Component {
  componentDidMount() {
    const viewer = new Cesium.Viewer('stage')
    viewer.clock.currentTime = new Cesium.JulianDate(2457522.154792)

    this.tileset = new Cesium.Cesium3DTileset({
      url: `${TILES_URL}/BatchTableHierarchy/tileset.json`
    })

    viewer.scene.primitives.add(this.tileset)
    viewer.zoomTo(this.tileset, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0))

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

    // When a feature is left clicked, print its class name and properties
    handler.setInputAction(movement => {
      const feature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(feature)) {
        return
      }
      console.log('Class: ' + feature.getExactClassName())
      console.log('Properties:')
      const propertyNames = feature.getPropertyNames()
      const length = propertyNames.length
      for (let i = 0; i < length; ++i) {
        const name = propertyNames[i]
        const value = feature.getProperty(name)
        console.log('  ' + name + ': ' + value)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // When a feature is middle clicked, hide it
    handler.setInputAction(movement => {
      var feature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(feature)) {
        return
      }
      feature.show = false
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  setStyle(style) {
    this.tileset.style = new Cesium.Cesium3DTileStyle(style)
  }
  render() {
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
          <label htmlFor="style">Set styles</label>
          <br />
          <select id="style" onChange={e => this.setStyle(styles[e.target.value].style)}>
            {styles.map((style, index) => (
              <option key={index} value={index}>
                {style.name}
              </option>
            ))}
          </select>
        </div>
        <div id="stage"></div>
      </>
    )
  }
}

export default BatchTableHierarchy
