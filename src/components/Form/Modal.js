import React from 'react';
import { Modal, Form } from 'antd';
import { RawForm } from './index';

class MyModal extends React.Component {
  handleOk = () => {
    const { form, onSubmit, formprops } = this.props;
    if (formprops && formprops.loading) {
      return;
    }
    form.validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...form.getFieldsValue(),
      };
      for (const field in data) {
        if (data[field] && typeof data[field].value === 'function') {
          return data[field].value();
        }
      }
      onSubmit(data);
    });
  };
  renderForm = (form, fields) => {
    const { visible, formprops } = this.props;
    if (!visible) {
      return null;
    }
    return (
      <RawForm
        form={form}
        fields={fields}
        canelBtn={false}
        okBtn={false}
        card={false}
        {...formprops}
      />
    );
  };
  render = () => {
    const { form, fields, ...other } = this.props;
    return (
      <Modal
        onOk={this.handleOk}
        {...other}
      >
        {this.renderForm(form, fields)}
      </Modal>
    );
  };
}
export default Form.create()(MyModal);
