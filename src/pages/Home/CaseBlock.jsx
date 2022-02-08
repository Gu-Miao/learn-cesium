import { Link } from 'react-router-dom'

import './CaseBlock.less'

function CaseBlock({ path, title, description }) {
  return (
    <div className="case-block">
      <Link to={`/viewer/${path}`} className="link">
        {title}
      </Link>
      <p>{description}</p>
    </div>
  )
}

export default CaseBlock
