import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';

import GsapTools from 'components/gsaptools';

import s from './Cube.scss';

@GsapTools
export default class Cube extends PureComponent {

  static propTypes = {
    move: PropTypes.bool,
  }

  componentWillReceiveProps(props) {
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
      1,
      { x: 0 },
      { x: 200, ease },
    );

    this.timeline = timeline;
    return timeline;
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
