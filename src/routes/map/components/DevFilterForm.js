import React from 'react';
import { connect } from 'dva';

import Form from 'components/Form';
import OrgTreeSelect from 'components/Org/OrgTreeSelect';

class DevFilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.Form = Form();
  }
  onSnChange = (event) => {
    this.sn = event.target.value;
  };
  onOrgChange = (org) => {
    const { onOrgChange } = this.props;
    onOrgChange(org, this.sn);
  };
  getFilter = () => {
    const { orgs, org, sn } = this.props;
    this.sn = sn;
    return [{
      name: 'org',
      value: org,
      component: <OrgTreeSelect
        allowClear
        orgs={orgs}
        style={{ width: 200 }}
        placeholder="机构"
        onChange={this.onOrgChange}
      />,
    }, {
      name: 'sn',
      value: sn,
      type: 'input',
      onChange: this.onSnChange,
      placeholder: '设备序号',
    }];
  }
  render = () => {
    const { query } = this.props;
    return (
      <this.Form
        inline
        canelBtn={false}
        card={false}
        okText="查询"
        fields={this.getFilter()}
        onSubmit={query}
      />
    );
  };
}

function mapStateToProps({ org: { orgs }, devmap: { filter: { org, sn } } }) {
  return {
    orgs,
    org,
    sn,
  };
}

export default connect(mapStateToProps)(DevFilterForm);
