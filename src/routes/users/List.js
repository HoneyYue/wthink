import React from 'react';
import { connect } from 'dva';

import Grid from 'components/Grid';
import OrgTreeSelect from 'components/Org/OrgTreeSelect';
import OrgColumn from '../dev/components/OrgColumn';

import styles from '../org/index.less';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '用户名',
      dataIndex: 'name',
    }, {
      title: '昵称',
      dataIndex: 'nickname',
    }, {
      title: '电话号码',
      dataIndex: 'phone',
    }, {
      title: 'Email',
      dataIndex: 'email',
    }, {
      title: '机构',
      dataIndex: 'orgs',
      render: this.renderOrgColumn,
    }];
    this.filterItems = [{
      text: '用户名',
      name: 'name',
      type: 'input',
    }, {
      text: '电话号码',
      name: 'phone',
      type: 'input',
    }];
  }
  getAddFields = () => {
    const { orgs } = this.props;
    return [{
      text: '用户名',
      name: 'name',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入用户名' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '昵称',
      name: 'nickname',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入昵称' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '电话号码',
      name: 'phone',
      type: 'input',
      validate: [{
        rules: [
          {
            required: true,
            message: '请输入电话号码',
            validator: (rule, value, callback) => {
              const tel = /^1(3|4|5|7|8)\d{9}$/;
              if (tel.test(value)) {
                callback();
              } else {
                callback('电话号码错误111');
              }
            },
          },
        ],
        trigger: ['onBlur'],
      }],
    }, {
      text: 'Email',
      name: 'email',
      type: 'input',
      validate: [{
        rules: [
          {
            message: '邮箱格式错误',
            validator: (rule, value, callback) => {
              const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
              if (re.test(value)) {
                callback();
              } else {
                callback('邮箱格式错误');
              }
            },
          },
        ],
        trigger: ['onBlur'],
      }],
    }, {
      text: '所属机构',
      name: 'orgs',
      component: <OrgTreeSelect orgs={orgs} multiple />,
      validate: [{
        rules: [
          { required: true, message: '请设置所属机构' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '设备位置',
      name: 'map',
      type: 'locselect',
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
      text: '昵称',
      name: 'nickname',
      type: 'input',
      validate: [{
        rules: [
          { required: true, message: '请输入昵称' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '电话号码',
      name: 'phone',
      type: 'input',
      validate: [{
        rules: [
          {
            required: true,
            message: '请输入正确的电话号码',
            validator: (rule, value, callback) => {
              const tel = /^1(3|4|5|7|8)\d{9}$/;
              if (tel.test(value)) {
                callback();
              } else {
                callback('电话号码不正确');
              }
            },
          },
        ],
        trigger: ['onBlur'],
      }],
    }, {
      text: 'Email',
      name: 'email',
      type: 'input',
      validate: [{
        rules: [
          {
            message: '邮箱格式错误',
            validator: (rule, value, callback) => {
              const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
              if (re.test(value)) {
                callback();
              } else {
                callback('邮箱格式错误');
              }
            },
          },
        ],
        trigger: ['onBlur'],
      }],
    }, {
      text: '所属机构',
      name: 'orgs',
      component: <OrgTreeSelect orgs={orgs} multiple />,
      validate: [{
        rules: [
          { required: true, message: '请设置所属机构' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '设备位置',
      name: 'map',
      type: 'locselect',
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
  add = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/add', payload: { values }, callback });
  };
  edit = (values, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/edit', payload: { values }, callback });
  };
  del = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/del', payload: { id: record.id, sn: record.sn, type: record.type } });
  };
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/fetch', payload: { filter, pageNo, pageSize } });
  };
  showConfig = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'users/reset', payload: { id: record.id } });
  };
  renderOrgColumn = (ids = []) => {
    const { orgs } = this.props;
    return ids.map((id) => {
      return <span className={styles.titmrg}><OrgColumn orgs={orgs} id={id} /></span>;
    });
  };

  render = () => {
    const { data, loading, addLoading, delLoading, editLoading } = this.props;
    return (
      <div>
        <Grid
          columns={this.columns}
          loading={loading}
          editModal
          insert={this.add}
          del={this.del}
          edit={this.edit}
          addLoading={addLoading}
          delLoading={delLoading}
          editLoading={editLoading}
          filterItems={this.filterItems}
          insertFields={this.getAddFields()}
          editFields={this.getEditFields()}
          data={data}
          refersh={this.refersh}
          actions={[{ icon: 'reload', handler: this.showConfig, name: '重置密码', confirm: '请确认重置密码吗?' }]}
        />
      </div>
    );
  }


}


function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.users,
    orgs: state.org.orgs,
    loading: loading.effects['users/fetch'],
    addLoading: loading.effects['users/add'],
    editLoading: loading.effects['users/edit'],
    delLoading: loading.effects['users/del'],
  };
}

export default connect(mapStateToProps)(UserList);
