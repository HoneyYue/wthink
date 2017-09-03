import React from 'react';
import { Icon, Popover } from 'antd';

export default class RTUPopover extends React.Component {
  renderContent = () => {
    const { master } = this.props;
    return <p>{master}</p>;
  }
  render = () => {
    const { master } = this.props;
    return (
      <Popover
        title="所属网关"
        content={this.renderContent()}
      >
        <span><Icon type="hdd" /><span style={{ marginLeft: 4 }}>采集器{master}</span></span>
      </Popover>);
  }

}
