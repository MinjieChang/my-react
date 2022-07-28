import { renderComponent } from '../react-dom/render'

const setStateQueue = []
const renderQueue = [] 

const defer = (cb) => Promise.resolve().then(cb)

const enqueueSetState = (newState, component) => {
  if (setStateQueue.length === 0) {
    defer(flush)
  }
  setStateQueue.push({
    stateChange: newState,
    component: component
  })
  if (renderQueue.indexOf(component) < 0) {
    renderQueue.push(component)
  }
}

const flush = () => {
  let item, component
  while (item = setStateQueue.shift()) {
    // 弹出 stateChange 合并state
    const { stateChange, component } = item

    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state || {})
    }
    if (typeof stateChange === 'function') {
      Object.assign(component.state, stateChange(component.prevState, component.props))
    } else {
      Object.assign(component.state, stateChange)
    }
    component.prevState = component.state
  }
  while (component = renderQueue.shift()) {
    renderComponent(component)
  }
}

export default enqueueSetState