import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TimelineLite from 'gsap/TimelineLite';
import 'lib/DrawSVGPlugin';
import { add } from 'gsap-tools'; // eslint-disable-line

import s from './Hero.scss';

export default class Hero extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  static defaultProps = {
    children: undefined,
  }

  buildTimelines = () => {
    TimelineLite.defaultEase = 'Power2.easeIn';

    this.mainTimeline = new TimelineLite({ id: 'Everything' });
    this.greyCirclesTimeline = new TimelineLite({ id: 'Grey Circles' });
    this.circlesTimeline = new TimelineLite({ id: 'Circles' });
    this.logoTimeline = new TimelineLite({ id: 'Logo' });

    this.mainTimeline.addLabel('start');

    const greyCircle = this.greyCircles.childNodes;
    const circle = this.circles.childNodes;
    const logoPath = this.logo.childNodes;
    const ease = 'Linear.easeNone';

    this.greyCirclesTimeline
      .addLabel('start')
      .to(greyCircle, 0.3, { autoAlpha: 1, ease }, 'start')
      .to(greyCircle, 0.5, { scale: 1, ease }, 'start')
      .to(greyCircle, 3, { y: '20%', ease: 'Power4.easeOut' }, 'start+=0.25')
      .to(greyCircle, 0.25, { scale: 0.95, ease }, 'start+=0.5')
      .to(greyCircle, 0.5, { scale: 1 }, 'start+=0.75');

    this.circlesTimeline
      .addLabel('start')
      .to(circle, 0.3, { autoAlpha: 1, ease }, 'start')
      .to(circle, 0.5, { scale: 1, ease }, 'start')
      .to(circle, 3.5, { y: '0%', ease: 'Power4.easeOut' }, 'start+=0.25')
      .to(circle, 0.25, { scale: 0.85, ease }, 'start+=0.5')
      .to(circle, 0.5, { scale: 1 }, 'start+=0.75');

    this.logoTimeline
      .addLabel('start')
      .set(logoPath, { autoAlpha: 0, drawSVG: 0, fill: 'transparent', stroke: '#ccc' })
      .to(logoPath, 0.25, { autoAlpha: 1, ease })
      .to(logoPath, 1.5, { drawSVG: '100%', ease }, 'start+=0.25')
      .staggerTo(logoPath, 0.75, { fill: '#000', ease: 'Power4.easeOut' }, 0.2)
      .staggerTo(logoPath, 0.3, { stroke: 'transparent', ease }, 0.2, 'start+=2');

    this.mainTimeline
      .set([greyCircle, circle], { autoAlpha: 0, scale: 0.2, y: '-150%', transformOrigin: 'center' })
      .add(this.circlesTimeline, 'start')
      .add(this.greyCirclesTimeline, 'start+=0.5')
      .add(this.logoTimeline, 'start');

    this.disposer1 = add(this.mainTimeline);
    this.disposer2 = add(this.greyCirclesTimeline);
    this.disposer3 = add(this.circlesTimeline);
  }

  componentDidMount() {
    setTimeout(() => {
      this.buildTimelines();
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

          <svg className={s.hero__svg} viewBox="0 0 1670 1180">

            <linearGradient id="gradient-blue" x1="0%" y1="57%" x2="81%" y2="0%">
              <stop offset="0%" stopColor="#34c1fc" />
              <stop offset="100%" stopColor="#8ed8f7" />
            </linearGradient>
            <linearGradient id="gradient-pink" x1="94%" y1="106%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e888ff" />
              <stop offset="100%" stopColor="#cf5eea" />
            </linearGradient>

            <linearGradient id="gradient-green" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1de1ae" />
              <stop offset="100%" stopColor="#cbf9ed" />
            </linearGradient>

            <g ref={(el) => { this.greyCircles = el; }}>
              <circle cx="240" cy="116" r="266" fill="#eee" />
              <circle cx="1144" cy="165" r="130" fill="#eee" />
              <circle cx="432" cy="862" r="102" fill="#eee" />
            </g>

            <g ref={(el) => { this.circles = el; }}>
              <circle cx="495" cy="-75" r="165" fill="url(#gradient-green)" />
              <circle cx="780" cy="1290" r="190" fill="url(#gradient-pink)" />
              <circle cx="1254" cy="1062" r="432" fill="url(#gradient-blue)" />
            </g>
          </svg>

          <svg ref={(el) => { this.logo = el; }} fill="none" stroke="transparent" strokeWidth="1" className={`${s.hero__svg} ${s.hero__logo}`} viewBox="0 0 1175 270">
            <path d="M177.5 7h69.7v256h-69.7v-41.8c-12.8 29-45.3 48.8-83.6 48.8C25.4 270 .4 223.5.4 166.6V7h69.7v145.7c0 39.5 15.7 62.1 49.9 62.1 35.4 0 57.5-27.9 57.5-70.8V7z" />
            <path d="M467.7 190.2c-11.4 17.9-29.7 26.9-56.6 26.9-37.7 0-67.4-26.7-69.7-64.5h192.2v-25C533.6 58.1 490.6 0 407 0c-76.6 0-134.1 58.1-134.1 138.8 0 80.7 56.9 131.2 135.9 131.2 50.1 0 87.6-19.6 108.5-54.2l-49.6-25.6zM406.4 51.1c38.9 0 56.9 28.5 59.2 58.1h-123c6.4-32 25.5-58.1 63.8-58.1z" />
            <path d="M629 263h-69.7V7H629v41.8C641.7 19.7 674.3 0 712.6 0c68.5 0 93.5 46.5 93.5 103.4V263h-69.7V117.3c0-39.5-15.7-62.1-49.9-62.1C651 55.2 629 83 629 126v137z" />
            <path d="M966.5 270c-79 0-134.7-55.2-134.7-134.7C831.8 55.7 887.5 0 966.5 0c79.5 0 135.3 55.7 135.3 135.3 0 79.5-55.8 134.7-135.3 134.7zm0-52.8c43 0 65-33.7 65-81.9 0-48.8-22.1-82.5-65-82.5-42.4 0-64.5 33.7-64.5 82.5 0 48.2 22.1 81.9 64.5 81.9z" />

            <path d="M1139.6 268.6c-19.3 0-35-15.7-35-35v-1.5c0-19.3 15.7-35 35-35s35 15.7 35 35v1.5c0 19.4-15.7 35-35 35z" />
          </svg>

          {children}
        </div>
      </div>
    );
  }
}
