import React from 'react';
import { connect } from 'dva';
import { dateTimeFormat } from 'utils';
import { Badge, Icon, DatePicker, Select } from 'antd';

import Grid from 'components/Grid';
// import AlarmColumn from './components/AlarmColumn';
// import AlarmModal from './components/AlarmModal';
import ContentSelect from './components/contentSelect';


class cameraList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmModalVisible: false ,
    };
    this.columns = [{
      title: '监控设备',
      dataIndex: 'dev',
    }, {
      title: '端口',
      dataIndex: 'slot',
    }, {
      title: '摄像头id',
      dataIndex: 'sn',
    }, {
      title: '摄像头型号',
      dataIndex: 'model',
    }, {
      title: '生产厂家',
      dataIndex: 'productBy',
    }, {
      title: '摄像头ip',
      dataIndex: 'ip',
    }, {
      title: 'mac地址',
      dataIndex: 'mac',
    }, {
      title: '地址',
      dataIndex: 'loc',
      render: (data) => {
        if (data.address) {
          return <span>{data.address}</span>;
        }
        if (data.lat) {
          return <span>{`${data.lat},${data.lng}`}</span>;
        }
      },
    }, {
      title: '建设阶段',
      dataIndex: 'stage',
    }, {
      title: '建设人',
      dataIndex: 'buildBy',
    }, {
      title: '维保人',
      dataIndex: 'maintainBy',
    }, {
      title: '维保到期时间',
      dataIndex: 'maintainEndAt',
      render: (time) => {
        return dateTimeFormat(time);
      },
    }, {
      title: '告警',
      dataIndex: 'alarms',
      render: this.renderAlarmColumn,
    }, {
      title: '安装时间',
      dataIndex: 'createAt',
      render: (time) => {
        return dateTimeFormat(time);
      },
    }]
    this.filterItems = [{
      text: '摄像头mac地址',
      name: 'mac',
      type: 'input',
    },]
  }
  getAddFields = () => {
    const list = [{
      name:'AOC',
      models: ['一代', '二代', '三代', '四代', 'N代']
    }, {
      name:'DELL',
      models: ['Miss', 'Moss', 'Mass', 'Mess', 'Mcss']
    }]
    return [{
      text: '摄像头id',
      name: 'sn',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入摄像头id' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '摄像头ip',
      name: 'ip',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入摄像头ip' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
        text: '厂家--型号',
        name: 'productBy',
        //type: 'input',
        component: <ContentSelect Selected={{ productBy: '', model:'', }} data={list}/>,
        // validate: [{
        //   rules: [
        //     { required: true, message: '请输入摄像头ip' },
        //   ],
        //   trigger: ['onBlur', 'onChange'],
        // }],
      },
    //   {
    //   text: '摄像头型号',
    //   name: 'model',
    //   type: 'input',
    //   validate: [{
    //     rules: [
    //       { required: true, message: '请输入摄像头ip' },
    //     ],
    //     trigger: ['onBlur', 'onChange'],
    //   }],
    // }, {
    //   text: '厂家',
    //   name: 'productBy',
    //   type: 'input',
    //   validate: [{
    //     rules: [
    //       { required: true, message: '请输入摄像头ip' },
    //     ],
    //     trigger: ['onBlur', 'onChange'],
    //   }],
    // },
      {
      text: 'mac地址',
      name: 'mac',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入mac地址' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '安装时间',
      name: 'createAt',
      type: 'date',
      validate: [{
        rules: [
          { required: true, message: '请选择安装时间' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '监控设备',
      name: 'dev',
      type: 'input',
    }, {
      text: '设备端口',
      name: 'slot',
      type: 'select',
      options: [{
        value: 1,
        text: 1,
      }, {
        value: 2,
        text: 2,
      }, {
        value: 3,
        text: 3,
      }, {
        value: 4,
        text: 4,
      }]
    }, {
      text: '建设阶段',
      name: 'stage',
      type: 'select',
      options: [{
        value: 1,
        text: '第一阶段',
      }, {
        value: 2,
        text: '第二阶段',
      }],
    }, {
      text: '建设人',
      name: 'buildBy',
      type: 'input',
    }, {
      text: '维保人',
      name: 'maintainBy',
      type: 'input',
    }, {
      text: '维保到期时间',
      name: 'maintainEndAt',
      type: 'date',
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
    }]
  };
  getEditFields = () => {
    return [{
      text: '摄像头ip',
      name: 'ip',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入摄像头ip' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '摄像头型号',
      name: 'model',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入摄像头ip' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '厂家',
      name: 'productBy',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入摄像头ip' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '安装时间',
      name: 'createAt',
      type: 'date',
      validate: [{
        rules: [
          { required: true, message: '请输入安装时间' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '监控设备',
      name: 'dev',
      type: 'input',
    }, {
      text: '设备端口',
      name: 'slot',
      type: 'select',
      options: [{
        value: 1,
        text: 1,
      }, {
        value: 2,
        text: 2,
      }, {
        value: 3,
        text: 3,
      }, {
        value: 4,
        text: 4,
      }]
    }, {
      text: '建设阶段',
      name: 'stage',
      type: 'select',
      options: [{
        value: 1,
        text: '第一阶段',
      }, {
        value: 2,
        text: '第二阶段',
      }],
    }, {
      text: '建设人',
      name: 'buildBy',
      type: 'input',
    }, {
      text: '维保人',
      name: 'maintainBy',
      type: 'input',
    }, {
      text: '维保到期时间',
      name: 'maintainEndAt',
      type: 'date',
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
    }]
  };
  add = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'camera/add', payload: { values }, callback });
  };
  edit = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'camera/edit', payload: { values }, callback });
  };
  del = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'camera/del', payload: { id: record.id, sn: record.sn, type: record.type } });
  };
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'camera/fetch', payload: { filter, pageNo, pageSize } });
  };
  renderAlarmColumn = (alarms, { firstAlarm, sn }) => {
    //return <AlarmColumn ids={alarms} alarm={firstAlarm} sn={sn} showMore={this.showAlarms} />;
  };
  hideAlarm = () => {
    this.setState({ alarmModalVisible: false });
  };
  showAlarms = (sn) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devalarm/fetch', payload: { sn } });
    this.setState({ alarmModalVisible: true });
  };

  render = () => {
    const { data, loading, addLoading, editLoading, delLoading } = this.props;
    const { alarmModalVisible } = this.state;
    return (
      <div>
        <Grid
          columns={this.columns}
          insert={this.add}
          del={this.del}
          edit={this.edit}
          filterItems={this.filterItems}
          editFields={this.getEditFields()}
          insertFields={this.getAddFields()}
          delLoading={delLoading}
          editLoading={editLoading}
          addLoading={addLoading}
          data={data}
          loading={loading}
          refersh={this.refersh}
        />
      </div>
    );
  };
}


function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.camera,
    loading: loading.effects['camera/fetch'],
    addLoading: loading.effects['camera/add'],
    editLoading: loading.effects['camera/edit'],
    delLoading: loading.effects['camera/del'],
  };
}

export default connect(mapStateToProps)(cameraList);
