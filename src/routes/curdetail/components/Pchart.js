import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const RADIAN = Math.PI / 180;
class SimplePieChart extends React.Component {
  renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + ((outerRadius - innerRadius) * 0.5);
    const x = cx + (radius * Math.cos(-midAngle * RADIAN));
    const y = cy + (radius * Math.sin(-midAngle * RADIAN));

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render = () => {
    const { data, showColor } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        <PieChart width={210} height={210}>
          <Pie
            data={data}
            cx={100}
            cy={90}
            labelLine={false}
            label={this.renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            isAnimationActive={false}
          >
            {
              data.map((entry, index) => <Cell fill={showColor[index % showColor.length]} />)
            }
          </Pie>
          <Legend />
        </PieChart>
        {
          data.map((item) => {
            return (
              <span style={{ margin: '5px' }}>{ item.name } : { item.value }</span>
            );
          })
        }
      </div>
    );
  }
}

export default SimplePieChart;
