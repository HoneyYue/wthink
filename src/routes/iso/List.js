import React from 'react';
import { connect } from 'dva';
import { dateTimeFormat } from 'utils';

import { Badge, Card, Switch } from 'antd';
import Grid from 'components/Grid';
import UploadModal from './components/UploadModal';
import UpgradeModal from './components/UpgradeModal';
import PieCharts from './components/PieCharts';
import { ISO_TYPE, ISO_TYPE_NAME } from './constant';

class IsoList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '自动',
      dataIndex: 'autoUp',
      width: 60,
      render: (up) => {
        const status = up ? 'success' : 'default';
        return <Badge status={status} />;
      },
    }, {
      title: '版本',
      dataIndex: 'ver',
    }, {
      title: '类型',
      dataIndex: 'type',
      render: (type) => {
        return ISO_TYPE_NAME[type];
      },
    }, {
      title: '创建时间',
      dataIndex: 'createAt',
      render: (time) => {
        return dateTimeFormat(time);
      },
    }];
    this.filterItems = [{
      text: '版本',
      name: 'ver',
      type: 'input',
    }, {
      text: '类型',
      name: 'type',
      type: 'select',
      value: null,
      style: {
        width: 100,
      },
      options: [{
        value: null,
        text: '全部',
      }, {
        value: ISO_TYPE.RTU,
        text: '采集器',
      }, {
        value: ISO_TYPE.GTY,
        text: '网关',
      }],
    }];
    this.actions = [{
      icon: 'lock',
      handler: this.openUp,
      name: '开启',
      confirm: '请确认开启自动升级吗?',
      check: (record) => {
        return !record.autoUp;
      },
    }, {
      icon: 'unlock',
      handler: this.closeUp,
      name: '关闭',
      confirm: '请确认关闭自动升级吗?',
      check: (record) => {
        return record.autoUp;
      },
    }, {
      icon: 'cloud-upload-o',
      handler: this.showUpGradeModal,
      name: '升级',
    }];
    this.state = {
      uploadModalVisible: false,
      switchState: false,
      configModalVisible: false,
      upgradeModalVisible: false,
    };
  }
  onSwitchChange = () => {
    const { dispatch } = this.props;
    const onlineOnlie = this.state.switchState;
    dispatch({ type: 'iso/ver', payload: { onlineOnlie } });
    this.setState({
      switchState: !this.state.switchState,
    });
  };
  openUp = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'iso/open', payload: { id: record.id, type: record.type } });
  };
  closeUp = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'iso/close', payload: { id: record.id, type: record.type } });
  };
  showUploadModal = () => {
    this.setState({ uploadModalVisible: true });
  };
  hideUploadModal = () => {
    this.setState({ uploadModalVisible: false });
  };
  uploadSuccess = () => {
    this.hideUploadModal();
    const { dispatch } = this.props;
    dispatch({ type: 'iso/refersh' });
  };
  showUpGradeModal = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'grade/fetch' });
    this.setState({ upgradeModalVisible: true });
  };
  hideUpgradeModal = () => {
    this.setState({ upgradeModalVisible: false });
  };
  UpgradeSuccess = () => {
    this.hideUpgradeModal();
  };
  add = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'iso/add', payload: { values }, callback });
  };
  del = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'iso/del', payload: { id: record.id } });
  };
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'iso/fetch', payload: { filter, pageNo, pageSize } });
  };
  render = () => {
    const { data, loading, addLoading, delLoading } = this.props;
    const { uploadModalVisible, upgradeModalVisible } = this.state;
    return (
      <div>
        <div style={{ float: 'left', width: '60%' }}>
          <Grid
            toolBtns={[{ icon: 'upload', text: '添加', handler: this.showUploadModal }]}
            columns={this.columns}
            actions={this.actions}
            filterItems={this.filterItems}
            insertFields={this.addFields}
            del={this.del}
            delLoading={delLoading}
            data={data}
            loading={loading}
            refersh={this.refersh}
          />
        </div>
        <UploadModal
          visible={uploadModalVisible}
          onClose={this.hideUploadModal}
          loading={addLoading}
          onSuccess={this.uploadSuccess}
        />
        <UpgradeModal
          visible={upgradeModalVisible}
          onClose={this.hideUpgradeModal}
          onSuccess={this.UpgradeSuccess}
        />
        <Card
          style={{ float: 'left', width: 'calc(40% - 2px)', height: '100%', marginTop: 1, marginLeft: 2, backgroundColor: 'transparent' }}
          title={'各版本设备所占比例示意图'}
          extra={<Switch checkedChildren={'全部设备'} unCheckedChildren={'在线设备'} onChange={this.onSwitchChange} />}
          noHovering
        >
          <PieCharts data={data} switchState={this.state.switchState} />
        </Card>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.iso,
    loading: loading.effects['iso/fetch'],
    addLoading: loading.effects['iso/add'],
    delLoading: loading.effects['iso/del'],
  };
}

export default connect(mapStateToProps)(IsoList);
