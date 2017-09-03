import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

import DevInfo from 'components/Dev/DevInfo';

class BDMarker extends React.Component {

  static defaultProps = {
    devs: [],
  };
  static propTypes = {
    devs: PropTypes.array,
    map: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.markers = [];
  }
  componentDidMount = () => {
    const { map, devs } = this.props;
    if (!map) {
      return;
    }
    for (const marker of devs) {
      this.addMarker(marker, map);
    }
  };
  componentWillReceiveProps = (nextProps) => {
    const { devs, map } = nextProps;
    if (!map) {
      return;
    }
    if (devs === this.props.devs) {
      return;
    }
    for (const em of this.markers) {
      const find = devs.find((marker) => {
        return em.sn === marker.sn;
      });
      if (!find) {
        this.removeMarker(em);
        em.sn = null;
      }
    }
    this.markers = this.markers.filter((em) => {
      return em.sn !== null;
    });

    for (const marker of devs) {
      const find = this.markers.find((em) => {
        return em.sn === marker.sn;
      });
      if (!find) {
        this.addMarker(marker, map);
      } else {
        const oldMarker = this.props.devs.find((em) => {
          return em.sn === marker.sn;
        });
        if (oldMarker.icon !== marker.icon) {
          find.setIcon(marker.icon);
          oldMarker.icon = marker.icon;
        }
      }
    }
  };
  componentWillUnmount = () => {
    for (const em of this.markers) {
      this.removeMarker(em);
    }
    this.markers = [];
  };
  onMarkerClick = ({ target }) => {
    const { dispatch } = this.props;
    this.select(target.sn);
    dispatch({ type: 'devdetail/fetch', payload: { sn: target.sn } });
    const div = document.createElement('div');
    const router = () => <DevInfo nocard />;
    ReactDOM.render(window.app._getProvider(router)(), div);
    const infoWindow = new BMap.InfoWindow(div);
    this.infoWindow = infoWindow;
    target.openInfoWindow(infoWindow);
    infoWindow.addEventListener('close', this.onMarkerInfoWindowClose);
  };
  onMarkerInfoWindowClose = ({ target }) => {
    ReactDOM.unmountComponentAtNode(target.getContent());
    if (target === this.infoWindow) {
      this.unselect();
    }
  };
  select = (sn) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devmap/select', payload: { sn } });
  };
  unselect = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'devmap/select', payload: {} });
  };
  addMarker = ({ lat, lng, icon, sn }, map) => {
    const marker = new BMap.Marker(new BMap.Point(lng, lat));
    if (icon) {
      marker.setIcon(icon);
    }
    map.addOverlay(marker);
    marker.sn = sn;
    this.markers.push(marker);
    marker.addEventListener('click', this.onMarkerClick);
    marker.addEventListener('mouseover', (event) => { this.select(event.target.sn); });
    return marker;
  }
  removeMarker = (marker) => {
    const { map } = this.props;
    if (!map) {
      return;
    }
    map.removeOverlay(marker);
  };
  render() {
    return <div />;
  }
}

function mapStateToProps({ devmap: { markers } }) {
  return {
    devs: markers,
  };
}

export default connect(mapStateToProps)(BDMarker);
