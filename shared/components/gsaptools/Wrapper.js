import { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

export default class GsapTools extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  componentDidMount() {
    // Update the GSDevTools to add the decorated component
  }

  render() {
    const { children } = this.props;

    return Children.map(children, (c) => {
      if (c) {
        return cloneElement(c, {
          ref: (el) => { this.children = el; },
        });
      }

      return c;
    });
  }
}
