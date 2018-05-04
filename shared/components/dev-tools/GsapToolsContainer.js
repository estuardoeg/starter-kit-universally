import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import GsapTools from 'components/gsap-tools';

import s from './GsapToolsContainer.scss';

// Key to store visibility state of the gsaptools
const LOCAL_STORAGE_GSAPTOOLS = '_devtoolsGsapToolsVisible';

@observer
export default class GsapToolsContainer extends Component {

  static propTypes = {
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
    this.isVisible = localStorage.getItem(LOCAL_STORAGE_GSAPTOOLS) === 'true';
  }

  onToggleGsapTools = () => {
    this.isVisible = !this.isVisible;
    localStorage.setItem(LOCAL_STORAGE_GSAPTOOLS, this.isVisible);
  }

  render() {
    const { noPanel } = this.props;
    const visible = this.isVisible;

    return (
      <Fragment>
        {!noPanel && (
          <button className={s(s.button, { visible })} onClick={this.onToggleGsapTools}>
            GSAP
          </button>
        )}

        {visible && (
          <GsapTools />
        )}
      </Fragment>
    );
  }
}
