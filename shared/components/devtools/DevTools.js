import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import config from 'utils/config';

const showDevTools = process.env.BUILD_FLAG_IS_DEV === 'true' || config('herokuDevtools');
const MobxDevTools = showDevTools && require('mobx-react-devtools').default;
const GridOverlay = showDevTools && require('components/grid-overlay').default;
const GsapDevTools = showDevTools && require('components/gsaptools').Button;

const LOCAL_STORAGE_KEY_VISIBLE = '_devtoolsVisible';

@observer
class DevTools extends Component {

  @observable
  display = false;

  componentDidMount() {
    this.display = (localStorage.getItem(LOCAL_STORAGE_KEY_VISIBLE) === 'true');

    document.addEventListener('keydown', this.keydownRef = this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownRef);
  }

  onKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 75) {
      this.onToggleDisplay();
    }
  }

  onToggleDisplay = () => {
    this.display = !this.display;

    localStorage.setItem(LOCAL_STORAGE_KEY_VISIBLE, this.display);
  }

  render() {
    return (
      <div>
        <MobxDevTools noPanel={!this.display} />
        <GridOverlay noPanel={!this.display} columns={12} baseline={16} />
        <GsapDevTools noPanel={!this.display} />
      </div>
    );
  }
}

export default showDevTools ? DevTools : (() => null);
