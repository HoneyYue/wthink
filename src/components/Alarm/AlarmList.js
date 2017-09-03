import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'components/Grid';
import AlarmColumn from 'components/Alarm/AlarmColumn';
import { dateTimeFormat } from 'utils/index';

export default class Alarm extends React.Component {
  static propTypes = {
    alarms: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.columns = [{
      title: '说明',
      dataIndex: 'type',
      render: (type, alarm) => {
        return <AlarmColumn alarm={alarm} />;
      },
    }, {
      title: '产生时间',
      dataIndex: 'alarmAt',
      render: (cleanAt) => {
        return dateTimeFormat(cleanAt);
      },
    }];
  }

  render = () => {
    const { alarms, loading, ...other } = this.props;
    return (
      <Grid
        disableToolbar
        page={false}
        columns={this.columns}
        data={{ list: alarms }}
        loading={loading}
        refersh={() => {}}
        {...other}
      />
    );
  };
}
