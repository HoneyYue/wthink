import React, { PropTypes } from 'react';
import { Card, Form, Input, Select, Button, InputNumber, Switch, TreeSelect, DatePicker, Row, Col, Spin } from 'antd';
import moment from 'moment';

import DateRange from './DateRange';
import UploadField from './UploadField';
import MultipleTreeSelect from './MultipleTreeSelect';
import TriStateMultipleTreeSelect from './TriStateMultipleTreeSelect';
import LocSelect from './LocSelect';

const FormItem = Form.Item;

const isEmptyObject = (e) => {
  for (const t in e) {
    if (t) {
      return false;
    }
  }
  return true;
};
class MyForm extends React.Component {

  static defaultProps = {
    columns: 1,
    card: true,
    inline: false,
    okBtn: true,
    canelBtn: true,
    okText: '确定',
    canelText: '取消',
  }

  static propTypes = {
    fields: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    card: PropTypes.bool,
    inline: PropTypes.bool,
    columns: PropTypes.number,
    okBtn: PropTypes.bool,
    canelBtn: PropTypes.bool,
    extra: PropTypes.element,
    title: PropTypes.string,
  }
  getFieldsArray = () => {
    const { columns, fields } = this.props;
    if (this.fieldsArray) {
      return { fields, fieldsArray: this.fieldsArray };
    }
    const fieldsArray = [];
    for (let i = 0; i < columns; i += 1) {
      fieldsArray.push([]);
    }
    const dy = !!fields.find(field => field.check);
    if (!dy) {
      for (let i = fields.length; i >= 0; i -= 1) {
        fieldsArray[i % columns].unshift(i);
      }
      if (fields.length > 0) {
        this.fieldsArray = fieldsArray;
      }
      return { fields, fieldsArray };
    }
    const { form } = this.props;
    const values = form.getFieldsValue();
    if (isEmptyObject(values)) {
      fields.forEach((field) => {
        values[field.name] = field.value;
      });
    }
    const newFields = fields
      .filter((field) => {
        return !field.check || field.check(values);
      });
    for (let i = newFields.length; i >= 0; i -= 1) {
      fieldsArray[i % columns].unshift(i);
    }
    return { fields: newFields, fieldsArray };
  };
  getValues = () => {
    return this.props.form.getFieldsValue();
  }
  preUpload = (resolve) => {
    this.startUploadFile = resolve;
  };
  validateFields = (field) => {
    this.props.form.validateFields(field);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (this.startUploadFile) {
        this.startUploadFile(values);
      } else if (onSubmit) {
        onSubmit(values);
      }
    });
  };

  reset = () => {
    const { fields, onCancel } = this.props;
    if (this.startUploadFile) {
      this.startUploadFile = null;
    }
    if (onCancel) {
      return onCancel();
    }

    const { setFieldsValue } = this.props.form;
    if (!this.initValue) {
      const initValue = {};
      fields.forEach((field) => {
        initValue[field.name] = field.value;
      });

      this.initValue = initValue;
    }

    setFieldsValue(this.initValue);
  };
  renderItem = (item) => {
    const { getFieldDecorator } = this.props.form;
    const { data, value, text, validate = [], ...other } = item;
    const initialValue = item.value;
    if (item.component) {
      return getFieldDecorator(item.name, { initialValue, validate })(item.component);
    }
    if (item.type === 'input') {
      return getFieldDecorator(item.name, { initialValue, validate })(
        <Input placeholder={item.placeholder ? item.placeholder : `请输入${item.text}`} onPressEnter={this.handleSubmit} {...other} />,
      );
    } else if (item.type === 'number') {
      return getFieldDecorator(item.name, { initialValue, validate })(
        <InputNumber placeholder={`请输入${item.text}`} {...other} />,
      );
    } else if (item.type === 'textarea') {
      return getFieldDecorator(item.name, { initialValue, validate })(
        <Input type="textarea" rows={item.row} placeholder={`请输入${item.text}`} {...other} />,
      );
    } else if (item.type === 'password') {
      return getFieldDecorator(item.name, { initialValue, validate })(
        <Input type="password" autoComplete="off" placeholder={`请输入${item.text}`} onPressEnter={this.handleSubmit} {...other} />,
      );
    } else if (item.type === 'selectinput') {
      const prefixSelector = getFieldDecorator(item.selectname, {
        initialValue: item.selectvalue,
      })(
        { ...item.selects },
      );
      return getFieldDecorator(item.name, { initialValue, validate })(
        <Input placeholder={item.text} addonBefore={prefixSelector} />,
      );
    } else if (item.type === 'switch') {
      return getFieldDecorator(item.name, { valuePropName: 'checked', initialValue })(
        <Switch />,
      );
    } else if (item.type === 'select') {
      const options = item.options || [];
      const groups = item.groups || [];
      return getFieldDecorator(item.name, { initialValue, validate })(
        <Select {...other}>
          {
            options.map((option) => {
              return (
                <Select.Option key={option.value} value={option.value}>
                  {option.text}
                </Select.Option>
              );
            }).concat(groups.map((group) => {
              return (
                <Select.OptGroup label={group.name}>
                  {
                    group.options.map((option, index) => {
                      return (
                        <Select.Option key={index} value={option.value}>
                          {option.text}
                        </Select.Option>
                      );
                    })
                  }
                </Select.OptGroup>
              );
            }))
          }
        </Select>,
      );
    } else if (item.type === 'treeselect') {
      const tProps = {
        treeData: data,
        multiple: true,
        treeCheckable: true,
        showCheckedStrategy: TreeSelect.SHOW_PARENT,
        searchPlaceholder: text,
        ...other,
      };
      return getFieldDecorator(item.name, { initialValue })(<TreeSelect {...tProps} />);
    } else if (item.type === 'multipletreeselect') {
      const tProps = {
        treeData: data,
        multiple: true,
        treeCheckable: true,
        searchPlaceholder: text,
        ...other,
      };
      return getFieldDecorator(item.name, { initialValue })(<MultipleTreeSelect {...tProps} />);
    } else if (item.type === 'tristatemultipletreeSelect') {
      const tProps = {
        treeData: data,
        multiple: true,
        treeCheckable: true,
        searchPlaceholder: text,
        ...other,
      };
      return getFieldDecorator(item.name, { initialValue })(
        <TriStateMultipleTreeSelect {...tProps} />,
      );
    } else if (item.type === 'date') {
      return getFieldDecorator(item.name, { initialValue: typeof initialValue === 'number' ? new moment(new Date(initialValue)) : initialValue})(
        <DatePicker placeholder={item.text} {...other} />,
      );
    } else if (item.type === 'datetime') {
      return getFieldDecorator(item.name, { initialValue, validate })(
        <DatePicker placeholder={item.text} showTime format="YYYY-MM-DD HH:mm:ss" {...other} />,
      );
    } else if (item.type === 'daterange') {
      return getFieldDecorator(item.name, { initialValue: value })(
        <DateRange placeholder={text} {...other} />,
      );
    } else if (item.type === 'upload') {
      return getFieldDecorator(`_${item.name}`, { validate })(
        <UploadField
          item={{ beforeUpload: this.preUpload, ...item }}
          data={this.getValues}
          onFieldChange={() => { this.validateFields([`_${item.name}`]); }}
          {...other}
        />,
      );
    } else if (item.type === 'locselect') {
      return getFieldDecorator(item.name, { initialValue, validate })(
        <LocSelect
          {...other}
        />,
      );
    }
  };
  renderInline = () => {
    const { fields, okBtn, canelBtn, okText, canelText, extra } = this.props;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        {
          fields.map((item) => {
            return (
              <FormItem
                key={item.name}
                label={item.text}
              >
                { this.renderItem(item) }
              </FormItem>
            );
          })
        }
        <FormItem wrapperCol={{ span: 4, offset: 2 }} >
          {canelBtn ? <Button onClick={this.reset}>{canelText}</Button> : null}
          {okBtn ? <Button type="primary" onClick={this.handleSubmit}>{okText}</Button> : null}
        </FormItem>

        {extra}
      </Form>
    );
  };

  renderMultColumn = () => {
    const { extra } = this.props;
    const { fieldsArray, fields } = this.getFieldsArray();
    const coulmuns = fieldsArray.length;
    return (
      <Form layout="horizontal" className="ant-advanced-search-form">
        <Row gutter={16}>
          {
            fieldsArray.map((indexArray, i) => {
              return (
                <Col sm={24 / coulmuns} key={`filterindex${i}`}>
                  {
                    indexArray.map((index) => {
                      if (index >= fields.length) {
                        return null;
                      }

                      const item = fields[index];
                      return (
                        <Form.Item
                          key={item.name}
                          label={item.text}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 12 }}
                        >
                          {this.renderItem(item)}
                        </Form.Item>
                      );
                    })
                  }
                </Col>
              );
            })
          }
        </Row>

        { this.renderBtn() }
        {extra}
      </Form>
    );
  };

  renderBtn = () => {
    const { canelBtn, okBtn, canelText, okText } = this.props;
    if (!canelBtn && !okBtn) {
      return null;
    }
    return (
      <FormItem wrapperCol={{ span: 22 }} >
        {canelBtn ? <Button
          onClick={this.reset}
        >
          { canelText }
        </Button> : null}
        {okBtn ? <Button type="primary" style={{ marginLeft: 4 }} onClick={this.handleSubmit}>{okText}</Button> : null}
      </FormItem>
    );
  };
  renderForm = () => {
    const { inline, formloading } = this.props;
    if (inline) {
      return this.renderInline();
    }
    return (
      <Spin spinning={!!formloading} >
        {this.renderMultColumn()}
      </Spin>
    );
  };

  render() {
    const { card, title } = this.props;
    if (card || title) {
      return <Card title={title} noHovering >{this.renderForm()}</Card>;
    }

    return this.renderForm();
  }

}

const FormWarp = (opt = {}) => {
  return Form.create(opt)(MyForm);
};
export { FormWarp as default, MyForm as RawForm };
