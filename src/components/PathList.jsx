import { Link } from 'react-router-dom'
import routers from '@/router'

const PathList = ({ routerKey }) => {
  const root = routers.find(router => router.key === routerKey)
  const prefix = root.path
  const _routers = root.routers.filter(router => router.path !== '/').sort((a, b) => a - b)
  return (
    <ul>
      <h1>{root.title}</h1>
      {_routers.map(router => (
        <li key={router.key}>
          <Link to={prefix + router.path}>{router.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default PathList
