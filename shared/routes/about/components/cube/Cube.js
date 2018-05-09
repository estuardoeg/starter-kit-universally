import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TimelineLite from 'gsap/TimelineLite';
import { add, remove } from 'gsap-tools';

import s from './Cube.scss';

export default class Cube extends PureComponent {

  static propTypes = {
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

    add(this.timeline);

    return timeline;
  }

  componentWillUnmount() {
    remove(this.timeline);
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
