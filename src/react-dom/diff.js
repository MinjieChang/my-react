import { setAttribute } from './index'
import { setComponentProps, createComponent } from './render'

export const diff = (dom, vnode, container) => {
  const ret = diffNode(dom, vnode)

  if (container && ret.parentNode !== container) {
    container.appendChild(ret)
  }

  return ret
}

export const diffNode = (dom, vnode) => {
  let out = dom
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = ''
  }
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }
  // 对比文本节点
  if (typeof vnode === 'string') {
    // 如果当前是文本节点，并且内容不一样，则直接替换掉
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode
      }
    } else {
      // 如果不是文本节点，创建新的文本节点
      out = document.createTextNode(vnode)
      dom && dom.parentNode && dom.parentNode.replaceChild(out, dom)
      return out
    }
  }

  // 对比组件
  if (typeof vnode === 'function') {
    return diffComponent(dom, vnode)
  }

  // 对比标签节点
  // 不是相同类型的节点
  if (!dom || !isSameNodeType(dom, vnode)) {
    // 创建新的节点，删除旧的节点
    out = document.createElement(vnode.tag)
    if (dom) {
      // 原dom下的子节点添加到新的节点上
      [...dom.childNodes].map(out.appendChild)
      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }
  }

  // 对比子节点
  if ((dom && dom.childNodes && dom.childNodes > 0) || (vnode.children && vnode.children.length > 0)) {
    diffChildren(dom, vnode)
  }
  // 对比属性
  diffAttributes(dom, vnode)
  return out
}

/**
 * 
 * @param {*} dom 
 * @param {*} vnode 
 */
const diffChildren = (dom, vnode) => {
  const keyed = {}
  const children = []
  const domChildren = dom.childNodes
  const vChildren = vnode.children
  if (domChildren.length > 0) {
    domChildren.forEach(child => {
      const key = child.key
      if (key) {
        keyed[key] = child
      } else {
        children.push(child)
      }
    });
  }
  if (vChildren && vChildren.length) {
    let min = 0
    let childrenLen = children.length
    for (let i = 0; i < vChildren.length; i++) {
      let vchild = vChildren[i];
      let key = vchild.key
      let child
      if (key) {
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if (min < childrenLen) {
        for (let j = min; j < childrenLen; j++) {
          let c = children[j];
          if (c && isSameNodeType(c, vchild)) {
            child = c
            children[j] = undefined
            // 缩小查找范围
            if (j === min) { min++ }
            if (min === childrenLen - 1) { childrenLen-- }
            break
          }
        }
      }
      // 找到了 比对的 child 和 vchild
      child = diffNode(child, vchild)
      let f = domChildren[i]
      if (child && child !== dom && child !== f) {
        if (!f) {
          // 如果更新前的对应位置为空 说明此节点不存在
          dom.appendChild(child)
        } else if (child === f.nextSibling) {
          // 如果新节点等于当前节点的下个兄弟节点，说明当前节点被删除
          removeNode(f)
        } else {
          // 将新节点更新到对应的位置
          dom.insertBefore(f, child)
        }
      }
    }
  }
}

const diffComponent = (dom, vnode) => {
  console.log(22222)
  let c = dom && dom._component
  let oldDom = dom
  // 如果组件名一样，更新属性
  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode)
    dom = c.base
    console.log(dom, 'component.base=====')
  } else {
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    if (c) {
      unmountComponent(c)
      oldDom = null
    }
    c = createComponent(vnode.tag, vnode.attrs)
    setComponentProps(c, vnode.attrs)
    dom = c.base
    if (oldDom && oldDom !== dom) {
      removeNode(oldDom)
    }
  }

  return dom
}

const diffAttributes = (dom, vnode) => {
  const domAttrs = dom.attributes || []
  // 当前dom的属性
  const old = {}
  // 虚拟dom的属性
  const vAttrs = vnode.attrs
  for (let i = 0; i < domAttrs.length; i++) {
    const attr = dom.attributes[i];
    old[attr.name] = attr.value
  }
  // 如果原来的属性不在新的属性当中，将其移出掉
  for (let name in old) {
    if (!vAttrs[name]) {
      setAttribute(dom, name, undefined)
    }
  }
  // 增加新的属性
  for (const name in vAttrs) {
    if (old[name] !== vAttrs[name]) {
      setAttribute(dom, name, vAttrs[name])
    }
  }
}

const unmountComponent = (component) => {
  if (component.componentWillUnmount) {
    component.componentWillUnmount()
    removeNode(component.base)
  }
}

const removeNode = (node) => {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node)
  }
}

const isSameNodeType = (dom, vnode) => {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3
  }
  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase()
  }
  return dom && dom._component.constructor === vnode.tag
}