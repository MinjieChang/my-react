import enqueueSetState from './setStateQueue'

class Component {

  constructor(props = {}) {
    this.state = {}
    this.props = props
  }

  setState(newState) {
    // Object.assign(this.state, newState)
    // renderComponent(this)
    enqueueSetState(newState, this)
  }
}

export default Component