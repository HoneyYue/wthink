import React from 'react';
import { DatePicker } from 'antd';

export default class DateRange extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      start: value.start,
      end: value.end,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState(nextProps.value || { start: null, end: null });
    }
  }

  handleStartChange= (date) => {
    this.triggerChange({ start: date });
  };

  handleEndChange= (date) => {
    this.triggerChange({ end: date });
  };

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange({ ...this.state, ...changedValue });
    }
  };

  render() {
    const { start, end } = this.state;
    return (
      <span>
        <DatePicker style={{ width: 100 }} defaultValue={start} onChange={this.handleStartChange} />
        -
        <DatePicker style={{ width: 100 }} defaultValue={end} onChange={this.handleEndChange} />
      </span>
    );
  }
}
