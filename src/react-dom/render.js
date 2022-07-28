import Component from '../react/component'
import { _render } from './index'
import { diff } from './diff'

export const renderComponent = (component) => {
  let base
  // renderer 相当于 vnode
  let renderer = component.render()
  console.log(renderer, 'renderer')
  if ( component.base ) {
    component.componentWillUpdate && component.componentWillUpdate();
  }
  // base 根据vnode 构造的dom树
  console.log('0000000')
  if (!component.base) {
    // 挂载
    base = _render(renderer);
  } else {
    console.log(11111)
    // 更新阶段
    base = diff(component.base, renderer);
  }
  // 新增 diff
  if ( component.base ) {
    component.componentDidUpdate && component.componentDidUpdate();
  } else if ( component.componentDidMount ) {
    component.componentDidMount();
  }

  // if ( component.base && component.base.parentNode ) {
  //   component.base.parentNode.replaceChild( base, component.base );
  // }
  component.base = base
  base && (base._component = component)
  
}

export const createComponent = (component, props) => {
  let inst = null
  if (component.prototype && component.prototype.render) {
    // 类组件
    inst = new component(props);
  } else {
    // 函数组件
    inst = new Component(props);
    inst.constructor = component
    inst.render = function () {
      return this.constructor(props)
    }
  }
  return inst
}

export const setComponentProps = (component, props) => {
  if (!component.base) {
    // 组件未实例化
    component.componentWillMount && component.componentWillMount()
  } else {
    // 组件已实例化
    component.componentWillReceiveProps && component.componentWillReceiveProps(props)
  }
  component.props = props
  renderComponent(component)
}
