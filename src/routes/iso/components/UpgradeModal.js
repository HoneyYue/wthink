import React from 'react';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import { dateTimeFormat } from 'utils';
import Grid from 'components/Grid';

import { ISO_TYPE_NAME } from '../constant';

class UpgradeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: [],
    };
    this.columns = [{
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
  }
  checked = (key) => {
    this.setState({
      select: key,
    });
  };
  selcGrade = (callback) => {
    const { onSuccess, dispatch } = this.props;
    const { select } = this.state;
    if (select.length == 0) {
      message.error('需要选择升级项');
    } else {
      dispatch({ type: 'grade/upGrade', payload: { select }, callback });
      if (callback.success === true) {
        onSuccess();
      } else {
        message.error('升级失败，重新选择升级');
      }
    }
  };
  render = () => {
    const { visible, onClose, data } = this.props;
    return (
      <Modal
        title="版本升级"
        visible={visible}
        onCancel={onClose}
        onOk={this.selcGrade}
      >
        <Grid
          disableToolbar
          columns={this.columns}
          data={data}
          onRowSelectChange={this.checked}
        />
      </Modal>
    );
  };
}

function mapStateToProps(state) {
  return {
    data: state.grade,
  };
}

export default connect(mapStateToProps)(UpgradeModal);
