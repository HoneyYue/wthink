import React from 'react';
import Form from 'components/Form';
import OrgTreeSelect from 'components/Org/OrgTreeSelect';
import DateRange from 'components/Form/DateRange';


class SelectForm extends React.Component {
  constructor(props) {
    super(props);
    this.Form = Form();
  }
  formFields = () => {
    const { orgs, time } = this.props;
    return [{
      text: '所属机构',
      name: 'orgs',
      component: <OrgTreeSelect orgs={orgs} multiple style={{ width: 200 }} />,
    }, {
      text: '日期',
      name: 'time',
      value: time,
      component: <DateRange />,
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
