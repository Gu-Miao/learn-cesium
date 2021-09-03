import { Link } from 'react-router-dom'
import routers from '@/router'

const root = routers.find(router => router.path === '/positions')
const prfix = root.path
const _routers = root.routers.filter(router => router.path !== '/')

const Positions = () => {
  return (
    <ul>
      <h1>Positions</h1>
      {_routers.map((router, index) => (
        <li key={index}>
          <Link to={prfix + router.path}>{router.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Positions
