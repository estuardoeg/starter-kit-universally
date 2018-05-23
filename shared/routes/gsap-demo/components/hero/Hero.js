import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TimelineLite from 'gsap/TimelineLite';
import { add } from 'gsap-tools'; // eslint-disable-line

import Circles from './Circles';
import Logo from './Logo';

import s from './Hero.scss';

export default class Hero extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  static defaultProps = {
    children: undefined,
  }

  animate = () => {
    const mainTimeline = new TimelineLite({ id: 'Everything' });
    const circlesTimeline = new TimelineLite({ id: 'Circles' });
    const logoTimeline = new TimelineLite({ id: 'Logo' });

    mainTimeline.addLabel('start');

    // get external timelines
    circlesTimeline.add(this.circles.timelineEnter).add(this.circles.timelineLeave);
    logoTimeline.add(this.logo.timelineEnter).add(this.logo.timelineLeave, '+=0.75');

    mainTimeline
      .add(circlesTimeline, 'start')
      .add(logoTimeline, 'start');

    this.disposer1 = add(mainTimeline);
    this.disposer2 = add(circlesTimeline);
    this.disposer3 = add(logoTimeline);
  }

  componentDidMount() {
    setTimeout(() => {
      this.animate();
    }, 1000);
  }

  componentWillUnmount() {
    this.disposer1();
    this.disposer2();
    this.disposer3();
  }

  render() {
    const { children } = this.props;

    return (
      <div className={s.hero}>
        <div className={s.hero__inner}>

          <Circles ref={(el) => { this.circles = el; }} />
          <Logo ref={(el) => { this.logo = el; }} />

          {children}
        </div>
      </div>
    );
  }
}
