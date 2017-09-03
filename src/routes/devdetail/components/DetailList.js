import React from 'react';
import Grid from 'components/Grid';
import { Icon, Card } from 'antd';
import { dateTimeFormat } from 'utils/index';

export default class DetailList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '状态',
        dataIndex: 'type',
        render: (type) => {
          if (type === 'UPCONFIG') {
            return (
              <span>
                <Icon type="setting" />
                <span style={{ marginLeft: '8px' }}>配置</span>
              </span>
            );
          }
          if (type === 'UPGRADE') {
            return (
              <span>
                <Icon type="to-top" />
                <span style={{ marginLeft: '8px' }}>升级</span>
              </span>
            );
          }
          if (type === 'GETPARAM') {
            return (
              <span>
                <Icon type="file" />
                <span style={{ marginLeft: '8px' }}>参数获取</span>
              </span>
            );
          }
          if (type === 'GETINFO') {
            return (
              <span>
                <Icon type="file-text" />
                <span style={{ marginLeft: '8px' }}>参数获取</span>
              </span>
            );
          }
        },
      },
      {
        title: '产生时间',
        dataIndex: 'createAt',
        render: (createAt) => {
          return dateTimeFormat(createAt);
        },
      },
      {
        title: '运维结果',
        dataIndex: 'progress',
        render: (value, row) => {
          const { completeAt, success, error } = row;
          if (completeAt) {
            if (success) {
              return (
                <span>
                  <Icon type="check-circle" />
                  <span style={{ marginLeft: '8px' }}>完成</span>
                </span>
              );
            }
            return (
              <span>
                <Icon type="close-square" />
                <span style={{ marginLeft: '8px' }}>{error}</span>
              </span>
            );
          }
          if (value === 'WAIT') {
            return (
              <span>
                <Icon type="loading" />
                <span style={{ marginLeft: '8px' }}>等待</span>
              </span>
            );
          }
          if (value === 'OVER') {
            return (
              <span>
                <Icon type="copy" />
                <span style={{ marginLeft: '8px' }}>覆盖</span>
              </span>
            );
          }
          if (value === 'CANCEL') {
            return (
              <span>
                <Icon type="close-circle-o" />
                <span style={{ marginLeft: '8px' }}>取消</span>
              </span>
            );
          }
          if (value === 'REQ') {
            return (
              <span>
                <Icon type="cloud-upload-o" />
                <span style={{ marginLeft: '8px' }}>发送请求</span>
              </span>
            );
          }
          if (value === 'ACK') {
            return (
              <span>
                <Icon type="clock-circle-o" />
                <span style={{ marginLeft: '8px' }}>等待响应</span>
              </span>
            );
          }
          if (value === 'COMPLETE') {
            return (
              <span>
                <Icon type="check-circle" />
                <span style={{ marginLeft: '8px' }}>完成</span>
              </span>
            );
          }
        },
      },
    ];
  }
  render = () => {
    return (
      <Card
        title={'运维记录'}
        style={{ height: '100%' }}
        bodyStyle={{ padding: 0, overflowY: 'scroll', height: '250px' }}
        noHovering
      >
        <Grid
          columns={this.columns}
          data={this.props.data}
          loading={false}
          page
          disableToolbar
          refersh={this.props.refersh}
        />
      </Card>
    );
  }
}
