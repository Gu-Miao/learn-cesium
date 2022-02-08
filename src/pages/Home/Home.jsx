import { Stack } from 'rsuite'
import CaseBlock from './CaseBlock'

import { cases } from '@/cases/cases'

import './Home.less'

function Home() {
  return (
    <div className="Home">
      <h2>Cesium Cases</h2>

      <ul>
        {Object.keys(cases).map(category => {
          const categoricalCases = cases[category]

          return (
            <li key={category} className="category">
              <h4>{category}</h4>
              <Stack wrap spacing={6}>
                {categoricalCases.map(item => {
                  const { path, title, description } = item
                  return (
                    <CaseBlock
                      key={title}
                      path={path || ''}
                      title={title}
                      description={description}
                    />
                  )
                })}
              </Stack>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
