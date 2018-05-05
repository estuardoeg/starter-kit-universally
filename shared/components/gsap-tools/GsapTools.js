/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { TimelineLite } from 'gsap';

import s from './GsapTools.scss';

function round(number, precision) {
  if (!number) {
    return 0;
  }

  const shift = (nbr, pre) => {
    const numArray = ('' + nbr).split('e'); // eslint-disable-line

    return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + pre) : pre)); // eslint-disable-line
  };

  return shift(Math.round(shift(number, +precision)), -precision);
}

class GsapTools extends Component {

  static propTypes = {
    listener: PropTypes.object,
    onClick: PropTypes.func,
    isVisible: PropTypes.bool,
  }

  @observable
  active;

  @observable
  isPlaying = false;

  @observable
  progress;

  @observable
  isVisible = false;

  constructor(props) {
    super(props);

    this.active = props.listener.active();
    this.isVisible = props.isVisible;
  }

  componentDidMount() {
    if (this.active.length > 0) {
      this.isPlaying = !this.active.paused();
    }

    this.master = new TimelineLite({
      onUpdate: () => {
        this.range.value = this.master.progress() * 100;
        this.progress = this.master.time();
      },
      // onComplete: () => master.restart(),
    });

    this.master.add(this.active);
  }

  onChange = ({ currentTarget }) => {
    const active = this.props.listener.active(currentTarget.value);

    this.active = active;
  }

  handleRewind = () => {
    this.active.restart();
  }

  handlePlayPause = () => {
    if (this.active.paused()) {
      this.active.play();
      this.isPlaying = true;
    } else {
      this.active.pause();
      this.isPlaying = false;
    }
  }

  handleLoop = () => {

  }

  handleRange = () => {
    this.active.progress(this.range.value / 100);
    this.progress = this.active.time();
    // this.master.add(this.active);
  }

  handleClose = () => {
    const { onClick, isVisible } = this.props;

    if (onClick) {
      this.isVisible = isVisible;
      return onClick();
    }

    this.isVisible = !this.isVisible;
  }

  render() {
    const { listener, onClick } = this.props;
    const visible = this.isVisible;

    return (
      <div className={s({ visible })}>
        <div className={s.gsapTools}>
          <header className={s.gsapTools__header}>
            {listener.timelines.size > 0 ? (
              <div className={s.gsapTools__list}>
                <select className={s.gsapTools__select} onChange={this.onChange}>
                  {listener.list.map((g, i) => (
                    <option
                      key={i} // eslint-disable-line
                      value={g}
                    >
                      {g}
                    </option>
                  ))}
                </select>

                <svg className={s.gsapTools__arrowDown} width="10px" height="7px" viewBox="0 0 10 7">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="translate(-1037.000000, -683.000000)" stroke="#FFFFFF">
                      <g transform="translate(909.000000, 655.000000)">
                        <g transform="translate(25.000000, 23.000000)">
                          <polyline points="103 6 108 10.647906 113 6" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            ) : (
              <p className={s.gsapTools__select}>No timeline</p>
            )}

            <p className={s.gsapTools__duration}>
              <span>{round(this.progress, 2)}</span> / {round(this.active._totalDuration, 2)}
            </p>

            <button className={s.gsapTools__cross} onClick={this.handleClose}>
              <svg width="12px" height="10px" viewBox="0 0 12 10">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                  <g transform="translate(-1293.000000, -680.000000)" stroke="#FFFFFF">
                    <g transform="translate(909.000000, 655.000000)">
                      <g transform="translate(385.000000, 25.000000)">
                        <path d="M0,0 L10,10" id="Path-3" />
                        <path d="M10,0 L0,10" id="Path-3-Copy" />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </header>

          <section className={s.gsapTools__inner}>
            <div className={s.gsapTools__controls}>
              <button className={s.gsapTools__rewind} onClick={this.handleRewind}>
                <svg width="19px" height="22px" viewBox="0 0 19 22">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-1048.000000, -757.000000)">
                      <g transform="translate(909.000000, 655.000000)">
                        <g transform="translate(140.000000, 102.000000)">
                          <path d="M3.99338491,1.04825511 L16.220333,9.22342206 C17.1385622,9.83736736 17.3852331,11.0794402 16.7712878,11.9976695 C16.6259369,12.2150594 16.4393641,12.4018341 16.2221317,12.5474203 L3.93708446,20.7806863 C3.01952019,21.395625 1.77718108,21.1502985 1.1622424,20.2327342 C0.940154459,19.9013517 0.822239522,19.5111255 0.823652014,19.1122077 L0.881751137,2.70377466 C0.885662182,1.59921208 1.7842576,0.706957722 2.88882017,0.710868767 C3.28217541,0.712261562 3.66638643,0.829617791 3.99338491,1.04825511 Z" fill="#CAD5DB" transform="translate(9.290454, 10.919773) scale(-1, 1) translate(-9.290454, -10.919773)" />
                          <path d="M0.818181818,2.45454545 L0.818181818,18.8181818" stroke="#CAD5DB" strokeWidth="2" strokeLinecap="round" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>

              <button className={s.gsapTools__playPause} onClick={this.handlePlayPause}>
                {this.isPlaying ? (
                  <svg width="18px" height="32px" viewBox="0 0 18 32">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                      <g transform="translate(-1110.000000, -752.000000)" stroke="#000000" strokeWidth="5">
                        <g transform="translate(909.000000, 655.000000)">
                          <g transform="translate(202.000000, 100.000000)">
                            <path d="M13.8181818,0 L13.8181818,26.0200005" />
                            <path d="M1.81818182,0 L1.81818182,26.0200005" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                ) : (
                  <svg width="25px" height="32px" viewBox="0 0 25 32">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(-1107.000000, -752.000000)" fill="#000000">
                        <g transform="translate(909.000000, 655.000000)">
                          <path d="M201.210384,97.5792367 L221.598998,111.211447 C222.517228,111.825392 222.763899,113.067465 222.149953,113.985694 C222.004602,114.203084 221.81803,114.389859 221.600797,114.535445 L201.115302,128.264536 C200.197737,128.879475 198.955398,128.634148 198.34046,127.716584 C198.118372,127.385202 198.000457,126.994975 198.001869,126.596058 L198.09875,99.2347563 C198.102661,98.1301937 199.001257,97.2379393 200.105819,97.2418504 C200.499175,97.2432432 200.883386,97.3605994 201.210384,97.5792367 Z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                )}
              </button>

              <button className={s.gsapTools__loop} onClick={this.handleLoop}>
                <svg width="19px" height="22px" viewBox="0 0 19 22">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="translate(-1169.000000, -757.000000)" stroke="#CAD5DB" strokeWidth="2">
                      <g transform="translate(909.000000, 655.000000)">
                        <g transform="translate(261.000000, 103.000000)">
                          <path d="M0.373128255,10.1908366 L0.373128255,10.1908366 C0.373128255,6.36234656 3.47673264,3.25874217 7.30522267,3.25874217 L15.8986918,3.25874217" />
                          <polyline transform="translate(15.144940, 3.333333) rotate(-90.000000) translate(-15.144940, -3.333333)" points="11.8116072 1.8133725 15.1449405 4.85329416 18.4782738 1.8133725" />

                          <g transform="translate(8.333333, 14.583333) scale(-1, -1) translate(-8.333333, -14.583333) translate(0.000000, 9.166667)">
                            <path d="M0.373128255,10.1908366 L0.373128255,10.1908366 C0.373128255,6.36234656 3.47673264,3.25874217 7.30522267,3.25874217 L15.8986918,3.25874217" />
                            <polyline transform="translate(15.144940, 3.333333) rotate(-90.000000) translate(-15.144940, -3.333333)" points="11.8116072 1.8133725 15.1449405 4.85329416 18.4782738 1.8133725" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            </div>

            <div className={s.gsapTools__timeline}>
              <input
                className={s.gsapTools__input}
                type="range"
                onChange={this.handleRange}
                ref={(c) => { this.range = c; }}
              />
            </div>
          </section>
        </div>

        {!onClick && (
          <button
            className={s.gsapTools__toggle}
            onClick={this.handleClose}
          >
            GSAP
          </button>
        )}
      </div>
    );
  }
}

export default inject('listener')(observer(GsapTools));
