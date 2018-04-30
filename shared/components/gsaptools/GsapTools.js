import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class GsapTools extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}
