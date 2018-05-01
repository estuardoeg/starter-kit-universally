import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import config from 'utils/config';

const showGsapTools = process.env.GSAP_DEVTOOLS === 'true' || config('gsapDevtools');

class GsapTools extends PureComponent {

  static propTypes = {
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
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default inject('index')(observer(GsapTools));
