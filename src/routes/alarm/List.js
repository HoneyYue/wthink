import React from 'react';
import { connect } from 'dva';
import { Badge } from 'antd';

import Grid from 'components/Grid';
import AlarmColumn from 'components/Alarm/AlarmColumn';

import { dateTimeFormat } from 'utils';

class AlarmList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '设备序号',
      dataIndex: 'sn',
    }, {
      title: '说明',
      dataIndex: 'type',
      render: (type, alarm) => {
        return <AlarmColumn alarm={alarm} />;
      },
    }, {
      title: '产生时间',
      dataIndex: 'alarmAt',
      render: (alarmAt) => {
        return dateTimeFormat(alarmAt);
      },
    }, {
      title: '已清除',
      dataIndex: 'clean',
      width: 60,
      render: (clean) => {
        const status = clean ? 'success' : 'error';
        return <Badge status={status} />;
      },
    }, {
      title: '处理用户',
      dataIndex: 'cleanBy',
    }, {
      title: '处理时间',
      dataIndex: 'cleanAt',
      render: (cleanAt) => {
        return dateTimeFormat(cleanAt);
      },
    }];
    this.filterItems = [{
      text: '设备序号',
      name: 'sn',
      type: 'input',
    }, {
      text: '类型',
      name: 'type',
      type: 'select',
      value: null,
      style: {
        width: '150',
      },
      options: [{
        value: null,
        text: '全部',
      }, {
        value: 'NET',
        text: '断网',
      }, {
        value: 'POWER',
        text: '断电',
      }, {
        value: 'LINK',
        text: '非法接入',
      }, {
        value: 'CAMERA',
        text: '摄像头异常',
      }],
    }, {
      text: '产生时间',
      name: 'alarmAt',
      type: 'daterange',
    }];
  }

  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'alarm/fetch', payload: { filter, pageNo, pageSize } });
  };
  render = () => {
    const { data, loading } = this.props;
    return (
      <Grid
        columns={this.columns}
        filterItems={this.filterItems}
        data={data}
        loading={loading}
        refersh={this.refersh}
      />
    );
  };
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.alarm,
    loading: loading.effects['alarm/fetch'],
  };
}

export default connect(mapStateToProps)(AlarmList);
