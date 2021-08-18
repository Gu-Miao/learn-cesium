import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import AsyncComponent from '@components/AsyncComponent'

import routers from '@/router'

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <CacheSwitch>{renderRouters(routers)}</CacheSwitch>
    </Router>
  )
}

function render(props, component, routers, rootPath = '') {
  const childenRouters = renderRouters(routers, { location: props.location }, rootPath)

  if (component) {
    const Component = AsyncComponent(component)
    return <Component {...props}>{childenRouters}</Component>
  } else {
    return childenRouters
  }
}

function getElement(router, index, rootPath = '') {
  const { routers, component, ...routeProps } = router
  routeProps.key = routeProps.key || index
  if (routeProps.path) routeProps.path = rootPath + routeProps.path
  if (routeProps.redirect) {
    return <Redirect {...routeProps} from={routeProps.path} to={routeProps.redirect} />
  } else {
    const Cmp = routeProps.when ? CacheRoute : Route
    return (
      <Cmp
        {...routeProps}
        render={props => {
          if (routeProps.title) document.title = routeProps.title
          return render(props, component, routers, routeProps.path)
        }}
      />
    )
  }
}

function renderRouters(routers, switchProps = {}, rootPath = '') {
  return routers ? (
    <CacheSwitch {...switchProps}>
      {routers.map((router, index) => {
        return getElement(router, index, rootPath)
      })}
    </CacheSwitch>
  ) : null
}

export default App
