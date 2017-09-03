import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import Upload from 'rc-upload';

export default class UploadField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }
  triggerChange = (value) => {
    const onChange = this.props.onChange;
    if (onChange) {
      if (value) {
        onChange(Object.assign({}, { value }));
      } else {
        onChange(null);
      }
    }
    const { onFieldChange } = this.props;
    if (onFieldChange) {
      onFieldChange();
    }
  };
  render = () => {
    const { item, ...other } = this.props;

    const props = {
      action: item.url,
      beforeUpload: (file) => {
        this.setState({
          name: file.name,
        });
        return new Promise((resolve) => {
          item.beforeUpload(resolve);
          this.triggerChange(resolve);
        }).then(() => {
          this.setState({
            name: file.name,
          });
        });
      },
      onSuccess: item.onSuccess,
      onError: (error) => {
        this.setState({ name: '' });
        this.triggerChange(null);
        if (item.onUpError) {
          item.onUpError(error);
        }
      },
    };

    return (
      <div>
        <Upload {...props} {...other}>
          <Button type="ghost" style={{ width: '100%' }}>
            <Icon type="upload" /> {item.text}
          </Button>
        </Upload>
        <span
          hidden={this.state.name === ''}
          style={{ fontSize: 16 }}
        >
          {this.state.name}
        </span>
      </div>
    );
  }
}
