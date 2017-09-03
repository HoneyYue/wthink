import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import Modal from 'components/Form/Modal';

export default class UploadModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props);
    this.fields = [{
      text: '版本文件',
      name: 'file',
      type: 'upload',
      url: '/iso/add',
      validate: [{
        rules: [
          { required: true, message: '请选择版本文件' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
      onSuccess: (rsp) => {
        const { onSuccess } = this.props;
        if (rsp.success) {
          message.info('导入成功');
          onSuccess();
        } else {
          message.error(rsp.message);
        }
      },
      onUpError: (error) => {
        message.error(`导入失败${error.message}`);
      },
    }, {
      text: '自动升级',
      name: 'autoUp',
      type: 'switch',
      value: false,
    }];
  }
  render = () => {
    const { visible, onClose, loading } = this.props;
    return (
      <Modal
        title="添加版本"
        visible={visible}
        fields={this.fields}
        confirmLoading={loading}
        onCancel={onClose}
        onSubmit={this.upload}
      />
    );
  };
}
