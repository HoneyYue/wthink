import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import Pchart from './components/Pchart';
import SelectForm from './components/SelectForm';
import CardBox from './components/Card';
import styles from './index.less';

class CurDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onSubmit = ({ id }) => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({ type: 'curdetail/fetch', payload: { id } });
    }
  };

  render = () => {
    const { orgs, data } = this.props;
    const totalList = [{ name: '离线', value: data.total }, { name: '在线', value: data.online }];
    const alaList = [{ name: '正常', value: data.total }, { name: '告警', value: data.alarm }];
    const totalColor = ['#0088FE', '#00C49F'];
    const alaColor = ['#0088FE', '#FF5000'];

    return (
      <div>
        <SelectForm orgs={orgs} onSubmit={this.onSubmit} />
        <div className={styles.leftsize}>
          <h3 className={styles.title}>机构设备状态：</h3>
          <Card title="在线率" style={{ margin: '20px 0 0 0' }}>
            <Pchart data={totalList} showColor={totalColor} />
          </Card>
          <Card title="正常率" style={{ margin: '20px 0 0 0' }}>
            <Pchart data={alaList} showColor={alaColor} />
          </Card>
        </div>
        <div className={styles.rightsize}>
          <h3 className={styles.title}>下级机构设备状态：</h3>
          <CardBox data={data.currenList} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.curdetail,
    orgs: state.org.orgs,
  };
}

export default connect(mapStateToProps)(CurDetail);
