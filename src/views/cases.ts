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
  ],
  Entities: [
    {
      path: '/entities-regular-polygon',
      name: 'Regular Polygon Entity',
      description: 'Calculate regular polygon positions via trigonometric functions',
      component: () => import('./Entities/RegularPolygon.vue')
    }
  ],
  // CZML: [
  //   {
  //     path: '/czml-viewe-from',
  //     name: 'ViewFrom',
  //     description: 'Calculate viewFrom property for czml',
  //     component: 'CZML/ViewFrom'
  //   }
  // ],
  Cesium3dTiles: [
    {
      path: '/3dtiles-loading',
      name: '3DTiles Loading',
      description: 'Show loading status of 3diltes without interrupting user behavior',
      component: () => import('./Cesium3DTiles/Cesium3DTilesLoading.vue')
    },
    {
      path: '/3dtiles-change-model-shader',
      name: 'Change Model Shader',
      description: 'Change shader of models in 3dtiles through some private API',
      component: () => import('./Cesium3DTiles/ChangeModelShader.vue')
    },
    {
      path: '/3dtiles-heatzone',
      name: 'HeatZone',
      description: 'Add heat zone style to 3dtiles buildings',
      component: () => import('./Cesium3DTiles/HeatZone.vue')
    }
  ]
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
