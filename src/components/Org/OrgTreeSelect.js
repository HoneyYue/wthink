import React from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';

import { treeMap } from 'utils';

export default class OrgTreeSelect extends React.Component {
  static defaultProps = {
    multiple: false,
  };
  static propTypes = {
    multiple: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = { value };
  }
  onChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };
  getOrgData = () => {
    if (this.orgs && this.orgs.length > 0) {
      return this.orgs;
    }
    this.orgs = treeMap(this.props.orgs, (org) => {
      return { ...org, value: org.id, label: org.name };
    });
    return this.orgs;
  };
  render = () => {
    const { multiple, value, ...other } = this.props;
    return (
      <TreeSelect
        defaultValue={value}
        multiple={multiple}
        onChange={this.onChange}
        treeData={this.getOrgData()}
        {...other}
      />
    );
  }
}
