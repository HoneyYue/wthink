import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import Modal from 'components/Form/Modal';

export default class ImportModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props);
    this.fields = [{
      text: '选择文件',
      name: 'file',
      type: 'upload',
      url: '/dev/upload',
      onSuccess: (rsp) => {
        const { onSuccess } = this.props;
        if (rsp.success) {
          message.info('导入成功');
          onSuccess();
        } else {
          message.error(rsp.message);
        }
      },
      onError: (error) => {
        message.error(`导入失败${error.message}`);
      },
    }];
  }
  download = () => {
    window.location = '/zcdr.xls';
  };
  upload = () => {
    message.warn('请选择资产文件进行导入');
  };
  render = () => {
    const { visible, onClose, loading } = this.props;
    return (
      <Modal
        title="资产导入"
        visible={visible}
        fields={this.fields}
        confirmLoading={loading}
        onCancel={onClose}
        onSubmit={this.upload}
        formprops={{
          okText: '下载导入模板',
          okBtn: true,
          inline: true,
          onSubmit: this.download,
        }}
      />
    );
  };
}
