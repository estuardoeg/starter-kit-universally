import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';
import { inject, observer } from 'mobx-react';

import s from './Intro.scss';

class Intro extends Component {

  static propTypes = {
    listener: PropTypes.object,
    heading: PropTypes.string,
    copy: PropTypes.string,
    intro: PropTypes.bool,
  }

  componentWillReceiveProps(props) {
    if (props.intro === this.intro) {
      return;
    }

    this.intro = props.intro;

    if (props.intro) {
      this.animate();
    } else if (this.timeline) {
      this.timeline.reversed(this.timeline.reverse());
    }
  }

  animate = () => {
    if (!this.heading || !this.copy) {
      return;
    }

    const timeline = new TimelineLite({ id: 'Intro' });
    const ease = 'Power4.easeInOut';

    timeline.staggerFromTo(
      [this.heading, this.copy],
      1,
      { autoAlpha: 0, x: -30 },
      { autoAlpha: 1, x: 0, ease },
      0.045,
    );

    this.timeline = timeline;
    this.props.listener.add(this.timeline);

    return timeline;
  }

  componentWillUnmount() {
    this.props.listener.clear(this.timeline);
  }

  render() {
    const { heading, copy } = this.props;

    return (
      <div className={s.intro}>
        <h2
          className={s.intro__heading}
          ref={(c) => { this.heading = c; }}
        >
          {heading}
        </h2>

        <p
          className={s.intro__copy}
          ref={(c) => { this.copy = c; }}
        >
          {copy}
        </p>
      </div>
    );
  }
}

export default inject('listener')(observer(Intro));
