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
    component: 'groundPolyline',
    exact: true
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
    component: 'positions',
    exact: true,
    title: 'Positions'
  },
  {
    component: 'error'
  }
]

export default routers
