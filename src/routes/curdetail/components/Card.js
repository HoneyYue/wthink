import React from 'react';
import { Card, Icon } from 'antd';

export default class CardBox extends React.Component {

  render = () => {
    const { data } = this.props;
    return (
      <div>
        {
          data.map((item) => {
            return (
              <Card title={item.name} noHovering>
                <p><Icon type="bar-chart" />设备总数：{ item.total }</p>
                <p><Icon type="barcode" />在线设备：{ item.online }</p>
                <p><Icon type="exclamation-circle-o" />断网设备：{ item.alarm }</p>
              </Card>
            );
          })
        }
      </div>
    );
  }
}
