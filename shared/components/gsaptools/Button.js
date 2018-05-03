import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

import s from './Button.scss';

// Key to store visibility state of the gsaptools
const LOCAL_STORAGE_GSAPTOOLS = '_devtoolsGsapToolsVisible';

class Button extends Component {

  static propTypes = {
    gsap: PropTypes.object,
    noPanel: PropTypes.bool,
  }

  static defaultProps = {
    noPanel: true,
  }

  @observable
  isVisible = false;

  componentDidMount() {
    this.setup();
  }

  componentWillReceiveProps() {
    this.setup();
  }

  setup = () => {
    this.isVisible = (localStorage.getItem(LOCAL_STORAGE_GSAPTOOLS) === 'true');
    this.props.gsap.toggle = this.isVisible;
  }

  onToggleGsapTools = () => {
    this.isVisible = !this.isVisible;
    this.props.gsap.toggle = this.isVisible;

    localStorage.setItem(LOCAL_STORAGE_GSAPTOOLS, this.isVisible);
  }

  render() {
    const { noPanel } = this.props;
    const toggle = this.isVisible;

    return (
      <Fragment>
        {!noPanel && (
          <button className={s(s.button, { toggle })} onClick={this.onToggleGsapTools}>
            GSAP
          </button>
        )}
      </Fragment>
    );
  }
}

export default inject('gsap')(observer(Button));
