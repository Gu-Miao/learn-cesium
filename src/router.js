const routers = [
  {
    key: 'Home',
    title: 'Learn Cesium',
    path: '/',
    component: 'Home/index',
    exact: true
  },
  {
    key: 'Cesium3DTiles',
    title: 'Cesium 3D Tiles',
    path: '/cesium-3d-tiles',
    routers: [
      {
        key: 'Cesium3DTiles',
        path: '/',
        component: 'Cesium3DTiles/index',
        exact: true
      },
      {
        key: 'AjustHeight',
        title: 'Ajust Height',
        path: '/ajust-height',
        component: 'Cesium3DTiles/AjustHeight',
        exact: true
      },
      {
        key: 'CrystalHeatZone',
        title: 'Crystal Heat Zone',
        path: '/crystal-heat-zone',
        component: 'Cesium3DTiles/CrystalHeatZone',
        exact: true
      },
      {
        key: 'ClampTo3DTiles',
        title: 'Clamp To 3DTiles',
        path: '/clamp-to-3d-tiles',
        component: 'Cesium3DTiles/ClampTo3DTiles',
        exact: true
      }
    ]
  },
  {
    key: 'DataSource',
    title: 'DataSource',
    path: '/dataSource',
    routers: [
      {
        key: 'DataSource',
        path: '/',
        component: 'DataSource/index',
        exact: true
      },
      {
        key: 'China',
        title: 'China',
        path: '/china',
        component: 'DataSource/China',
        exact: true
      },
      {
        key: 'CZMLPath',
        title: 'CZML Path',
        path: '/czml-path',
        component: 'DataSource/CZMLPath',
        exact: true
      }
    ]
  },
  {
    key: 'Entities',
    title: 'Entities',
    path: '/entities',
    routers: [
      {
        key: 'Entities',
        path: '/',
        component: 'Entities/index',
        exact: true
      },
      {
        key: 'RegularPolygonWall',
        title: 'Regular Polygon Wall',
        path: '/regular-polygon-wall',
        component: 'Entities/RegularPolygonWall',
        exact: true
      }
    ]
  },
  {
    key: 'Positions',
    title: 'Positions',
    path: '/positions',
    routers: [
      {
        key: 'Positions',
        path: '/',
        component: 'Positions/index',
        exact: true
      },
      {
        key: 'CameraOn3DTiles',
        title: 'Camera On 3DTiles',
        path: '/camera-on-3d-tiles',
        component: 'Positions/CameraOn3DTiles',
        exact: true
      },
      {
        key: 'CustomTracking',
        title: 'Custom Tracking',
        path: '/custom-tracking',
        component: 'Positions/CustomTracking',
        exact: true
      },
      {
        key: 'LocalToFixedFrame',
        title: 'Local To Fixed Frame',
        path: '/local-to-fixed-frame',
        component: 'Positions/LocalToFixedFrame/index',
        exact: true
      },
      {
        key: 'HeadingPitch',
        title: 'Heading & Pitch',
        path: '/heading-pitch',
        component: 'Positions/HeadingPitch',
        exact: true
      },
      {
        key: 'Orbit',
        title: 'Orbit',
        path: '/orbit',
        component: 'Positions/Orbit',
        exact: true
      },
      {
        key: 'WiderView',
        title: 'Wider View',
        path: '/wider-view',
        component: 'Positions/WiderView',
        exact: true
      }
    ]
  },
  {
    key: 'Primitives',
    title: 'Primitives',
    path: '/primitives',
    routers: [
      {
        key: 'Primitives',
        path: '/',
        component: 'Primitives/index',
        exact: true
      },
      {
        key: 'Billboards',
        title: 'Billboards',
        path: '/billboards',
        component: 'Primitives/Billboards',
        exact: true
      },
      {
        key: 'GroundPolyline',
        title: 'Ground Polyline',
        path: '/ground-polyline',
        component: 'Primitives/GroundPolyline',
        exact: true
      },
      {
        key: 'Model',
        title: 'Model',
        path: '/model',
        component: 'Primitives/Model',
        exact: true
      },
      {
        key: 'Polylines',
        title: 'Polylines',
        path: '/polylines',
        component: 'Primitives/Polylines',
        exact: true
      }
    ]
  },
  {
    key: 'Error',
    title: 'Something Went Wrong',
    component: 'Error/index'
  }
]

export default routers
