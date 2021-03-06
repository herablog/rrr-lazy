import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import over from 'lodash/over';

import { Lazy } from './Lazy';

const getDisplayName = Component => Component.displayName ||
  Component.name ||
  (typeof Component === 'string' ? Component : 'Component');

export const lazy = (options = {}) => Component => {
  class LazyDecorated extends React.Component {
    static contextTypes = {
      redialContext: React.PropTypes.object,
    };

    constructor(props, context) {
      super(props, context);
      this.displayName = `Lazy${getDisplayName(Component)}`;
    }

    getHandler() {
      const load = () => {
        hoistStatics(LazyDecorated, Component);
        if (this.context.redialContext) {
          this.context.redialContext.reloadComponent(LazyDecorated);
        }
      };
      return over([load, options.onContentVisible].filter(v => !!v));
    }

    render() {
      return (
        <Lazy {...options} onContentVisible={this.getHandler()}>
          <Component {...this.props} />
        </Lazy>
      );
    }
  }
  LazyDecorated.WrappedComponent = Component;
  return LazyDecorated;
};
