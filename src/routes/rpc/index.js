import React from 'react';
import { connect } from 'dva';

import Grid from 'components/Grid';
import { dateTimeFormat } from 'utils';
import { RPC_TYPE, RPC_TYPE_NAME, RPC_PROGRESS_NAME } from './constant';


class RpcList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '设备序号',
      dataIndex: 'sn',
    }, {
      title: '类型',
      dataIndex: 'type',
      render: (type) => {
        return RPC_TYPE_NAME[type];
      },
    }, {
      title: '状态',
      dataIndex: 'progress',
      render: (index, data) => {
        if (data.completeAt) {
          if (data.success) {
            return <span>成功</span>;
          }
          return <span>{data.error}</span>;
        }
        return RPC_PROGRESS_NAME[data.progress];
      },
    }, {
      title: '创建时间',
      dataIndex: 'createAt',
      render: (createAt) => {
        return dateTimeFormat(createAt);
      },
    }, {
      title: '完成时间',
      dataIndex: 'completeAt',
      render: (completeAt) => {
        return dateTimeFormat(completeAt);
      },
    }];
    this.filterItems = [{
      text: '设备序号',
      name: 'sn',
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
        value: RPC_TYPE.UPCONFIG,
        text: '配置',
      }, {
        value: RPC_TYPE.UPGRADE,
        text: '升级',
      }, {
        value: RPC_TYPE.GETPARAM,
        text: '获取参数',
      }, {
        value: RPC_TYPE.GETINFO,
        text: '获取详情',
      }],
    }];
  }

  refersh = (filter, pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({ type: 'rpc/fetch', payload: { filter, pageNo, pageSize } });
  };

  render = () => {
    const { data, loading } = this.props;
    return (
      <div>
        <Grid
          columns={this.columns}
          loading={loading}
          filterItems={this.filterItems}
          data={data}
          refersh={this.refersh}
        />
      </div>
    );
  }


}


function mapStateToProps(state) {
  const { loading } = state;
  return {
    data: state.rpc,
    loading: loading.effects['rpc/fetch'],
  };
}

export default connect(mapStateToProps)(RpcList);

