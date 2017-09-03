import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';



export default class DefaultDate extends React.Component {
  render = () => {
    const { date } = this.props;
    return (
      <div>
        <DatePicker defaultValue={moment(date)} />
      </div>
    )
  }
}
