import { Link } from 'react-router-dom'
import router from '@/router'

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Learn Cesium</h1>
      <ul>
        {router.map((router, index) => {
          return router.component === 'error' ? null : (
            <li key={index}>
              <Link to={router.path} style={{ marginRight: 20 }}>
                {router.component}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
