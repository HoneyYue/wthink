import React from 'react';
import { connect } from 'dva';
import { Radio, Badge } from 'antd';

class OnlineStatistic extends React.Component {
  switch = (event) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devmap/statistic', payload: { status: event.target.value } });
  };
  render = () => {
    const { total, online, status } = this.props;
    return (
      <Radio.Group onChange={this.switch} value={status} >
        <Radio.Button value="ON"><Badge status="success" />在线:{online}</Radio.Button>
        <Radio.Button value="OFF"><Badge status="error" />离线:{total - online}</Radio.Button>
        <Radio.Button value="ALL">全部:{total}</Radio.Button>
      </Radio.Group>
    );
  };
}

function mapStateToProps({ devmap: { statistic: { total, online }, filter: { status } } }) {
  return {
    total,
    online,
    status,
  };
}
export default connect(mapStateToProps)(OnlineStatistic);
