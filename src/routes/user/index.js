import React from 'react';
import { connect } from 'dva';

import Grid from '../../components/Grid/index';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '时间',
      dataIndex: 'createAt',
    }];
    this.formFields = [{
      text: '名称',
      name: 'name',
      type: 'input',
    }, {
      text: '时间',
      name: 'createAt',
      type: 'date',
    }];
    this.filterItems = [{
      text: '名称',
      name: 'name',
      type: 'input',
    }, {
      text: '时间',
      name: 'createAt',
      type: 'daterange',
    }];
  }
  add = (values) => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/add', payload: { values } });
  };
  edit = (values) => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/edit', payload: { values } });
  };
  del = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/del', payload: { id: record.id } });
  };
  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/fetch', payload: { filter, pageNo, pageSize } });
  };
  render = () => {
    const { data, addLoading, editLoading, delLoading } = this.props;
    return (
      <Grid
        columns={this.columns}
        filterItems={this.filterItems}
        fields={this.formFields}
        insertModal
        editModal
        del={this.del}
        edit={this.edit}
        insert={this.add}
        delLoading={delLoading}
        editLoading={editLoading}
        addLoading={addLoading}
        data={data}
        refersh={this.refersh}
      />
    );
  };
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.user,
    addLoading: loading.effects['user/add'],
    editLoading: loading.effects['user/edit'],
    delLoading: loading.effects['user/del'],
  };
}

export default connect(mapStateToProps)(User);
