import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Button, Input } from 'antd';

import Map from 'components/Map';

export default class LocSelect extends React.Component {
  static defaultProps = {
    maxWidth: 400,
    height: 300,
    showNum: false,
    closeable: true,
    setAddress: false,
  };
  static propTypes = {
    height: PropTypes.number,
    maxWidth: PropTypes.number,
    showNum: PropTypes.bool,
    closeable: PropTypes.bool,
    setAddress: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      lat: value.lat,
      lng: value.lng,
      address: value.address,
    };

    if (this.props.closeable) {
      this.componets = [{
        pos: {
          loc: window.BMAP_ANCHOR_TOP_RIGHT || 1,
        },
        component: <Button icon="close" onClick={this.clean} />,
      }];
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState(nextProps.value || { lat: null, lng: null, address: null });
      if (!nextProps.value) {
        this.destoryMarker();
      }
    }
  }
  onMapInit = (map) => {
    const { lat, lng } = this.state;
    this.map = map;
    if (!lat) {
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 6);
      map.addEventListener('click', this.mapClick);
    } else {
      map.centerAndZoom(new BMap.Point(lng, lat), 6);
      this.renderMarker({ lat, lng });
    }
  };
  onMarkerClick = ({ target }) => {
    const infoWindow = new BMap.InfoWindow('拖动图标设置位置');
    infoWindow.disableCloseOnClick();
    target.openInfoWindow(infoWindow);
  };
  triggerLocChange = ({ point }) => {
    const { onChange } = this.props;
    if (onChange) {
      const { address } = this.state;
      onChange({ ...point, address });
    }
  };
  triggerAddressChange = (event) => {
    const { onChange } = this.props;
    if (onChange) {
      const { lat, lng } = this.state;
      onChange({ lat, lng, address: event.target.value });
    }
  };
  triggerChange = ({ point, address }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...point, address });
    }
  };
  mapClick = ({ point }) => {
    if (!this.marker) {
      this.renderMarker(point);
      this.triggerLocChange({ point });
    }
  };
  clean = () => {
    this.triggerChange({ point: { }, address: null });
    this.destoryMarker();
    this.setState({ lat: null, lng: null, address: null });
  };
  destoryMarker = () => {
    if (!this.marker) {
      return;
    }
    this.marker.removeEventListener('dragend', this.triggerLocChange);
    this.map.removeOverlay(this.marker);
    this.marker = null;
  };
  renderMarker = ({ lat, lng }) => {
    this.marker = new BMap.Marker(new BMap.Point(lng, lat));
    this.marker.enableDragging();
    this.marker.addEventListener('dragend', this.triggerLocChange);
    this.map.addOverlay(this.marker);
  };
  renderTip = () => {
    const { lat } = this.state;
    if (!lat) {
      return '点击地图设置位置';
    } else {
      return '拖动图标设置位置';
    }
  };
  renderLocText = () => {
    const { showNum } = this.props;
    if (!showNum) {
      return null;
    }
    const { lat, lng } = this.state;
    const value = !lat ? '未设置' : `${lat},${lng}`;
    return <Input prefix={<Icon type="environment" />} value={value} />;
  };
  renderAddress = () => {
    const { setAddress } = this.props;
    if (!setAddress) {
      return null;
    }
    const { address } = this.state;
    return <Input addonBefore={<Icon type="" >设置地址</Icon>} style={{ width: '100%' }} value={address} onChange={this.triggerAddressChange} />;
  };
  render() {
    const { height, maxWidth } = this.props;
    return (
      <div style={{ height, maxWidth }}>
        <Tooltip title={this.renderTip()} placement="right" visible >
          <Map onMapInit={this.onMapInit} id="locselect" componets={this.componets} />
        </Tooltip>
        {this.renderLocText()}
        {this.renderAddress()}
      </div>
    );
  }
}
