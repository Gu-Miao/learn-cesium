import { Component } from 'react'

const routerObserveQueue = []

export const RouterHooks = {
  beforeRouterComponentLoad(callback) {
    routerObserveQueue.push({
      type: 'before',
      callback
    })
  },
  afterRouterComponentDidLoaded(callback) {
    routerObserveQueue.push({
      type: 'after',
      callback
    })
  }
}

function AsyncRouter(componentPath) {
  return class Content extends Component {
    constructor(props) {
      super(props)
      this.state = { Component: null }
      this.dispatchRouterQueue('before')
    }

    dispatchRouterQueue(type) {
      routerObserveQueue.forEach(item => {
        if (item.type === type && item.callback) item.callback(this.props)
      })
    }
    componentDidMount() {
      if (this.state.Component) return
      const loader = () => import(`@pages/${componentPath}`)
      loader()
        .then(module => module.default)
        .then(Component => this.setState({ Component }, () => this.dispatchRouterQueue('after')))
        .catch(err => {
          throw new Error(err)
        })
    }
    render() {
      const { Component } = this.state
      return Component ? <Component {...this.props} /> : null
    }
  }
}

export default AsyncRouter
