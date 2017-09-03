import React, { Component } from 'react';
import { TreeSelect } from 'antd';

export default class MultipleTreeSelect extends Component {

  constructor(props) {
    super(props);
    const { initValue, multiple } = props;
    let value;
    if (initValue) {
      value = initValue;
    } else if (multiple) {
      value = [];
    }
    this.state = {
      multipleValue: value,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { treeData } = nextProps;
    if (treeData !== this.props.treeData) {
      this.setState({ multipleValue: nextProps.multiple ? [] : null });
    }
  }

  onMultipleChange = (value) => {
    const { onChange } = this.props;
    this.setState({ multipleValue: value });
    if (onChange) {
      if (Array.isArray(value)) {
        onChange(value.map((node) => {
          if (node.value) {
            return node.value;
          }

          return node;
        }));
      } else {
        onChange(value);
      }
    }
  }

  render = () => {
    const { ...other } = this.props;
    return (
      <TreeSelect
        treeCheckStrictly
        multiple
        treeCheckable
        {...other}
        value={this.state.multipleValue}
        onChange={this.onMultipleChange}
      />
    );
  }

}
