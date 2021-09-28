import React from 'react'
import ReactDOM from 'react-dom'
import './index.less'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { PUBLIC_URL } from '@utils/paths'
import Cesium from '@utils/cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

window.CESIUM_BASE_URL = PUBLIC_URL

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTdlMjM1NS1iY2M4LTQ3MDAtYWU0Zi04MTEzZDczN2FmY2EiLCJpZCI6NjM0NjIsImlhdCI6MTYyOTE2NjY1NX0.bQtn7jvNqRYh2h6vcHRHkm49sNjeBNflIViYXJll2sU'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
