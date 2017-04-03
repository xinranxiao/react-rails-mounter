import React from 'react';
import ReactDOM from 'react-dom';

const defaultConfig = {
  CLASS_NAME_ATTR: 'data-react-class',
  PROPS_ATTR: 'data-react-props',
};

export default class ReactRailsMounter {
  static mount(components = [], { selector = undefined, configs = {}} = {}) {
    const mergedConfigs = Object.assign({}, defaultConfig, configs);
    const nodes = this.findDOMNodes(selector, mergedConfigs);

    for (const node of nodes) {
      const name = node.getAttribute(mergedConfigs.CLASS_NAME_ATTR);
      const component = components[name];
      const props = JSON.parse(node.getAttribute(mergedConfigs.PROPS_ATTR) || null);

      if (typeof(component) === 'undefined') {
        const message = `Cannot find component: '${name}'`;
        if (console && console.log) {
          console.log(`%c[react-rails-mounter] %c${message} for element`, "font-weight: bold", "", node)
        }
        throw new Error(`[react-rails-mounter] ${message}`);
      } else {
        ReactDOM.render(React.createElement(component, props), node);
      }
    }
  }

  static unmount(searchSelector, { configs = {} }) {
    const mergedConfigs = Object.assign({}, defaultConfig, configs);
    const nodes = this.findDOMNodes(searchSelector, mergedConfigs);

    for (const node of nodes) {
      ReactDOM.unmountComponentAtNode(node);
    }
  }

  /*
   -- Helper methods --
   */
  static findDOMNodes(searchSelector, configs) {
    let selector, parent;

    switch (typeof searchSelector) {
      case 'undefined':
        selector = `[${configs.CLASS_NAME_ATTR}]`;
        parent = document;
        break;
      case 'object':
        selector = `[${configs.CLASS_NAME_ATTR}]`;
        parent = selector;
        break;
      case 'string':
        selector = `${selector}[${configs.CLASS_NAME_ATTR}], ${selector} [${configs.CLASS_NAME_ATTR}]`;
        parent = document;
        break;
      default:
        break;
    }

    return parent.querySelectorAll(selector);
  }
};
