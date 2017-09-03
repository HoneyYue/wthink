import React from 'react';
import { PieChart, Pie, Cell, Sector } from 'recharts';

export default class PieCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndexTop: 0,
      activeIndexBottom: 0,
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
  onPieEnterTop = (props, index) => {
    this.setState({
      activeIndexTop: index,
    });
  };
  onPieEnterBottom = (props, index) => {
    this.setState({
      activeIndexBottom: index,
    });
  };
  renderLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + ((outerRadius - innerRadius) * 0.5);
    const x = cx + (radius * Math.cos(-midAngle * RADIAN));
    const y = cy + (radius * Math.sin(-midAngle * RADIAN));
    return (<text x={x} y={y} fill="white" textAnchor={'middle'} dominantBaseline="central">
      <tspan x={x} y={y}>
        {`${(percent * 100).toFixed(0)}%`}
      </tspan>
    </text>
    );
  };
  renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius,
      startAngle, endAngle, fill, percent, value, name } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + ((outerRadius + 10) * cos);
    const sy = cy + ((outerRadius + 10) * sin);
    const mx = cx + ((outerRadius + 30) * cos);
    const my = cy + ((outerRadius + 30) * sin);
    const ex = mx + ((cos >= 0 ? 1 : -1) * 22);
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    const xText = ex + ((cos >= 0 ? 1 : -1) * 12);
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
        <text x={xText} y={ey} dy={-12} textAnchor={textAnchor} fill="#333">{`版本号 ${name}`}</text>
        <text x={xText} y={ey} textAnchor={textAnchor} fill="#333">{`数量 ${value}`}</text>
        <text x={xText} y={ey} dy={12} textAnchor={textAnchor} fill="#999">
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
    const { data } = this.props;
    const renderDataTop = data.iosVer.result.GTY;
    const renderDataBottom = data.iosVer.result.RTU;
    return (
      <PieChart
        width={500}
        height={500}
      >
        <Pie
          activeIndex={this.state.activeIndexTop}
          activeShape={this.renderActiveShape}
          cx="45%"
          cy="25%"
          outerRadius="30%"
          startAngle={30}
          endAngle={390}
          data={renderDataTop}
          labelLine={false}
          label={this.renderLabel}
          onMouseEnter={this.onPieEnterTop}
          nameKey={'ver'}
          valueKey={'count'}
        >
          {renderDataTop.map((entry, index) => (<Cell key={entry} fill={COLORS[index]} />))}
        </Pie>
        <text x={20} y={10}>网关各版本所占比例</text>
        <Pie
          activeIndex={this.state.activeIndexBottom}
          activeShape={this.renderActiveShape}
          cx="45%"
          cy="75%"
          outerRadius="30%"
          data={renderDataBottom}
          labelLine={false}
          label={this.renderLabel}
          onMouseEnter={this.onPieEnterBottom}
          nameKey={'ver'}
          valueKey={'count'}
        >
          {renderDataBottom.map((entry, index) => (<Cell key={entry} fill={COLORS[index]} />))}
        </Pie>
        <text x={20} y={260}>采集器各版本所占比例</text>
      </PieChart>);
  }
}
