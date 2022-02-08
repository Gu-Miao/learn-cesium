import { Button } from 'rsuite'
import { useNavigate } from 'react-router-dom'

import './error.less'

function Error() {
  const navigate = useNavigate()

  return (
    <div className="Error">
      <h1>404 Not Found</h1>
      <h3>Something went wrong, please go back or return home.</h3>

      <Button appearance="primary" onClick={() => navigate('/')}>
        Back Home
      </Button>
    </div>
  )
}

export default Error
