import { StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import reportWebVitals from './reportWebVitals'

import './index.less'

window.CESIUM_BASE_URL = process.env.PUBLIC_URL

render(
  <StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
  </StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
