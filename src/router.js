/** @type import('react-router-cache-route').CacheRouteProps[] */
const routers = [
  {
    path: '/',
    component: 'home',
    exact: true
  },
  {
    path: '/widget',
    component: 'widget',
    exact: true
  },
  {
    path: '/3DModel',
    component: '3DModel',
    exact: true
  },
  {
    path: '/billboards',
    component: 'billboards',
    exact: true
  },
  {
    path: '/localToFixedFrame',
    component: 'localToFixedFrame',
    exact: true
  },
  {
    path: '/polyline',
    component: 'polyline',
    exact: true
  },
  {
    path: '/terrain',
    component: 'terrain',
    exact: true
  },
  {
    path: '/premitives',
    component: 'premitives',
    exact: true
  },
  {
    path: '/3DTiles',
    routers: [
      {
        path: '/',
        component: '3DTiles',
        exact: true
      },
      {
        path: '/AjustHeight',
        component: '3DTiles/AjustHeight',
        exact: true
      },
      {
        path: '/BatchTableHierarchy',
        component: '3DTiles/BatchTableHierarchy',
        exact: true
      },
      {
        path: '/BIM',
        component: '3DTiles/BIM',
        exact: true
      },
      {
        path: '/FromIonResource',
        component: '3DTiles/FromIonResource',
        exact: true
      }
    ]
  },
  {
    path: '/labels',
    component: 'labels',
    exact: true
  },
  {
    path: '/groundPolyline',
    routers: [
      {
        path: '/',
        component: 'groundPolyline',
        exact: true
      },
      {
        path: '/basic',
        component: 'groundPolyline/basic',
        exact: true,
        title: 'basic'
      },
      {
        path: '/path',
        component: 'groundPolyline/path',
        exact: true,
        title: 'path'
      }
    ]
  },
  {
    path: '/rotateFly',
    component: 'rotateFly',
    exact: true
  },
  {
    path: '/fly',
    component: 'fly',
    exact: true
  },
  {
    path: '/czml',
    routers: [
      {
        path: '/',
        component: 'czml',
        exact: true,
        title: 'CZML'
      },
      {
        path: '/path',
        component: 'czml/path',
        exact: true,
        title: 'Path'
      }
    ]
  },
  {
    path: '/positions',
    routers: [
      {
        path: '/',
        component: 'positions',
        exact: true,
        title: 'Positions'
      },
      {
        path: '/headingPitch',
        component: 'positions/headingPitch',
        exact: true,
        title: 'Heading & Pitch'
      },
      {
        path: '/widerView',
        component: 'positions/widerView',
        exact: true,
        title: 'Wider View'
      }
    ]
  },
  {
    path: '/geojson',
    routers: [
      {
        path: '/',
        component: 'geojson',
        exact: true,
        title: 'Geo json'
      },
      {
        path: '/china',
        component: 'geojson/china',
        exact: true,
        title: 'China'
      },
      {
        path: '/chinaPrimitive',
        component: 'geojson/chinaPrimitive',
        exact: true,
        title: 'China as Primitive'
      }
    ]
  },
  {
    component: 'error'
  }
]

export default routers
