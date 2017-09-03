import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'components/Grid';
import AlarmColumn from 'components/Alarm/AlarmColumn';

export default class AlarmHistoryList extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    refersh: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.columns = [{
      title: '说明',
      dataIndex: 'type',
      render: (type, alarm) => {
        return <AlarmColumn alarm={alarm} />;
      },
    }, {
      title: '产生时间',
      dataIndex: 'alarmAt',
    }, {
      title: '处理用户',
      dataIndex: 'cleanBy',
    }, {
      title: '处理时间',
      dataIndex: 'cleanAt',
    }];
  }
  render = () => {
    const { data, loading, refersh } = this.props;
    return (
      <Grid
        disableToolbar
        columns={this.columns}
        data={data}
        loading={loading}
        refersh={refersh}
      />
    );
  };
}
