import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import WarningTime from './WarningTime';
import DetailList from './DetailList';

class DevdetailGrid extends React.Component {
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devdetail/fetch', payload: { filter, pageNo, pageSize } });
  };
  whoBeRender = () => {
    const { title, devdetailData, alarmloading, alarm } = this.props;
    if (title === '实时告警') {
      return (
        <WarningTime
          loading={alarmloading}
          alarms={alarm.current}
        />
      );
    }
    return (
      <DetailList
        data={devdetailData}
        refersh={this.refersh}
      />
    );
  };
  render = () => {
    const { title } = this.props;
    return (
      <Card
        title={title}
        style={{ height: '100%' }}
        bodyStyle={{ padding: 0, overflowY: 'scroll', height: '200px' }}
        noHovering
      >
        {this.whoBeRender()}
      </Card>
    );
  }
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    alarm: state.devalarm,
    devdetailData: state.devdetail.data,
    alarmloading: loading.effects['devalarm/fetch'],
    historyloading: loading.effects['devalarm/fetchHistory'],
  };
}

export default connect(mapStateToProps)(DevdetailGrid);
