import React from 'react';
import Form from 'components/Form';
import OrgTreeSelect from 'components/Org/OrgTreeSelect';


class SelectForm extends React.Component {
  constructor(props) {
    super(props);
    this.Form = Form();
  }
  formFields = () => {
    const { orgs } = this.props;
    return [{
      text: '所属机构',
      name: 'id',
      component: <OrgTreeSelect orgs={orgs} style={{ width: 200 }} allowClear />,
    }];
  };
  render = () => {
    const { onSubmit } = this.props;
    return (
      <this.Form
        inline
        canelBtn={false}
        fields={this.formFields()}
        onSubmit={onSubmit}
        okText="查询"
      />
    );
  }
}

export default SelectForm;
