import { Link } from 'react-router-dom'
import routers from '@/router'

const PathList = ({ path }) => {
  const root = routers.find(router => router.path === path)
  const prfix = root.path
  const _routers = root.routers.filter(router => router.path !== '/')
  return (
    <ul>
      <h1>{root.routers[0].title}</h1>
      {_routers.map((router, index) => (
        <li key={index}>
          <Link to={prfix + router.path}>{router.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default PathList
