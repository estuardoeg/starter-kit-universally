import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import clamp from 'lodash/clamp';

import s from './Range.scss';

export default class Range extends PureComponent {

  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragComplete: PropTypes.func,
  }

  static defaultProps = {
    min: 0,
    max: 100,
    value: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      limit: 0,
      grab: 0,
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

    const sliderPos = this.range.offsetWidth;
    const handlePos = this.handle.offsetWidth;

    this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2,
    });
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
    e.stopPropagation();

    const { onChange, onDragStart } = this.props;

    if (!onChange) {
      return;
    }

    const value = this.position(e);

    if (onChange) {
      onChange(value, e);
    }
  }

  handleEnd = (e) => {
    const { onDragComplete } = this.props;

    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleEnd);

    if (onDragComplete) {
      onDragComplete(e);
    }
  }

  getPositionFromValue = (value) => {
    const { min, max } = this.props;
    const { limit } = this.state;

    const diffMaxMin = max - min;
    const diffValMin = value - min;
    const percentage = diffValMin / diffMaxMin;
    const pos = Math.round(percentage * limit);

    return pos;
  }

  getValueFromPosition = (pos) => {
    const { min, max } = this.props;
    const { limit } = this.state;

    const percentage = clamp(pos, 0, limit) / (limit || 1);
    const baseVal = Math.round(percentage * (max - min));
    const value = baseVal + min;

    return clamp(value, min, max);
  }

  position = (e) => {
    const { grab } = this.state;
    const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
    const { left } = this.range.getBoundingClientRect();
    const pos = coordinate - left - grab;

    return this.getValueFromPosition(pos);
  }

  coordinates = (pos) => {
    const { grab } = this.state;
    const value = this.getValueFromPosition(pos);
    const position = this.getPositionFromValue(value);

    return position + grab;
  }

  render() {
    const { value } = this.props;

    const position = this.getPositionFromValue(value);
    const coords = this.coordinates(position);
    const fillStyle = { width: `${coords}px` };
    const handleStyle = { left: `${coords}px` };

    return (
      <div // eslint-disable-line
        ref={(c) => { this.range = c; }}
        className={s.range}
        onMouseDown={this.handleDrag}
        onMouseUp={this.handleEnd}
        onTouchStart={this.handleStart}
        onTouchEnd={this.handleEnd}
      >
        <div className={s.range__fill} style={fillStyle} />

        <button
          ref={(c) => { this.rangeIn = c; }}
          className={s(s.range__points, s.range__pointsIn)}
        >
          <svg width="10.1" height="17.9" viewBox="0 0 10.1 17.9">
            <path fille="#cad5db" d="M10.1,13.3L10.1,13.3l-4.2,4.4c-0.4,0.4-1,0.4-1.4,0L0,13.3l0.1-0.1V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1L10.1,13.3L10.1,13.3z" />
          </svg>
        </button>

        <button
          ref={(c) => { this.rangeOut = c; }}
          className={s(s.range__points, s.range__pointsOut)}
        >
          <svg width="10.1" height="17.9" viewBox="0 0 10.1 17.9">
            <path fille="#cad5db" d="M10.1,13.3L10.1,13.3l-4.2,4.4c-0.4,0.4-1,0.4-1.4,0L0,13.3l0.1-0.1V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1L10.1,13.3L10.1,13.3z" />
          </svg>
        </button>

        <button
          ref={(c) => { this.handle = c; }}
          className={s.range__handle}
          onMouseDown={this.handleStart}
          onTouchMove={this.handleDrag}
          onTouchEnd={this.handleEnd}
          style={handleStyle}
        />
      </div>
    );
  }
}
