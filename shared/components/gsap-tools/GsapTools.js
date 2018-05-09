/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { TimelineLite, TweenLite } from 'gsap';

import round from './round';
import Range from './Range';
import s from './GsapTools.scss';

const PADDING = 20;

class GsapTools extends Component {

  static propTypes = {
    listener: PropTypes.object,
    onClick: PropTypes.func,
    isVisible: PropTypes.bool,
  }

  @observable
  isVisible = false;

  @observable
  playIcon = true;

  @observable
  active;

  @observable
  progress;

  @observable
  value;

  @observable
  isLoop = false;

  constructor(props) {
    super(props);

    this.setup(props);
  }

  setup = (props) => {
    const { isVisible, listener } = props || this.props;

    // Get the first timeline of the Map if one exist
    this.active = listener.active();

    // Is the GsapTools should be visible or hidden
    this.isVisible = isVisible;
  }

  componentDidMount() {
    setTimeout(() => {
      this.initUI();

      this.master = new TimelineLite({
        onUpdate: () => {
          this.value = this.master.progress() * 100;
          this.progress = this.master.time();
        },
        onComplete: () => {
          if (this.isLoop) {
            this.master.restart();
          } else if (this.master.totalProgress() === 1) {
            this.master.pause();
            this.playIcon = true;
          }
        },
      });

      this.master.add(this.active);
      this.playIcon = false;
    });
  }

  componentWillReceiveProps(props) {
    this.setup(props);
  }

  /*
   * Internal functions
   */

  initUI = () => {
    if (!this.container) {
      return;
    }

    const { innerWidth, innerHeight } = window;
    const { width: cw, height: ch } = this.container.getBoundingClientRect();

    TweenLite.set(
      this.container,
      {
        top: innerHeight - ch - PADDING,
        left: innerWidth - cw - PADDING - 14,
      },
    );
  }

  handleUIClose = () => {
    const { onClick, isVisible } = this.props;

    if (onClick) {
      this.isVisible = isVisible;
      return onClick();
    }

    this.isVisible = !this.isVisible;
  }

  mouseEvent = (e) => {
    const x = !e.touches ? e.clientX : e.touches[0].clientX;
    const y = !e.touches ? e.clientY : e.touches[0].clientY;

    return {
      x,
      y,
    };
  }

  handleUIBoxPosition = (e) => {
    const { width: hw, height: hh, top: ht, left: hl } = this.header.getBoundingClientRect();
    const { width: cw, height: ch, top: ct, left: cl } = this.container.getBoundingClientRect();

    const x = hw - (hw - (this.mouseEvent(e).x - hl));
    const y = hh - (hh - (this.mouseEvent(e).y - ht));

    const top = ch - (ch - (this.mouseEvent(e).y - ct));
    const left = cw - (cw - (this.mouseEvent(e).x - cl));
    const right = cw - left;
    const bottom = ch - top;

    this.drag = {
      top,
      right,
      bottom,
      left,
      x,
      y,
    };
  }

  handleUIBox = (e) => {
    this.handleUIBoxPosition(e);

    document.addEventListener('mousemove', this.handleUIBoxDrag);
    document.addEventListener('mouseup', this.handleUIBoxEnd);
  }

  handleUIBoxDrag = (e) => {
    if (!this.container) {
      return;
    }

    const pos = this.mouseEvent(e);
    const { innerWidth, innerHeight } = window;
    const { top, right, bottom, left, x, y } = this.drag;

    if (
      (pos.x - PADDING) < left ||
      (pos.y - PADDING) < top ||
      (pos.x + right) > (innerWidth - PADDING) ||
      (pos.y + bottom) > (innerHeight - PADDING)
    ) {
      return;
    }

    TweenLite.set(
      this.container,
      {
        top: pos.y - y,
        left: pos.x - x,
      },
    );
  }

  handleUIBoxEnd = () => {
    document.removeEventListener('mousemove', this.handleUIBoxDrag);
    document.removeEventListener('mouseup', this.handleUIBoxEnd);
  }

  /*
   * Functions to manage GSAP's timelines
   */

  handleList = ({ currentTarget }) => {
    const active = this.props.listener.active(currentTarget.value);

    this.active = active;

    this.master.clear();
    this.master.add(this.active);
    this.master.play();
    this.master.seek(0);

    this.playIcon = false;
    this.value = 0;
  }

  handleTimeScale = ({ currentTarget }) => {
    this.master.timeScale(currentTarget.value);
  }

  handleRewind = () => {
    if (this.master.paused()) {
      this.playIcon = true;

      if (this.inTime > 0) {
        this.master.seek(this.inTime);
        this.value = this.inTime;
      } else {
        this.master.seek(0);
        this.value = 0;
      }
    } else {
      this.master.restart();
      this.playIcon = false;
    }
  }

  handlePlayPause = () => {
    if (this.master.totalProgress() === 1) {
      this.playIcon = false;
      this.master.restart();

      return;
    }

    if (this.master.paused()) {
      this.master.play();
      this.playIcon = false;
    } else {
      this.master.pause();
      this.playIcon = true;
    }
  }

  handleLoop = () => {
    this.isLoop = !this.isLoop;
  }

  handleRange = (value) => {
    this.value = value;
    this.master.progress(this.value / 100);
    this.progress = this.master.time();
  }

  handleMarkerInRange = (value) => {
    this.inTime = value;
  }

  handleMarkerRange = (value) => {
    this.outTime = value;
  }

  handleRangeStart = () => {
    this.wasPlaying = !this.master.paused();

    if (this.wasPlaying) {
      this.master.pause();
    }
  }

  handleRangeEnd = () => {
    if (this.wasPlaying) {
      this.master.play();
    }
  }

  render() {
    const { listener, onClick } = this.props;
    const visible = this.isVisible;
    const loop = this.isLoop;

    return (
      <div
        className={s(s.gsapTools, { visible, loop })}
        ref={(c) => { this.container = c; }}
      >
        <div className={s.gsapTools__container}>
          <div className={s.gsapTools__box}>
            <header // eslint-disable-line
              className={s.gsapTools__header}
              onMouseDown={this.handleUIBox}
              ref={(c) => { this.header = c; }}
            >
              {listener.timelines.size > 0 ? (
                <div className={s.gsapTools__list}>
                  <select className={s.gsapTools__select} onChange={this.handleList}>
                    {listener.keys.map((g, i) => (
                      <option
                        key={i} // eslint-disable-line
                        value={g}
                      >
                        {g}
                      </option>
                    ))}
                  </select>

                  <svg className={s.gsapTools__arrowDown} width="11" height="5.6" viewBox="0 0 11 5.6">
                    <path fill="#fff" d="M10.8,0.9l-5,4.6C5.7,5.6,5.6,5.6,5.5,5.6s-0.2,0-0.3-0.1l-5-4.6C0,0.7-0.1,0.4,0.1,0.2c0.2-0.2,0.5-0.2,0.7,0l4.7,4.3l4.7-4.3c0.2-0.2,0.5-0.2,0.7,0C11.1,0.4,11,0.7,10.8,0.9z" />
                  </svg>
                </div>
              ) : (
                <p className={s.gsapTools__select}>No timeline</p>
              )}

              <p className={s.gsapTools__duration}>
                <span>{round(this.progress)}</span> / {round(this.active._totalDuration)}
              </p>

              <select
                className={s.gsapTools__scale}
                onChange={this.handleTimeScale}
                defaultValue={1}
              >
                <option value="0.2">0.2x</option>
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="5">5x</option>
              </select>

              <button className={s.gsapTools__cross} onClick={this.handleUIClose}>
                <svg width="11" height="11" viewBox="0 0 11 11">
                  <path fill="#fff" d="M10.9,10.1c0.2,0.2,0.2,0.5,0,0.7C10.8,11,10.6,11,10.5,11s-0.3,0-0.4-0.1L5.5,6.2l-4.6,4.6C0.8,11,0.6,11,0.5,11s-0.3,0-0.4-0.1c-0.2-0.2-0.2-0.5,0-0.7l4.6-4.6L0.1,0.9C0,0.7,0,0.3,0.1,0.1s0.5-0.2,0.7,0l4.6,4.6l4.6-4.6c0.2-0.2,0.5-0.2,0.7,0s0.2,0.5,0,0.7L6.2,5.5L10.9,10.1z" />
                </svg>
              </button>
            </header>

            <section className={s.gsapTools__inner}>
              <div className={s.gsapTools__controls}>
                <button className={s.gsapTools__rewind} onClick={this.handleRewind}>
                  <svg width="17.9" height="20.4" viewBox="0 0 17.9 20.4">
                    <path fill="#cad5db" d="M17.9,18.4c0,0.4-0.1,0.8-0.3,1.1c-0.6,0.9-1.9,1.2-2.8,0.5L2.5,11.8c-0.2-0.1-0.4-0.3-0.5-0.5v6.8c0,0.6-0.4,1-1,1s-1-0.4-1-1V1.7c0-0.6,0.4-1,1-1s1,0.4,1,1v7.3c0.1-0.2,0.3-0.4,0.5-0.5l12.2-8.2C15.1,0.1,15.5,0,15.9,0c1.1,0,2,0.9,2,2L17.9,18.4z" />
                  </svg>
                </button>

                <button className={s.gsapTools__playPause} onClick={this.handlePlayPause}>
                  {this.playIcon ? (
                    <svg width="24.5" height="31.4" viewBox="0 0 24.5 31.4">
                      <path fill="#000" d="M3.2,0.3L23.6,14c0.9,0.6,1.2,1.9,0.6,2.8c-0.1,0.2-0.3,0.4-0.5,0.5L3.1,31c-0.9,0.6-2.2,0.4-2.8-0.5C0.1,30.1,0,29.8,0,29.4V2c0-1.1,0.9-2,2-2C2.4,0,2.9,0.1,3.2,0.3z" />
                    </svg>
                  ) : (
                    <svg width="17" height="31" viewBox="0 0 17 31">
                      <path fill="#000" d="M14.5,0C13.1,0,12,1.1,12,2.5v26c0,1.4,1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5v-26C17,1.1,15.9,0,14.5,0z" />
                      <path fill="#000" d="M2.5,0C1.1,0,0,1.1,0,2.5v26C0,29.9,1.1,31,2.5,31S5,29.9,5,28.5v-26C5,1.1,3.9,0,2.5,0z" />
                    </svg>
                  )}
                </button>

                <button className={s.gsapTools__loop} onClick={this.handleLoop}>
                  <svg width="18.7" height="22" viewBox="0 0 18.7 22">
                    <path fill="#cad5db" d="M18.4,3.7l-3-3.3c-0.4-0.4-1-0.4-1.4-0.1c-0.4,0.4-0.4,1-0.1,1.4l1.4,1.6h-7c-4.4,0-7.9,3.6-7.9,7.9c0,0.6,0.4,1,1,1s1-0.4,1-1c0-3.3,2.7-5.9,5.9-5.9h7.2L13.9,7c-0.4,0.4-0.3,1,0.1,1.4c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3l3-3.3C18.7,4.6,18.7,4,18.4,3.7z" />
                    <path fill="#cad5db" d="M17.3,9.8c-0.6,0-1,0.4-1,1c0,3.3-2.7,5.9-5.9,5.9H3.2L4.8,15c0.4-0.4,0.3-1-0.1-1.4s-1-0.3-1.4,0.1l-3,3.3c-0.3,0.4-0.3,1,0,1.3l3,3.3C3.5,21.9,3.8,22,4,22c0.2,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0.1-1.4l-1.4-1.6h7c4.4,0,7.9-3.6,7.9-7.9C18.3,10.3,17.8,9.8,17.3,9.8z" />
                  </svg>
                </button>
              </div>

              <div className={s.gsapTools__timeline}>
                <Range
                  value={this.value}
                  onDrag={this.handleRange}
                  onDragStart={this.handleRangeStart}
                  onDragEnd={this.handleRangeEnd}
                  onDragMarkerIn={this.handleMarkerInRange}
                  onDragMarkerOut={this.handleMarkerRange}
                />
              </div>
            </section>
          </div>

          {!onClick && (
            <button
              className={s.gsapTools__toggle}
              onClick={this.handleUIClose}
            >
              GSAP
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default inject('listener')(observer(GsapTools));
