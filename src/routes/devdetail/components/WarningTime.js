import React from 'react';
import { Card } from 'antd';
import AlarmList from 'components/Alarm/AlarmList';

export default class WarningTime extends React.Component {
  render = () => {
    return (
      <Card
        title={'实时告警'}
        style={{ height: '100%' }}
        bodyStyle={{ padding: 0, overflowY: 'scroll', height: '250px' }}
        noHovering
      >
        <AlarmList
          loading={this.props.loading}
          alarms={this.props.alarms}
        />
      </Card>
    );
  }
}
