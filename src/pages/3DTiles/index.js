import { Component } from 'react'
import { Link } from 'react-router-dom'
import routers from '@/router'

const root = routers.find(router => router.path === '/3DTiles')
const prfix = root.path
const _routers = root.routers.filter(router => router.path !== '/')

class Czm3DTiles extends Component {
  render() {
    return (
      <ul>
        <h1>3D Tiles</h1>
        {_routers.map((router, index) => (
          <li key={index}>
            <Link to={prfix + router.path}>{router.component.split('/')[1]}</Link>
          </li>
        ))}
      </ul>
    )
  }
}

export default Czm3DTiles
