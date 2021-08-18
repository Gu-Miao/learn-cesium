import { Link } from 'react-router-dom'
import router from '@/router'

const _router = router.filter(router => router.path !== '/' && router.component !== 'error')

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Learn Cesium</h1>
      <ul>
        {_router.map((router, index) => {
          return (
            <li key={index}>
              <Link to={router.path} style={{ marginRight: 20 }}>
                {router.component || router.path.split('/')[1]}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
