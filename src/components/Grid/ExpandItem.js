import React, { Component, PropTypes } from 'react';
import { Spin } from 'antd';

export default class ExpandItem extends Component {

  static propTypes = {
    expandRowData: PropTypes.func.isRequired,
    id: PropTypes.object.isRequired,
    expandedRowRender: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { data: null, loading: true };
    const { expandRowData } = props;
    if (typeof expandRowData === 'function') {
      setTimeout(() => {
        this.setState({ data: expandRowData(), loading: false });
      });
    } else if (expandRowData && typeof expandRowData.then === 'function') {
      expandRowData.then((data) => {
        this.setState({ data, loading: false });
      });
    }
  }

  render= () => {
    const { loading, data } = this.state;
    const { id, expandedRowRender } = this.props;
    if (loading) {
      return <Spin tip="加载中..." size="large" className="spin" />;
    }

    return expandedRowRender(id, data);
  }
}
