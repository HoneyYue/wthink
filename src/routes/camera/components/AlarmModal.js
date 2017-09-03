import React from 'react';
import { connect } from 'dva';
import { Modal, Tabs } from 'antd';
import PropTypes from 'prop-types';

import AlarmList from 'components/Alarm/AlarmList';
import AlarmHistoryList from './AlarmHistoryList';

const CURRENT = 'CURRENT';
const HISTORY = 'HISTORY';

class AlarmModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { tab: CURRENT };
    this.hasloadHistory = false;
  }
  componentWillReceiveProps = (nextProps) => {
    const { visible } = this.props;
    if (visible && !nextProps.visible) {
      this.hasloadHistory = false;
      this.state.tab = CURRENT;
    }
  };
  onTabChange = (tab) => {
    this.setState({ tab });
    if (tab === HISTORY && !this.hasloadHistory) {
      this.refershHistory();
      this.hasloadHistory = true;
    }
  };
  refershHistory = (filter, pageNo, pageSize) => {
    const { dispatch, alarm } = this.props;
    dispatch({ type: 'devalarm/fetchHistory', payload: { sn: alarm.sn, pageNo, pageSize } });
  };
  render = () => {
    const { alarm, visible, onClose, alarmloading, historyloading } = this.props;
    const { tab } = this.state;
    return (
      <Modal
        visible={visible}
        title={alarm.sn}
        onCancel={onClose}
        footer={null}
      >
        <Tabs activeKey={tab} size="small" style={{ height: 500 }} onChange={this.onTabChange}>
          <Tabs.TabPane tab="实时告警" key={CURRENT}>
            <AlarmList
              loading={alarmloading}
              alarms={alarm.current}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="历史告警" key={HISTORY}>
            <AlarmHistoryList
              loading={historyloading}
              data={alarm.history}
              refersh={this.refershHistory}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  };
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    alarm: state.camalarm,
    alarmloading: loading.effects['camalarm/fetch'],
    historyloading: loading.effects['camalarm/fetchHistory'],
  };
}

export default connect(mapStateToProps)(AlarmModal);
