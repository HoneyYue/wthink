import React from 'react';
import { connect } from 'dva';
import { RTU, GTY } from '../config';

class DevRelation extends React.Component {
  constructor(props) {
    super(props);
    this.lines = [];
  }
  componentDidMount = () => {
    const { map, select, markers, devs } = this.props;
    if (!map || !select) {
      return;
    }
    if (select.type === RTU) {
      const master = this.findMaster(select, markers) || this.findMaster(select, devs);
      if (master) {
        this.addLine(select, master);
      }
    } else if (select.type === GTY) {
      const rtus = this.findRtus(select, markers);
      for (const rtu of rtus) {
        this.addLine(select, rtu);
      }
    }
  }
  componentWillReceiveProps = ({ map, select, markers, devs }) => {
    if (!map) {
      return;
    }
    if (!select) {
      for (const line of this.lines) {
        this.removeLine(line);
      }
      this.lines = [];
      return;
    }

    if (select.type === RTU) {
      const master = this.findMaster(select, markers) || this.findMaster(select, devs);
      if (master) {
        const lineSn = `${select.sn}-${master.sn}`;
        const removeLines = this.lines.filter(line => line.sn !== lineSn);
        for (const line of removeLines) {
          this.removeLine(line);
        }
        this.lines = this.lines.filter(line => line.sn === lineSn);
        this.addLine(select, master);
        return;
      }
      for (const line of this.lines) {
        this.removeLine(line);
      }
      this.lines = [];
    } else if (select.type === GTY) {
      const removeLines = this.lines.filter(line => !line.sn.startsWith(`${select.sn}-1`));
      for (const line of removeLines) {
        this.removeLine(line);
      }
      this.lines = this.lines.filter(line => line.sn.startsWith(`${select.sn}-1`));
      const rtus = this.findRtus(select, markers);
      for (const rtu of rtus) {
        this.addLine(select, rtu);
      }
    }
  }
  addLine = (from, to) => {
    const sn = `${from.sn}-${to.sn}`;
    const exists = this.lines.find(line => line.sn === sn);
    if (exists) {
      return;
    }
    const { map } = this.props;
    const line = new BMap.Polyline([
      new BMap.Point(from.lng, from.lat),
      new BMap.Point(to.lng, to.lat),
    ], {
      strokeStyle: 'dashed',
    });
    line.sn = sn;
    map.addOverlay(line);
    this.lines.push(line);
  };
  removeLine = (line) => {
    const { map } = this.props;
    map.removeOverlay(line);
  };
  findMaster = (rtu, devs) => {
    return devs.find(dev => dev.sn === rtu.master);
  };
  findRtus = (master, devs) => {
    return devs.filter(dev => dev.master === master.sn);
  };
  render = () => {
    return <div />;
  };
}

function mapStateToProps({ devmap: { select, markers, devs } }) {
  return {
    select,
    markers,
    devs,
  };
}

export default connect(mapStateToProps)(DevRelation);
