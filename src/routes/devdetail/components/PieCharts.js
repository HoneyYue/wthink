import React from 'react';
import { PieChart, Pie, Cell, Sector } from 'recharts';

export default class PieCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex1: 0,
      timeOut: true,
    };
  }
  componentDidMount = () => {
    if (this.state.timeOut) {
      setTimeout(() => {
        this.setState({
          timeOut: false,
        });
      }, 500);
    }
  };
  onPieEnter1 = (props, index) => {
    this.setState({
      activeIndex1: index,
    });
  };

  renderLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + ((outerRadius - innerRadius) * 0.5);
    const x = cx + (radius * Math.cos(-midAngle * RADIAN));
    const y = cy + (radius * Math.sin(-midAngle * RADIAN));
    return (<text x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central" >
      <tspan x={x} y={y}>
        {`${(percent * 100).toFixed(0)}%`}
      </tspan>
    </text>
    );
  };
  renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius,
      startAngle, endAngle, fill, percent, name } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + ((outerRadius + 10) * cos);
    const sy = cy + ((outerRadius + 10) * sin);
    const mx = cx + ((outerRadius + 30) * cos);
    const my = cy + ((outerRadius + 30) * sin);
    const ex = mx + ((cos >= 0 ? 1 : -1) * 22);
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 2}
          outerRadius={outerRadius + 6}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + ((cos >= 0 ? 1 : -1) * 12)} y={ey} textAnchor={textAnchor} fill="#333">{`${name.slice(0, 6)}`}</text>
        <text x={ex + ((cos >= 0 ? 1 : -1) * 12)} y={ey} dy={12} textAnchor={textAnchor} fill="#999">
          {`(占比 ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  render = () => {
    if (this.state.timeOut) {
      return <div />;
    }
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const alarmList = this.props.alarmData;
    if (alarmList.length === 0) {
      return <div />;
    }
    let max = alarmList[0].completeAt ? alarmList[0].completeAt : new Date().getTime();
    let min = alarmList[0].alarmAt;
    alarmList.map((value) => {
      min = value.alarmAt < min ? value.alarmAt : min;
      if (value.completeAt) {
        max = value.completeAt > max ? value.completeAt : max;
      }
      return null;
    });
    const dateNum = this.props.dateNum;
    const renderData1 = [
      { name: '设备离线时间', value: (max - min) / (dateNum * 3600 * 24 * 1000) >= 1 ? 1 : (max - min) / (dateNum * 3600 * 24 * 1000) },
      { name: '设备正常时间', value: (max - min) / (dateNum * 3600 * 24 * 1000) >= 1 ? 0 : 1 - ((max - min) / (dateNum * 3600 * 24 * 1000)) }];
    const { width, height, cx, cy, x, y } = this.props.stylePieCharts;
    return (
      <PieChart
        width={width}
        height={height}
      >
        <Pie
          activeIndex={this.state.activeIndex1}
          activeShape={this.renderActiveShape}
          cx={cx}
          cy={cy}
          outerRadius="65%"
          data={renderData1}
          labelLine={false}
          label={this.renderLabel}
          onMouseEnter={this.onPieEnter1}
        >
          {renderData1.map((entry, index) => (<Cell key={entry} fill={COLORS[index]} />))}
        </Pie>
        <text x={x} y={y}>设备运行时间占比</text>
      </PieChart>);
  }
}
