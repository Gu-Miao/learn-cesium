import React, { Component } from 'react'
import Cesium from '@utils/cesium'

export class Premitives extends Component {
  createGeometry() {
    // Draw a red box and position it on the globe surface.
    const dimensions = new Cesium.Cartesian3(400000.0, 300000.0, 500000.0)
    // Box geometries are initially centered on the origin.
    // We can use a model matrix to position the box on the
    // globe surface.
    const positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(-105.0, 45.0)
    const boxModelMatrix = Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
      new Cesium.Cartesian3(0.0, 0.0, dimensions.z * 0.5),
      new Cesium.Matrix4()
    )
    // Create a box geometry.
    const boxGeometry = Cesium.BoxGeometry.fromDimensions({
      vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      dimensions: dimensions
    })
    // Create a geometry instance using the geometry
    // and model matrix created above.
    const boxGeometryInstance = new Cesium.GeometryInstance({
      geometry: boxGeometry,
      modelMatrix: boxModelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5))
      }
    })

    // Add the geometry instance to primitives.
    this.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: boxGeometryInstance,
        appearance: new Cesium.PerInstanceColorAppearance({
          closed: true
        })
      })
    )
  }
  createRectangle() {
    // Create rectangle geometry.
    const rectangleGeometryInstance = new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(-92.0, 20.0, -86.0, 27.0),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        stRotation: Cesium.Math.toRadians(45)
      })
    })
    this.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: rectangleGeometryInstance,
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: Cesium.Material.fromType('Stripe')
        })
      })
    )
  }
  createOutlineGeometry() {
    // Create box outline geometry.
    const positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(-105.0, 45.0)
    const dimensions = new Cesium.Cartesian3(400000.0, 400000.0, 400000.0)
    const geometry = Cesium.BoxOutlineGeometry.fromDimensions({
      dimensions
    })
    const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
      new Cesium.Cartesian3(dimensions.x * 2.0, 0.0, dimensions.z * 0.5),
      new Cesium.Matrix4()
    )
    const geometryInstance = new Cesium.GeometryInstance({
      geometry,
      modelMatrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
      }
    })
    this.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: geometryInstance,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true,
          renderState: {
            lineWidth: Math.min(2.0, this.scene.maximumAliasedLineWidth)
          }
        })
      })
    )
  }
  componentDidMount() {
    const viewer = new Cesium.Viewer('stage')
    this.scene = viewer.scene

    this.createGeometry()
    this.createOutlineGeometry()
    this.createRectangle()
  }
  render() {
    return <div id="stage"></div>
  }
}

export default Premitives
