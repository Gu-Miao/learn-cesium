import { Link } from 'react-router-dom'
import routers from '@/router'

const routersWithoutHomeAndError = routers.filter(router => !['Home', 'Error'].includes(router.key))

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Learn Cesium</h1>
      <ul>
        {routersWithoutHomeAndError.map(router => {
          return (
            <li key={router.key}>
              <Link to={router.path}>{router.title}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
