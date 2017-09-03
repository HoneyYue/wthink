import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

export default class AlarmColumn extends React.Component {
  static propTypes = {
    alarm: PropTypes.object.isRequired,
  };
  textRender = () => {
    const { alarm } = this.props;
    if (alarm.type === 'CAMERA') {
      return (
        <span>
          <Icon type="video-camera" style={{ color: '#f04134', fontWeight: 900 }} />
          <span style={{ marginLeft: '8px' }}>摄像头异常</span>
        </span>
      );
    }
    if (alarm.type === 'LINK') {
      return (
        <span>
          <Icon type="close-square" style={{ color: '#f04134', fontWeight: 900 }} />
          <span style={{ marginLeft: '8px' }}>设备物理地址异常</span>
        </span>
      );
    }
    if (alarm.type === 'POWER') {
      return (
        <span>
          <Icon type="poweroff" style={{ color: '#f04134', fontWeight: 900 }} />
          <span style={{ marginLeft: '8px' }}>电源异常</span>
        </span>
      );
    }
    if (alarm.type === 'NET') {
      return (
        <span>
          <Icon type="wifi" style={{ color: '#f04134', fontWeight: 900 }} />
          <span style={{ marginLeft: '8px' }}>网络连接异常</span>
        </span>
      );
    }
  };
  render = () => {
    return <span>{this.textRender()}</span>;
  }
}
