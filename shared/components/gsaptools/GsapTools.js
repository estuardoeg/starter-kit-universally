import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import s from './GsapTools.scss';

// Key to store visibility state of the gsaptools
const LOCAL_STORAGE_GSAPTOOLS = '_devtoolsGsapToolsVisible';

class GsapTools extends Component {

  static propTypes = {
    gsap: PropTypes.object,
    noPanel: PropTypes.bool,
  }

  static defaultProps = {
    noPanel: true,
  }

  componentDidMount() {
    this.setup();
  }

  componentWillReceiveProps() {
    this.setup();
  }

  setup = () => {
    this.props.gsap.toggle = (localStorage.getItem(LOCAL_STORAGE_GSAPTOOLS) === 'true');
  }

  onToggleGsapTools = () => {
    this.props.gsap.toggle = !this.props.gsap.toggle;
    localStorage.setItem(LOCAL_STORAGE_GSAPTOOLS, this.props.gsap.toggle);
  }

  render() {
    const { noPanel, gsap } = this.props;
    const { toggle } = gsap;

    return (
      <Fragment>
        {!noPanel && (
          <button className={s(s.gsap, { toggle })} onClick={this.onToggleGsapTools}>
            GSAP
          </button>
        )}
      </Fragment>
    );
  }
}

export default inject('gsap')(observer(GsapTools));
