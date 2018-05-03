import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';

import GsapTools from 'components/gsap-tools';

import s from './Heading.scss';

@GsapTools
export default class Heading extends PureComponent {

  static propTypes = {
    heading: PropTypes.bool,
    copy: PropTypes.string,
  }

  componentWillReceiveProps(props) {
    if (props.heading === this.heading) {
      return;
    }

    this.heading = props.heading;

    if (props.heading) {
      this.animate();
    } else if (this.timeline) {
      this.timeline.reversed(this.timeline.reverse());
    }
  }

  animate = () => {
    if (!this.copy || !this.stripe) {
      return;
    }

    const timeline = new TimelineLite({ id: 'Heading' });
    const ease = 'Power4.easeInOut';

    timeline.addLabel('start');

    timeline.fromTo(
      this.stripe,
      1.5,
      { x: '-100%' },
      { x: '100%', ease },
    );

    timeline.fromTo(
      this.copy,
      0.75,
      { autoAlpha: 0 },
      { autoAlpha: 1, ease },
      'start+=0.6',
    );

    this.timeline = timeline;
    return timeline;
  }

  render() {
    const { copy } = this.props;

    return (
      <div className={s.heading}>
        <div className={s.heading__wrapper}>
          <h1 className={s.heading__copy} ref={(c) => { this.copy = c; }}>{copy}</h1>
          <div className={s.heading__stripe} ref={(c) => { this.stripe = c; }} />
        </div>
      </div>
    );
  }
}
