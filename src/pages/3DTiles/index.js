import { Component } from 'react'
import { Link } from 'react-router-dom'
import routers from '@/router'

const _routers = routers
  .find(router => router.path === '/3DTiles')
  ?.routers?.filter(router => router.path !== '/')

class Czm3DTiles extends Component {
  render() {
    return (
      <ul>
        <h1>3D Tiles</h1>
        {_routers.map(router => (
          <li>
            <Link to={router.path}>{router.component.split('/')[1]}</Link>
          </li>
        ))}
      </ul>
    )
  }
}

export default Czm3DTiles
