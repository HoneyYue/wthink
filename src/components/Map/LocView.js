import React from 'react';
import PropTypes from 'prop-types';

export default class LocView extends React.Component {

  static defaultProps = {
    width: 300,
    height: 300,
    zoom: 13,
    ak: 'BsdrrUSaPSIpADIRCQDUsdLjXqkD9BTQ',
  };
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    url: PropTypes.string,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    zoom: PropTypes.number,
  };
  triggerChange = ({ point }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...point });
    }
    this.marker.setPosition(point);
  };
  genImgUrl = () => {
    const { width, height, url, lat, lng, zoom, ak } = this.props;
    let img = `http://api.map.baidu.com/staticimage/v2?copyright=1&ak=${ak}&width=${width}&height=${height}&markers=${lng},${lat}&zoom=${zoom}`;
    if (!url) {
      img += `&markerStyles=-1,${url}`;
    }
    return img;
  };
  render() {
    const { width, height, style } = this.props;
    if (style) {
      return <img alt="" style={style} src={this.genImgUrl()} />;
    }
    return <img alt="" style={{ height, width }} src={this.genImgUrl()} />;
  }
}
