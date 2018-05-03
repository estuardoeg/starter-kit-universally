import { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';

class GsapTools extends Component {

  static propTypes = {
    gsap: PropTypes.object,
    children: PropTypes.node,
  }

  componentDidMount() {
    const { gsap } = this.props;

    this.gsap = GSDevTools.create({
      globalSync: false,
      hideGlobalTimeline: true,
      animation: this.children.timeline,
      css: { position: 'fixed', zIndex: 9999 },
    });

    this.reaction = reaction(
      () => gsap.toggle,
      this.gsap.toggle,
      true,
    );
  }

  componentWillUnmount() {
    if (this.reaction) {
      this.reaction();
    }
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

export default inject('gsap')(observer(GsapTools));
