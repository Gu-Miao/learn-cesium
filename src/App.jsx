import { lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Container, Header, Navbar, Content, Loader, Footer } from 'rsuite'
import { allCases } from './cases/cases'

import './App.less'

const HomePage = lazy(() => import('@/pages/Home/Home'))
const ErrorPage = lazy(() => import('@/pages/Error/Error'))

function Loading() {
  return (
    <div className="loading">
      <Loader size="lg" />
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  return (
    <Container className="App">
      <Header>
        <Navbar appearance="inverse">
          <Navbar.Brand onClick={() => navigate('/')}>
            <span className="title">Learn Cesium</span>
          </Navbar.Brand>
        </Navbar>
      </Header>
      <Content id="stage">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/viewer">
              {allCases.map(item => {
                const { index, path, component } = item
                const Component = lazy(() => import(`@/cases/${component}`))
                return <Route index={index} key={component} path={path} element={<Component />} />
              })}
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </Content>
      <Footer className="footer">Made by Gu-Miao 💖</Footer>
    </Container>
  )
}

export default App
