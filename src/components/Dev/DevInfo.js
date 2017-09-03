import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { Card, Icon, Badge, Button, message, Spin } from 'antd';
import { DEV_TYPE, OFF } from './constant';

import LocModal from './LocModal';
import SlotConfigModal from './SlotConfigModal';

class DevInfo extends React.Component {
  static propTypes = {
    loc: PropTypes.bool.isRequired,
    nocard: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = { locModalVisible: false, settingModalVisible: false };
  }
  refresh = () => {
    const { loading, detail } = this.props;
    if (loading || !detail.sn) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({ type: 'devdetail/fetch', payload: { sn: detail.sn } });
  };
  showSetting = () => {
    const { dispatch, detail } = this.props;
    dispatch({ type: 'devslot/fetch', payload: { sn: detail.sn } });
    this.setState({ settingModalVisible: true });
  };
  hideSetting = () => {
    this.setState({ settingModalVisible: false });
  };
  showLocModal = () => {
    const { loc: { lat, lng } } = this.props.detail;
    if (!lat || !lng) {
      message.error('未设置经纬度位置');
      return null;
    }
    this.setState({ locModalVisible: true });
  };
  hideLocModal = () => {
    this.setState({ locModalVisible: false });
  };
  renderItem = (name, value) => {
    return (
      <p style={{ height: 26 }}>
        <span style={{ marginRight: 5 }}>{name}:</span>{value}
      </p>
    );
  };
  renderMaster = (master) => {
    if (!master) {
      return;
    }
    return <a href={`/detail/${master}`}>{master}</a>;
  };
  renderLocItem = ({ lat, lng, address }) => {
    const { loc } = this.props;
    let desc;
    if (address) {
      desc = address;
    } else if (lat && lng) {
      desc = `${lng},${lat}`;
    }
    if (!loc) {
      return desc;
    }
    return (
      <a onClick={this.showLocModal}>
        <span style={{ marginRight: 5 }}>{desc}</span>
        <Icon style={{ fontSize: 18, color: 'red' }} type="environment" />
      </a>);
  };
  renderSlots = (slots) => {
    return (
      <Button.Group>
        {
          slots.map((slot) => {
            return <Button size="small"><Badge status={slot.link ? 'success' : 'warning'} text={slot.num} /></Button>;
          })
        }
      </Button.Group>
    );
  };
  renderSetting = () => {
    return <a><Icon style={{ fontSize: 18 }} type="setting" onClick={this.showSetting} /></a>;
  };
  renderInfo = () => {
    const { detail } = this.props;
    const { lat, lng } = detail.loc || {};
    const { locModalVisible, settingModalVisible } = this.state;
    return (
      <div>
        {this.renderItem('序号', detail.online ? <Badge status="success" test={detail.sn} /> : detail.sn)}
        { detail.online ? this.renderItem('信号', detail.type === DEV_TYPE.GTY ? detail.nbssi : detail.lrssi) : null }
        { !detail.online ? this.renderItem('离线', <Badge status="warning" text={OFF[detail.off] || '未部署'} />) : null }
        { !detail.online ? this.renderItem('离线时间', detail.offAt) : this.renderItem('上线时间', detail.onlineAt) }
        { detail.type === DEV_TYPE.GTY ? null : this.renderItem('网关', this.renderMaster(detail.master)) }
        {this.renderItem('版本', `${detail.sver || '未知'}/${detail.hver || '未知'}`)}
        {this.renderItem('位置', this.renderLocItem(detail.loc || {}))}
        {this.renderItem('机构', detail.org)}
        {this.renderItem('端口', this.renderSlots(detail.slots))}
        {this.renderOperation()}

        <LocModal visible={locModalVisible} lat={lat} lng={lng} onClose={this.hideLocModal} />
        <SlotConfigModal visible={settingModalVisible} onClose={this.hideSetting} />
      </div>
    );
  };
  renderOperation = () => {
    const { setting } = this.props;
    if (!setting) {
      return null;
    }
    return (
      <div style={{ bottom: 6, position: 'absolute', right: 24 }}>
        {this.renderSetting()}
      </div>
    );
  };
  render = () => {
    const { nocard, detailLoading } = this.props;
    if (nocard) {
      return (
        <Spin spinning={detailLoading} >
          {this.renderInfo()}
        </Spin>
      );
    }

    return (
      <Card
        noHovering
        loading={detailLoading}
        title="基本信息"
        extra={<a style={{ fontSize: 18 }}><Icon style={{ marginLeft: 8 }} type="retweet" onClick={this.refresh} /></a>}
      >
        {this.renderInfo()}
      </Card>
    );
  };
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    detail: state.devdetail,
    detailLoading: loading.effects['devdetail/fetch'],
  };
}

export default connect(mapStateToProps)(DevInfo);
