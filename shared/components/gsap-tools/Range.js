import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import clamp from 'lodash/clamp';
import { TweenLite } from 'gsap';

import s from './Range.scss';

const HANDLE_MEDIAN_WIDTH = 10;
const MARKER_WIDTH = 10;

export default class Range extends PureComponent {

  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    onChangeStart: PropTypes.func,
    onChangeComplete: PropTypes.func,
    onChangeMarkerIn: PropTypes.func,
    onChangeMarkerOut: PropTypes.func,
  }

  static defaultProps = {
    value: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      limit: 0,
    };
  }

  componentDidMount() {
    this.handleUpdate();

    const resizeObserver = new ResizeObserver(this.handleUpdate);

    resizeObserver.observe(this.range);
  }

  handleUpdate = () => {
    if (!this.range || !this.handle) {
      return;
    }

    const { offsetWidth: rw } = this.range;
    const { offsetWidth: hw } = this.handle;

    this.setState({ limit: rw - hw });
  }

  handleStart = (e) => {
    const { onChangeStart } = this.props;

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);

    if (onChangeStart) {
      onChangeStart(e);
    }
  }

  handleDrag = (e) => {
    const { onChange, onChangeStart } = this.props;
    const { currentTarget } = e;

    if (!onChange) {
      return;
    }

    const value = this.position(e);

    onChange(value);

    if (currentTarget.id === 'range') {
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleEnd);

      if (onChangeStart) {
        onChangeStart();
      }
    }
  }

  handleEnd = () => {
    const { onChangeComplete } = this.props;

    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mousemove', this.handleDragIn);
    document.removeEventListener('mousemove', this.handleDragOut);
    document.removeEventListener('mouseup', this.handleEnd);

    if (onChangeComplete) {
      onChangeComplete();
    }
  }

  handleDragIn = (e) => {
    const { onChangeMarkerIn } = this.props;

    if (!onChangeMarkerIn) {
      return;
    }

    const value = this.position(e);
    const { offsetWidth: rw } = this.range;
    const left = (value * (rw - MARKER_WIDTH)) / 100;

    onChangeMarkerIn(value);

    TweenLite.set(
      this.rangeIn,
      { left },
    );

    document.addEventListener('mousemove', this.handleDragIn);
    document.addEventListener('mouseup', this.handleEnd);
  }

  handleDragOut = (e) => {
    const { onChangeMarkerOut } = this.props;

    if (!onChangeMarkerOut) {
      return;
    }

    const value = this.position(e);
    const { offsetWidth: rw } = this.range;
    const val = (value * (rw - MARKER_WIDTH)) / 100;
    const right = (rw - MARKER_WIDTH) - val;

    onChangeMarkerOut(value);

    TweenLite.set(
      this.rangeOut,
      { right },
    );

    document.addEventListener('mousemove', this.handleDragOut);
    document.addEventListener('mouseup', this.handleEnd);
  }

  getPositionFromValue = (value) => {
    const { limit } = this.state;
    const percentage = value / 100;

    return Math.round(percentage * limit);
  }

  getValueFromPosition = (pos) => {
    const { limit } = this.state;
    const percentage = clamp(pos, 0, limit) / (limit || 1);

    return Math.round(percentage * 100);
  }

  position = (e) => {
    const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
    const { left } = this.range.getBoundingClientRect();
    const pos = coordinate - left - HANDLE_MEDIAN_WIDTH;

    return this.getValueFromPosition(pos);
  }

  coordinates = (pos) => {
    const value = this.getValueFromPosition(pos);
    const position = this.getPositionFromValue(value);

    return position + HANDLE_MEDIAN_WIDTH;
  }

  render() {
    const { value } = this.props;

    // TODO: Move handle with gsap instead
    const position = this.getPositionFromValue(value);
    const coords = this.coordinates(position);
    const fillStyle = { width: `${coords}px` };
    const handleStyle = { left: `${coords}px` };

    return (
      <div className={s.range}>
        <button
          ref={(c) => { this.rangeIn = c; }}
          className={s(s.range__markers, s.range__markersIn)}
          onMouseDown={this.handleDragIn}
          onMouseUp={this.handleEndIn}
        >
          <svg width="10" height="18" viewBox="0 0 10 18">
            <path fille="#cad5db" d="M5.8,17.7c-0.4,0.4-0.9,0.4-1.3,0L0,13.3V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1v12.3L5.8,17.7z" />
          </svg>
        </button>

        <button
          ref={(c) => { this.rangeOut = c; }}
          className={s(s.range__markers, s.range__markersOut)}
          onMouseDown={this.handleDragOut}
          onMouseUp={this.handleEndOut}
        >
          <svg width="10" height="18" viewBox="0 0 10 18">
            <path fille="#cad5db" d="M5.8,17.7c-0.4,0.4-0.9,0.4-1.3,0L0,13.3V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1v12.3L5.8,17.7z" />
          </svg>
        </button>

        <div // eslint-disable-line
          ref={(c) => { this.range = c; }}
          className={s.range__input}
          onMouseDown={this.handleDrag}
          onMouseUp={this.handleEnd}
          onTouchStart={this.handleStart}
          onTouchEnd={this.handleEnd}
          id="range"
        >
          <div className={s.range__fill} style={fillStyle} />

          <button
            ref={(c) => { this.handle = c; }}
            className={s.range__handle}
            onMouseDown={this.handleStart}
            onTouchMove={this.handleDrag}
            onTouchEnd={this.handleEnd}
            style={handleStyle}
          />
        </div>
      </div>
    );
  }
}
