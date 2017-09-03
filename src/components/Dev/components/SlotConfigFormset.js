import React from 'react';
import { Card, Badge, Input } from 'antd';

export default class SlotConfigFormset extends React.Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      ip: value.ip,
      mac: value.mac,
      link: value.link,
      realIp: value.realIp,
      realMac: value.realMac,
      num: value.num || 0,
    };
  }
  componentWillReceiveProps(props) {
    if ('value' in props) {
      let value = props.value;
      if (!value) {
        value = { ip: null, mac: null, link: false, realIp: null, realMac: null, num: 0 };
      }
      this.setState(value);
    }
  }
  triggerChange = (values) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...this.state, ...values });
    }
  };
  renderTitle = () => {
    const { num, link } = this.state;
    return <Badge status={link ? 'success' : 'default'} text={`${num}端口`} />;
  };
  renderIp = () => {
    const { ip } = this.state;
    return (
      <div>
        <span style={{ marginRight: 15 }}>IP地址:</span>
        <Input
          defaultValue={ip}
          style={{ width: 140 }}
          onChange={(event) => {
            this.triggerChange({ ip: event.target.value });
          }}
        />
      </div>
    );
  };
  renderMac = () => {
    const { mac } = this.state;
    return (
      <div>
        <span>网卡地址:</span>
        <Input
          defaultValue={mac}
          style={{ width: 140 }}
          onChange={(event) => {
            this.triggerChange({ mac: event.target.value });
          }}
        />
      </div>
    );
  };
  renderReal = () => {
    const { link, realIp, realMac } = this.state;
    if (!link) {
      return <div>端口未连接</div>;
    }
    return (
      <div>
        <span>当前连接:</span>{realIp}/{realMac}
      </div>
    );
  };
  renderSlot = () => {
    return (
      <div>
        {this.renderIp()}
        {this.renderMac()}
        {this.renderReal()}
      </div>
    );
  };
  render = () => {
    return (
      <Card
        noHovering
        title={this.renderTitle()}
        style={{ width: 250 }}
        bodyStyle={{ padding: 12 }}
      >
        {this.renderSlot()}
      </Card>
    );
  };
}
