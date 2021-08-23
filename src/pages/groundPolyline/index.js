import { Link } from 'react-router-dom'
import routers from '@/router'

const root = routers.find(router => router.path === '/groundPolyline')
const prfix = root.path
const _routers = root.routers.filter(router => router.path !== '/')

const GroundPolyline = () => {
  return (
    <ul>
      <h1>Ground Polyline</h1>
      {_routers.map((router, index) => (
        <li key={index}>
          <Link to={prfix + router.path}>{router.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default GroundPolyline
