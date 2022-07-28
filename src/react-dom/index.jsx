import { createComponent, setComponentProps } from './render'

export const setAttribute = (dom, key, value) => {
  if (key === "className") {
    key = "class";
  }
  // 监听事件
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value;
  } else if (key === "style") {
    // console.log(key, value, "key");
    if (!value || typeof value === "string") {
      dom.style.cssText = value || "";
    } else if (typeof value === "object") {
      for (const name in value) {
        if (Object.hasOwnProperty.call(value, name)) {
          dom.style[name] =
            typeof value[name] === "number" ? value[name] + "px" : value[name];
        }
      }
    }
  } else {
    // 普通属性直接更新属性
    if (key in dom) {
      dom[key] = value || "";
    }
    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
};

export const _render = (vnode) => {
  // console.log(vnode, "vnode");
  if (vnode === undefined || vnode === null || typeof vnode === "boolean") { 
    vnode = "";
  }
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  if (typeof vnode === "string") {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }
  const { tag, attrs, children } = vnode;
  // 函数组件
  if (typeof tag === 'function') {
    const component = createComponent(tag, attrs)
    setComponentProps(component, attrs)
    return component.base
  }

  // html 元素
  const dom = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      const value = attrs[key];
      setAttribute(dom, key, value);
    });
  }
  if (children) {
    children.forEach((child) => {
      render(child, dom);
    });
  }
  return dom;
};

function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

const ReactDom = {
  render: (vnode, container) => {
    container.innerHTML = "";
    return render(vnode, container);
  },
};

export default ReactDom;
