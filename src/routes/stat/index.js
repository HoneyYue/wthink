import React from 'react';
import { connect } from 'dva';
import { Badge, Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import Grid from 'components/Grid';
import AlarmColumn from 'components/Alarm/AlarmColumn';
import { dateTimeFormat } from 'utils';
import SelectForm from './components/SelectForm';

class Stat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
    };
    this.columns = [{
      title: '已清除',
      dataIndex: 'clean',
      width: 60,
      render: (clean) => {
        const status = clean ? 'success' : 'error';
        return <Badge status={status} />;
      },
    }, {
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
      title: '处理用户',
      dataIndex: 'cleanBy',
    }, {
      title: '处理时间',
      dataIndex: 'cleanAt',
      render: (cleanAt) => {
        return dateTimeFormat(cleanAt);
      },
    }];
  }
  onSubmit = (values) => {
    const { dispatch } = this.props;
    dispatch({ type: 'stat/fetch', payload: { values } });
  };
  onCondition =(val) => {
    this.setState({
      title: val.activeLabel,
    });
    const id = val.activeLabel;
    const { dispatch } = this.props;
    let type;
    switch (id) {
      case '总设备数':
        type = null;
        break;
      case '断网告警':
        type = 'NET';
        break;
      case '断电告警':
        type = 'POWER';
        break;
      case '非法接入告警':
        type = 'LINK';
        break;
      case '摄像头告警':
        type = 'CAMERA';
        break;
      default:
        break;
    }
    dispatch({ type: 'stat/fetchAlarm', payload: { filter: { type } } });
  };
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'stat/fetchAlarm', payload: { filter, pageNo, pageSize } });
  };
  render = () => {
    const { orgs, loading, data } = this.props;
    const title = data.filter.type;
    let cardTit;
    switch (title) {
      case null:
        cardTit = '全部告警';
        break;
      case undefined:
        cardTit = '全部告警';
        break;
      case 'NET':
        cardTit = '断网告警';
        break;
      case 'POWER':
        cardTit = '断电告警';
        break;
      case 'LINK':
        cardTit = '非法接入告警';
        break;
      case 'CAMERA':
        cardTit = '摄像头告警';
        break;
      default:
        break;
    }
    const BarData = {
      data: [
        { name: '设备总数', 统计: data.chart.total },
        { name: '断网告警', 统计: data.chart.net },
        { name: '断电告警', 统计: data.chart.power },
        { name: '非法接入告警', 统计: data.chart.links },
        { name: '摄像头告警', 统计: data.chart.camera },
      ],
    };
    return (
      <div>
        <SelectForm orgs={orgs} time={data.filter.time} onSubmit={this.onSubmit} />
        <BarChart
          width={1000}
          height={300}
          margin={{ top: 40, left: 20, bottom: 40 }}
          barSize={50}
          data={BarData.data}
          onClick={this.onCondition}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="统计" fill="#82ca9d" label />
        </BarChart>
        <Card
          title={cardTit}
          bodyStyle={{ padding: 0 }}
          noHovering
        >
          <Grid
            disableToolbar
            columns={this.columns}
            data={data.alarm}
            loading={loading}
            refersh={this.refersh}
          />
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.stat,
    orgs: state.org.orgs,
    loading: loading.effects['stat/fetch'],
  };
}

export default connect(mapStateToProps)(Stat);
