import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Helmet from 'react-helmet';

import s from './GsapLib.scss';

class GsapLib extends Component {

  static propTypes = {
    gsap: PropTypes.object,
    noPanel: PropTypes.bool,
  }

  static defaultProps = {
    noPanel: true,
  }

  onToggleGsapTools = () => {
    this.props.gsap.toggle = !this.props.gsap.toggle;
  }

  render() {
    const { noPanel, gsap } = this.props;
    const { toggle } = gsap;

    return (
      <div>
        <Helmet>
          <script src="/gsapDevTools.js" />
        </Helmet>

        {!noPanel && (
          <button className={s(s.gsap, { toggle })} onClick={this.onToggleGsapTools}>
            GSAP
          </button>
        )}
      </div>
    );
  }
}

export default inject('gsap')(observer(GsapLib));
