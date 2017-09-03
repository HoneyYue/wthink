import React from 'react';
import { connect } from 'dva';
import { Map } from 'components';

import { queryTree } from 'utils';

import DevFilterForm from './components/DevFilterForm';
import DevMarkers from './components/DevMarkers';
import DevRelation from './components/DevRelation';
import OnlineStatistic from './components/OnlineStatistic';

class MapPage extends React.Component {
  constructor(props) {
    super(props);
    this.componets = [{
      id: 'map_search',
      pos: {
        loc: window.BMAP_ANCHOR_TOP_LEFT || 0,
        leftOffset: 10,
        topOffset: 10,
      },
      component: <DevFilterForm query={this.filterQuery} onOrgChange={this.onOrgChange} />,
    }, {
      id: 'map_statistic',
      pos: {
        loc: window.BMAP_ANCHOR_TOP_RIGHT || 1,
        rightOffset: 10,
        topOffset: 10,
      },
      component: <OnlineStatistic />,
    }];
  }
  onOrgChange = (id, sn) => {
    const { orgs } = this.props;
    const org = queryTree(orgs, id);
    if (org && org.map) {
      const { lat, lng } = org.map;
      this.map.panTo(new BMap.Point(lng, lat));
    }
    this.filterQuery({ org: id, sn });
  };
  onMapInit = (map) => {
    const { center: { lat, lng, zoom } } = this.props;
    map.centerAndZoom(new BMap.Point(lng, lat), zoom);
    map.addEventListener('resize', this.search);
    map.addEventListener('moveend', this.search);
    map.addEventListener('zoomend', this.search);
    this.map = map;
    this.search({ statistic: true });
    this.setState({});
  };
  filterQuery = ({ org, sn }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'devmap/query', payload: { sn, org } });
  };
  search = ({ statistic }) => {
    const { dispatch } = this.props;
    const northEast = this.map.getBounds().getNorthEast();
    const southWest = this.map.getBounds().getSouthWest();
    dispatch({ type: 'devmap/fetch', payload: { minLat: southWest.lat, minLng: southWest.lng, maxLat: northEast.lat, maxLng: northEast.lng, statistic } });
  };
  render = () => {
    return (
      <Map onMapInit={this.onMapInit} componets={this.componets} >
        <DevMarkers map={this.map} />
        <DevRelation map={this.map} />
      </Map>
    );
  };
}

MapPage.propTypes = {
};

function mapStateToProps({ devmap, org }) {
  return {
    center: devmap.center,
    orgs: org.orgs,
  };
}

export default connect(mapStateToProps)(MapPage);
