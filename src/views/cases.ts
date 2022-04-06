import type { RouteRecordRaw } from 'vue-router'

type Case = RouteRecordRaw & {
  description: string
  name: string
}

export const caseMap: Record<string, Case[]> = {
  Camera: [
    {
      path: '/camera-heading-pitch-roll',
      name: 'Heading & Pitch & Roll',
      description: 'Calculate heading, pitch and roll of camera',
      component: () => import('./Camera/HeadingPitchRoll.vue')
    },
    {
      path: '/camera-orbit-fly',
      name: 'Orbit Fly',
      description: 'Orbit Fly',
      component: () => import('./Camera/OrbitFly.vue')
    }
  ]
  // Entities: [
  //   {
  //     path: '/entities-billboard',
  //     name: 'Billboard Entity',
  //     description: 'Add billboard entity to viewer',
  //     component: 'Entities/Billboard'
  //   },
  //   {
  //     path: '/entities-regular-polygon',
  //     name: 'Regular Polygon Entity',
  //     description: 'Calculate regular polygon positions via trigonometric functions',
  //     component: 'Entities/RegularPolygon'
  //   }
  // ],
  // CZML: [
  //   {
  //     path: '/czml-viewe-from',
  //     name: 'ViewFrom',
  //     description: 'Calculate viewFrom property for czml',
  //     component: 'CZML/ViewFrom'
  //   }
  // ],
  // Cesium3dTiles: [
  //   {
  //     path: '/cesium3dTiles-change-model-shader',
  //     name: 'Change Model Shader',
  //     description: 'Change shader of models in 3dtiles through some private API',
  //     component: 'Cesium3DTiles/ChangeModelShader'
  //   },
  //   {
  //     path: '/cesium3dTiles-heatzone',
  //     name: 'HeatZone',
  //     description: 'Add heat zone style to 3dtiles buildings',
  //     component: 'Cesium3DTiles/HeatZone'
  //   }
  // ]
  // Analysis: [
  //   {
  //     path: '/analysis-buffer',
  //     name: 'Buffer',
  //     description: 'Buffer area',
  //     component: 'Analysis/Buffer'
  //   }
  // ]
}

export const allCases = Object.values(caseMap).flat()
