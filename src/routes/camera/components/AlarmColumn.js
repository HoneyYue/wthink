import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'antd';
import AlarmColums from 'components/Alarm/AlarmColumn';

export default class AlarmColumn extends React.Component {
  static propTypes = {
    showMore: PropTypes.func.isRequired,
    sn: PropTypes.string.isRequired,
    alarm: PropTypes.object,
    ids: PropTypes.array,
  }
  showMore = () => {
    const { showMore, sn } = this.props;
    showMore(sn);
  };
  renderBadge = () => {
    const { ids, alarm } = this.props;
    if (alarm === undefined) {
      return null;
    }
    return (
      <a href="#" onClick={this.showMore} style={{ margin: '0 0 0 5px' }}>
        <AlarmColums alarm={alarm} />
        <Badge count={ids.length} style={{ margin: '-5px 0 0 5px' }} />
      </a>
    );
  };
  render = () => {
    const { ids } = this.props;
    if (!ids || ids.length === 0) {
      return this.renderBadge();
    }
    return (
      <span>
        {this.renderBadge()}
      </span>
    );
  }
}
