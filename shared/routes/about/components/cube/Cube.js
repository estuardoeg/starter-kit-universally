import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';
import { inject, observer } from 'mobx-react';

import s from './Cube.scss';

class Cube extends Component {

  static propTypes = {
    listener: PropTypes.object,
    move: PropTypes.bool,
  }

  componentWillReceiveProps(props) {
    if (props.move === this.move) {
      return;
    }

    this.move = props.move;

    if (props.move) {
      this.animate();
    } else if (this.timeline) {
      this.timeline.reversed(this.timeline.reverse());
    }
  }

  animate = () => {
    if (!this.cube) {
      return;
    }

    const timeline = new TimelineLite({ id: 'Cube' });
    const ease = 'Power4.easeInOut';

    timeline.fromTo(
      this.cube,
      2,
      { x: 0 },
      { x: 200, ease },
    );

    this.timeline = timeline;
    this.props.listener.add(this.timeline);

    return timeline;
  }

  componentWillUnmount() {
    this.props.listener.clear(this.timeline);
  }

  render() {
    return (
      <div className={s.cube}>
        <div
          className={s.cube__shape}
          ref={(c) => { this.cube = c; }}
        />
      </div>
    );
  }
}

export default inject('listener')(observer(Cube));
