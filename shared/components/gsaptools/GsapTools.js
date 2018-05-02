import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

class GsapTools extends Component {

  static propTypes = {
    gsap: PropTypes.object,
    children: PropTypes.node,
  }

  componentDidMount() {
    // Register animation before using gsap tools
    setTimeout(() => {
      // this.animation();
    }, 100);

    if (this.showGsapTools) {
      this.gsapCheck = setInterval(() => {
        if (GSDevTools) {
          GSDevTools.create({
            globalSync: false,
            animation: this.timeline,
            css: { position: 'fixed', zIndex: 9999 },
          });

          clearInterval(this.gsapCheck);
        }
      }, 200);
    }
  }

  componentWillUnmount() {
    if (this.showGsapTools) {
      clearInterval(this.gsapCheck);
    }
  }

  render() {
    const { children, gsap } = this.props;
    const { toggle } = gsap;

    if (!toggle) {
      return children;
    }

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default inject('gsap')(observer(GsapTools));
