import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

import DevInfo from 'components/Dev/DevInfo';
import LocView from 'components/Map/LocView';
import ScatterCharts from './components/ScatterCharts';
import PieCharts from './components/PieCharts';
import WarningTime from './components/WarningTime';
import DetailList from './components/DetailList';


class DevDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowInnerWidth: window.innerWidth,
      dateNum: 30,
    };
    this.actions = [];
  }
  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }
  onWindowResize = () => {
    this.setState({
      windowInnerWidth: window.innerWidth,
    });
  };
  fetchDetail = (sn) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devdetail/fetch', payload: { sn } });
  };
  dateChange = (value) => {
    this.setState({
      dateNum: value,
    });
  };
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devdetail/fetch', payload: { filter, pageNo, pageSize } });
  };
  renderWithWindowResize = () => {
    const topScatter = this.state.windowInnerWidth <= 1366 ? '150px' : '260px';
    const leftScatter = this.state.windowInnerWidth <= 1366 ? '0' : '75px';
    const topPie = this.state.windowInnerWidth <= 1366 ? '50px' : '120px';
    const leftPie = this.state.windowInnerWidth <= 1366 ? '500px' : '870px';
    const styleRadio = this.state.windowInnerWidth <= 1366 ? { top: '-118px' } : { top: '-228px', left: '-76px' };
    const stylePieCharts = this.state.windowInnerWidth <= 1366 ?
    {
      width: 450,
      height: 150,
      cx: '40%',
      cy: '50%',
      x: 0,
      y: 30,
    } : {
      width: 500,
      height: 250,
      cx: '45%',
      cy: '50%',
      x: 0,
      y: 30,
    };
    return (
      <Card
        title={'告警统计'}
        style={{ height: '100%', position: 'relative' }}
        bodyStyle={{ padding: 0 }}
        noHovering
      >
        <div style={{ width: '67%', position: 'absolute', top: topScatter, left: leftScatter }}>
          <ScatterCharts
            styleRadio={styleRadio}
            alarmData={this.props.alarm.list}
            dateChange={this.dateChange}
          />
        </div>
        <div style={{ position: 'absolute', top: topPie, left: leftPie }}>
          <PieCharts
            switchState
            stylePieCharts={stylePieCharts}
            alarmData={this.props.alarm.list}
            dateNum={this.state.dateNum}
          />
        </div>
      </Card>
    );
  };
  render = () => {
    const { detail, detailLoading, dispatch, alarmloading, devalarm, devdetailData } = this.props;
    const { lat, lng } = detail.loc || {};
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        <Row style={{ height: '300px', width: 'calc(100% - 8px)' }} gutter={8}>
          <Col span={6} style={{ height: '100%' }} >
            <DevInfo
              loc
              loading={detailLoading}
              detail={detail}
              refresh={this.fetchDetail}
              dispatch={dispatch}
            />
          </Col>
          <Col span={9} style={{ height: '100%' }} >
            <WarningTime
              loading={alarmloading}
              alarms={devalarm.current}
            />
          </Col>
          <Col span={9} style={{ height: '100%' }} >
            <DetailList
              data={devdetailData}
              refersh={this.refersh}
            />
          </Col>
        </Row>
        <Row style={{ height: 'calc(100% - 300px)', width: 'calc(100% - 8px)' }} gutter={8}>
          <Col span={6} style={{ height: '100%' }}>
            <Card
              title={'设备位置'}
              bodyStyle={{ padding: 0 }}
              style={{ height: '100%', width: '100%', overflow: 'hidden' }}
            >
              <LocView lat={lat} lng={lng} style={{ width: '100%', height: '100%' }} />
            </Card>
          </Col>
          <Col span={18} style={{ height: '100%' }}>
            {this.renderWithWindowResize()}
          </Col>
        </Row>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { filter, loading } = state;
  return {
    detail: state.devdetail,
    alarm: state.alarm,
    data: { ...state.devdetail, filter },
    devalarm: state.devalarm,
    devdetailData: state.devdetail.data,
    alarmloading: loading.effects['devalarm/fetch'],
    historyloading: loading.effects['devalarm/fetchHistory'],
  };
}

export default connect(mapStateToProps)(DevDetail);
