import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import clamp from 'lodash/clamp';
import { TweenLite } from 'gsap';

import s from './Range.scss';

const HANDLE_WIDTH = 20;
const HANDLE_MEDIAN_WIDTH = HANDLE_WIDTH / 2;
const MARKER_WIDTH = 10;

export default class Range extends PureComponent {

  static propTypes = {
    value: PropTypes.number,
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragMarkerIn: PropTypes.func,
    onDragMarkerOut: PropTypes.func,
  }

  static defaultProps = {
    value: 0,
  }

  markerIn = 0
  markerOut = 0

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

    setTimeout(() => {
      this.markerOut = this.range.offsetWidth;
    });
  }

  get calculateFillWidth() {
    if (!this.range) {
      return;
    }

    return (this.markerOut + MARKER_WIDTH) - this.markerIn;
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
    const { onDragStart } = this.props;

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);

    if (onDragStart) {
      onDragStart(e);
    }
  }

  handleDrag = (e) => {
    const { onDrag, onDragStart } = this.props;
    const { currentTarget } = e;

    if (!onDrag) {
      return;
    }

    const value = this.position(e);

    onDrag(value);

    if (currentTarget.id === 'range') {
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleEnd);

      if (onDragStart) {
        onDragStart();
      }
    }
  }

  handleEnd = () => {
    const { onDragEnd } = this.props;

    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mousemove', this.handleMarkerInDrag);
    document.removeEventListener('mousemove', this.handleMarkerDragOut);
    document.removeEventListener('mouseup', this.handleEnd);

    if (onDragEnd) {
      onDragEnd();
    }
  }

  handleMarkerInDragStart = () => {
    this.fillWidth = this.fill.offsetWidth;

    document.addEventListener('mousemove', this.handleMarkerInDrag);
    document.addEventListener('mouseup', this.handleEnd);
  }

  handleMarkerInDrag = (e) => {
    const { onDragMarkerIn } = this.props;

    if (!onDragMarkerIn) {
      return;
    }

    const value = this.position(e);
    const { offsetWidth: rw } = this.range;
    const left = (value * (rw - MARKER_WIDTH)) / 100;

    this.markerIn = left;

    if (left < (this.markerOut - MARKER_WIDTH)) {
      onDragMarkerIn(value);

      TweenLite.set(
        this.rangeIn,
        { left },
      );

      TweenLite.set(
        this.fill,
        {
          left,
          width: this.calculateFillWidth,
        },
      );
    }
  }

  handleMarkerOutDragStart = () => {
    this.fillWidth = this.fill.offsetWidth;

    document.addEventListener('mousemove', this.handleMarkerDragOut);
    document.addEventListener('mouseup', this.handleEnd);
  }

  handleMarkerDragOut = (e) => {
    const { onDragMarkerOut } = this.props;

    if (!onDragMarkerOut) {
      return;
    }

    const value = this.position(e);
    const { offsetWidth: rw } = this.range;
    const val = (value * (rw - MARKER_WIDTH)) / 100;
    const right = (rw - MARKER_WIDTH) - val;

    this.markerOut = val;

    if (val >= (this.markerIn + MARKER_WIDTH)) {
      onDragMarkerOut(value);

      TweenLite.set(
        this.rangeOut,
        { right },
      );

      TweenLite.set(
        this.fill,
        { width: this.calculateFillWidth },
      );
    }
  }

  getPositionFromValue = (value) => {
    const { limit } = this.state;
    const percentage = value / 100;
    const val = Math.round(percentage * limit);

    return val;
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
          onMouseDown={this.handleMarkerInDragStart}
        >
          <svg width="10" height="18" viewBox="0 0 10 18">
            <path fille="#cad5db" d="M5.8,17.7c-0.4,0.4-0.9,0.4-1.3,0L0,13.3V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1v12.3L5.8,17.7z" />
          </svg>
        </button>

        <button
          ref={(c) => { this.rangeOut = c; }}
          className={s(s.range__markers, s.range__markersOut)}
          onMouseDown={this.handleMarkerOutDragStart}
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
          <div
            ref={(c) => { this.fill = c; }}
            className={s.range__fill}
            style={fillStyle}
          />

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
