/**
 * @typedef {Object} Case Case data item.
 *
 * @property {boolean} [index] Is index route.
 * @property {string} [path] Router path.
 * @property {string} title Title of case.
 * @property {string} description Description of case.
 * @property {string} component Component name of case.
 */

/**
 * @type {Object.<string, Case[]>}
 */
export const cases = {
  Basic: [
    {
      index: true,
      title: 'Cesium Viewer',
      description: 'Most basic viewer of cesium',
      component: 'Basic/Viewer'
    }
  ],
  Camera: [
    {
      path: 'camera-heading-pitch-roll',
      title: 'Heading & Pitch & Roll',
      description: 'Calculate heading, pitch and roll of camera',
      component: 'Camera/HeadingPitchRoll'
    },
    {
      path: 'camera-orbit-fly',
      title: 'Orbit Fly',
      description: 'Orbit Fly',
      component: 'Camera/OrbitFly'
    }
  ],
  Entities: [
    {
      path: 'entities-billboard',
      title: 'Billboard Entity',
      description: 'Add billboard entity to viewer',
      component: 'Entities/Billboard'
    },
    {
      path: 'entities-regular-polygon',
      title: 'Regular Polygon Entity',
      description: 'Calculate regular polygon positions via trigonometric functions',
      component: 'Entities/RegularPolygon'
    }
  ],
  CZML: [
    {
      path: 'czml-viewe-from',
      title: 'ViewFrom',
      description: 'Calculate viewFrom property for czml',
      component: 'CZML/ViewFrom'
    }
  ],
  Cesium3dTiles: [
    {
      path: 'cesium3dTiles-change-model-shader',
      title: 'Change Model Shader',
      description: 'Change shader of models in 3dtiles through some private API',
      component: 'Cesium3DTiles/ChangeModelShader'
    },
    {
      path: 'cesium3dTiles-heatzone',
      title: 'HeatZone',
      description: 'Add heat zone style to 3dtiles buildings',
      component: 'Cesium3DTiles/HeatZone'
    }
  ]
}

export const allCases = Object.values(cases).flat()
