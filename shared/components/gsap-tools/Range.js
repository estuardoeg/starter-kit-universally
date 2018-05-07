import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import clamp from 'lodash/clamp';

import s from './Range.scss';

export default class Range extends PureComponent {

  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragComplete: PropTypes.func,
  }

  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
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

  // Update slider state on change
  handleUpdate = () => {
    if (!this.range) {
      // for shallow rendering
      return;
    }

    const sliderPos = this.range.offsetWidth;
    const handlePos = this.handle.offsetWidth;

    this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2,
    });
  }

  // Attach event listeners to mousemove/mouseup events
  handleStart = (e) => {
    const { onDragStart } = this.props

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);

    if (onDragStart) {
      onDragStart(e);
    }
  }

  // Handle drag/mousemove event
  handleDrag = (e) => {
    e.stopPropagation();

    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const value = this.position(e);

    if (onChange) {
      onChange(value, e);
    }
  }

  // Detach event listeners to mousemove/mouseup events
  handleEnd = (e) => {
    const { onDragComplete } = this.props;

    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleEnd);

    if (onDragComplete) {
      onDragComplete(e);
    }
  }

  // Calculate position of slider based on its value
  getPositionFromValue = (value) => {
    const { min, max } = this.props;
    const { limit } = this.state;

    const diffMaxMin = max - min;
    const diffValMin = value - min;
    const percentage = diffValMin / diffMaxMin;
    const pos = Math.round(percentage * limit);

    return pos;
  }

  // Translate position of slider to slider value
  getValueFromPosition = (pos) => {
    const { min, max, step } = this.props;
    const { limit } = this.state;

    const percentage = clamp(pos, 0, limit) / (limit || 1);
    const baseVal = step * Math.round((percentage * (max - min)) / step);
    const value = baseVal + min;

    return clamp(value, min, max);
  }

  // Calculate position of slider based on value
  position = (e) => {
    const { grab } = this.state;
    const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
    const { left } = this.range.getBoundingClientRect();
    const pos = coordinate - left - grab;

    return this.getValueFromPosition(pos);
  }

  // Grab coordinates of slider
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

        <div // eslint-disable-line
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
