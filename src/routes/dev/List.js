import React from 'react';
import { connect } from 'dva';
import { Badge, Icon } from 'antd';

import Grid from 'components/Grid';
import OrgTreeSelect from 'components/Org/OrgTreeSelect';

import { DEV_TYPE, OFF } from 'components/Dev/constant';
import SlotConfigModal from 'components/Dev/SlotConfigModal';
import OrgColumn from './components/OrgColumn';
import AlarmColumn from './components/AlarmColumn';
import AlarmModal from './components/AlarmModal';
import ImportModal from './components/ImportModal';
import RTUPopover from './components/RTUPopover';

class DevList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { alarmModalVisible: false, importModalVisible: false, configModalVisible: false };
    this.columns = [{
      title: '在线',
      dataIndex: 'online',
      width: 100,
      render: (online, { off }) => {
        if (online) {
          return <Badge type="success" text="在线" />;
        }

        return <Badge status="error" text={off ? OFF[off] : '未部署'} />;
      },
    }, {
      title: '设备序号',
      dataIndex: 'sn',
    }, {
      title: '类型',
      dataIndex: 'type',
      render: (type, { master }) => {
        if (type === DEV_TYPE.GTY) {
          return <span><Icon type="fork" /><span style={{ marginLeft: 4 }}>网关{master}</span></span>;
        }
        return <RTUPopover master={master} />;
      },
    }, {
      title: '机构',
      dataIndex: 'org',
      render: this.renderOrgColumn,
    }, {
      title: '地址',
      dataIndex: 'address',
      render: (address, record) => {
        if (address) {
          return <span>{address}</span>;
        }
        if (record.lat) {
          return <span>{`${record.lat},${record.lng}`}</span>;
        }
      },
    }, {
      title: '告警',
      dataIndex: 'alarms',
      render: this.renderAlarmColumn,
    }];
    this.filterItems = [{
      text: '网关',
      name: 'master',
      type: 'input',
      validate: [{
        rules: [
          { max: 32, message: '最大长度不能超过32位' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '设备序号',
      name: 'sn',
      type: 'input',
      validate: [{
        rules: [
          { max: 32, message: '最大长度不能超过32位' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '地址',
      name: 'address',
      type: 'input',
      validate: [{
        message: '最大长度不能超过50位',
        rules: [
          { max: 50, message: '最大长度不能超过50位' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }];
  }
  onEditStart = (record) => {
    this.editRecord = record;
  };
  getAddFields = () => {
    const { orgs } = this.props;
    return [{
      text: '设备类型',
      name: 'type',
      type: 'select',
      value: DEV_TYPE.RTU,
      options: [{
        value: DEV_TYPE.RTU,
        text: '采集器',
      }, {
        value: DEV_TYPE.GTY,
        text: '网关',
      }],
      validate: [{
        rules: [
          { required: true, message: '请选择设备类型' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '上级网关',
      name: 'master',
      exclusive: true,
      type: 'input',
      check: ({ type } = {}) => {
        return type === DEV_TYPE.RTU;
      },
      validate: [{
        rules: [
          { max: 32, message: '最大长度不能超过32位' },
          { required: true, message: '请输入网关编号' },
        ],
        trigger: false,
      }],
    }, {
      text: '设备序号',
      name: 'sn',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入设备序号' },
          { max: 32, message: '最大长度不能超过32位' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '所属机构',
      name: 'org',
      component: <OrgTreeSelect orgs={orgs} />,
      validate: [{
        rules: [
          { required: true, message: '请设置所属机构' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '设备位置',
      name: 'loc',
      type: 'locselect',
      setAddress: true,
      validate: [{
        rules: [
          {
            message: '最大长度不能超过50位',
            validator: (rule, value, callback) => {
              if (value && value.address && value.address.length > 50) {
                callback('最大长度不能超过50位');
              } else {
                callback();
              }
            },
          },
        ],
        trigger: ['onChange'],
      }],
    }];
  };
  getEditFields = () => {
    const { orgs } = this.props;
    return [{
      text: '上级网关',
      name: 'master',
      type: 'input',
      validate: [{
        rules: [
          { max: 32, message: '最大长度不能超过32位' },
          { required: true, message: '请输入网关编号' },
        ],
      }],
      check: ({ type } = {}) => {
        return type === DEV_TYPE.RTU || (this.editRecord && this.editRecord.type === DEV_TYPE.RTU);
      },
    }, {
      text: '所属机构',
      name: 'org',
      component: <OrgTreeSelect orgs={orgs} />,
      validate: [{
        rules: [
          { required: true, message: '请设置所属机构' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '设备位置',
      name: 'loc',
      type: 'locselect',
      setAddress: true,
      validate: [{
        rules: [
          {
            validator: (rule, value, callback) => {
              if (value && value.address && value.address.length > 50) {
                callback('最大长度不能超过50位');
              } else {
                callback();
              }
            },
          },
        ],
        trigger: ['onChange'],
      }],
    }];
  };
  showImport = () => {
    this.setState({ importModalVisible: true });
  };
  importSuccess = () => {
    this.hideImport();
    const { dispatch } = this.props;
    dispatch({ type: 'dev/refersh' });
  };
  hideImport = () => {
    this.setState({ importModalVisible: false });
  };
  showConfig = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devslot/fetch', payload: { sn: record.sn } });
    this.setState({ configModalVisible: true });
  };
  hideConfig = () => {
    this.setState({ configModalVisible: false });
  };
  hideAlarm = () => {
    this.setState({ alarmModalVisible: false });
  };
  showAlarms = (sn) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devalarm/fetch', payload: { sn } });
    this.setState({ alarmModalVisible: true });
  };
  add = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'dev/add', payload: { values }, callback });
  };
  edit = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'dev/edit', payload: { values }, callback });
  };
  del = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'dev/del', payload: { id: record.id, sn: record.sn, type: record.type } });
  };
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'dev/fetch', payload: { filter, pageNo, pageSize } });
  };
  renderOrgColumn = (orgid) => {
    const { orgs } = this.props;
    return <OrgColumn orgs={orgs} id={orgid} />;
  };
  renderAlarmColumn = (alarms, { firstAlarm, sn }) => {
    return <AlarmColumn ids={alarms} alarm={firstAlarm} sn={sn} showMore={this.showAlarms} />;
  };
  render = () => {
    const { data, loading, addLoading, editLoading, delLoading } = this.props;
    const { alarmModalVisible, importModalVisible, configModalVisible } = this.state;
    return (
      <div>
        <Grid
          toolBtns={[{ icon: 'upload', text: '导入', handler: this.showImport }]}
          columns={this.columns}
          filterItems={this.filterItems}
          editFields={this.getEditFields()}
          insertFields={this.getAddFields()}
          onEditStart={this.onEditStart}
          insertModal
          editModal
          del={this.del}
          edit={this.edit}
          insert={this.add}
          delLoading={delLoading}
          editLoading={editLoading}
          addLoading={addLoading}
          data={data}
          loading={loading}
          refersh={this.refersh}
          actions={[{ icon: 'setting', handler: this.showConfig, name: '设置' }]}
        />
        <AlarmModal visible={alarmModalVisible} onClose={this.hideAlarm} />
        <ImportModal
          visible={importModalVisible}
          onClose={this.hideImport}
          onSuccess={this.importSuccess}
        />
        <SlotConfigModal visible={configModalVisible} onClose={this.hideConfig} />
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.dev,
    orgs: state.org.orgs,
    loading: loading.effects['dev/fetch'],
    addLoading: loading.effects['dev/add'],
    editLoading: loading.effects['dev/edit'],
    delLoading: loading.effects['dev/del'],
  };
}

export default connect(mapStateToProps)(DevList);
