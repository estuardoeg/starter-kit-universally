import React, { PureComponent } from 'react';
import TimelineLite from 'gsap/TimelineLite';
import { add } from 'gsap-tools'; // eslint-disable-line

import s from './Hero.scss';

export default class Logo extends PureComponent {

  static defaultProps = {
    children: undefined,
  }

  get timelineEnter() {
    const t = new TimelineLite();

    const logoPath = this.logo.childNodes;
    const ease = 'Linear.easeNone';

    t.addLabel('start')
      .set(logoPath, { autoAlpha: 0, strokeDashoffset: 1500, strokeDasharray: '0, 9999', fill: 'transparent', stroke: '#ccc', transformOrigin: 'center' })
      .to(logoPath, 0.1, { autoAlpha: 1 })
      .staggerTo(logoPath, 1.5, { strokeDashoffset: 0, strokeDasharray: '1500, 1500', ease }, 0.5, 'start')
      .addLabel('endDraw')
      .staggerTo(logoPath, 0.5, { fill: '#000', ease: 'Power2.easeIn' }, 0.15, 'endDraw-=0.5')
      .staggerTo(logoPath, 0.5, { stroke: 'transparent', ease }, 0.15, 'endDraw-=0.5');

    return t;
  }

  get timelineLeave() {
    const t = new TimelineLite({});

    const logoPath = this.logo.childNodes;
    const ease = 'Linear.easeNone';

    const rect = logoPath[3].getBoundingClientRect();
    console.log(rect);
    const { left, top, height, width } = rect;

    const vw = window.outerWidth;
    const vh = window.outerHeight;

    const x = -((vw / 2) - ((left / 2) + 42));
    const y = -((vh / 2) - top);

    console.log(rect);

    t.addLabel('start')
      .set(logoPath, { transformOrigin: 'center' })
      .to(logoPath[0], 1.5, { rotation: -700, x: '-600%', y: -200, autoAlpha: 0, ease }, 'start')
      .to(logoPath[1], 1.5, { rotation: 700, x: '-400%', y: -600, autoAlpha: 0, ease }, 'start')
      .to(logoPath[2], 1.5, { rotation: 700, x: '400%', y: -600, autoAlpha: 0, ease }, 'start')
      .to(logoPath[3], 1.5, { rotation: 700, x: '600%', y: 600, autoAlpha: 0, ease }, 'start')
      .to(logoPath[4], 2, { fill: '#c00', scale: 10, x, y });

    return t;
  }

  render() {

    return (
      <svg ref={(el) => { this.logo = el; }} fill="none" stroke="transparent" strokeWidth="1" className={`${s.hero__svg} ${s.hero__logo}`} viewBox="0 0 1175 270">
        <path d="M177.5 7h69.7v256h-69.7v-41.8c-12.8 29-45.3 48.8-83.6 48.8C25.4 270 .4 223.5.4 166.6V7h69.7v145.7c0 39.5 15.7 62.1 49.9 62.1 35.4 0 57.5-27.9 57.5-70.8V7z" />
        <path d="M467.7 190.2c-11.4 17.9-29.7 26.9-56.6 26.9-37.7 0-67.4-26.7-69.7-64.5h192.2v-25C533.6 58.1 490.6 0 407 0c-76.6 0-134.1 58.1-134.1 138.8 0 80.7 56.9 131.2 135.9 131.2 50.1 0 87.6-19.6 108.5-54.2l-49.6-25.6zM406.4 51.1c38.9 0 56.9 28.5 59.2 58.1h-123c6.4-32 25.5-58.1 63.8-58.1z" />
        <path d="M629 263h-69.7V7H629v41.8C641.7 19.7 674.3 0 712.6 0c68.5 0 93.5 46.5 93.5 103.4V263h-69.7V117.3c0-39.5-15.7-62.1-49.9-62.1C651 55.2 629 83 629 126v137z" />
        <path d="M966.5 270c-79 0-134.7-55.2-134.7-134.7C831.8 55.7 887.5 0 966.5 0c79.5 0 135.3 55.7 135.3 135.3 0 79.5-55.8 134.7-135.3 134.7zm0-52.8c43 0 65-33.7 65-81.9 0-48.8-22.1-82.5-65-82.5-42.4 0-64.5 33.7-64.5 82.5 0 48.2 22.1 81.9 64.5 81.9z" />

        <path d="M1139.6 268.6c-19.3 0-35-15.7-35-35v-1.5c0-19.3 15.7-35 35-35s35 15.7 35 35v1.5c0 19.4-15.7 35-35 35z" />
      </svg>
    );
  }
}
