import React from 'react';
import { Radio, Popover } from 'antd';
import { dateTimeFormat } from 'utils/index';
import { ScatterChart, XAxis, YAxis, ZAxis, Scatter } from 'recharts';


export default class ScatterCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonValue: 30,
      data: [],
      createAt: 0,
      completeAt: 0,
    };
    this.completeAt = new Date().getTime();
    this.data02 = () => {
      const arrX = [];
      const time = new Date().getTime();
      for (let i = 30; i > 0; i -= 1) {
        const date = dateTimeFormat(time - ((i - 1) * 3600 * 24 * 1000)).slice(0, 10);
        arrX.push({
          value: date,
        });
      }
      return arrX;
    };
  }
  calcDev = (value) => {
    const dateStart = new Date(value).getTime();
    const dateEnd = dateStart + (3600 * 24 * 1000);
    const dev = [];
    this.props.alarmData.map((each) => {
      if (each.alarmAt >= dateStart && each.alarmAt < dateEnd) {
        dev.push({
          createAt: each.alarmAt,
          completeAt: each.completeAt ? each.completeAt : this.completeAt,
          type: each.type,
        });
      }
      return null;
    });
    return dev;
  };
  square = (props) => {
    const { cx, payload, height } = props;
    const alarmArr = [];
    this.props.alarmData.map((each) => {
      alarmArr.push({
        createAt: each.alarmAt,
        completeAt: each.completeAt ? each.completeAt : this.completeAt,
        type: each.type,
      });
      return null;
    });
    return (
      <g>
        {
          alarmArr.map((value) => {
            const { createAt, completeAt } = value;
            const startTime = new Date().getTime() - (this.state.buttonValue * 24 * 3600 * 1000);
            const todayTime = new Date(payload.value).getTime();
            const endTime = completeAt ? value.completeAt : new Date().getTime();
            if ((todayTime - startTime < 24 * 3600 * 1000) && createAt <= startTime) {
              const color = '#f04134';
              const timePercent = Math.round((endTime - startTime) / 1000 / 3600) / 24;
              const width = (this.state.data.length === 30 ? 25 :
                this.state.data.length === 15 ? 50 : 100);
              const x = (cx - (width / 2));
              return (
                <Popover
                  content={this.renderPopover()}
                >
                  <rect
                    onMouseEnter={() => { this.mouseEnter(createAt, completeAt); }}
                    x={x}
                    y={25}
                    width={width * timePercent < 3 ? 3 : width * timePercent}
                    height={height / 2} fill={color}
                  />
                </Popover>
              );
            } else if (createAt < new Date(payload.value).getTime() ||
              createAt > (new Date(payload.value).getTime() + (3600 * 24 * 1000))) {
              return null;
            }
            const color = '#f04134';
            const timePercent = Math.round((completeAt - createAt) / 1000 / 3600) / 24;
            const width = (this.state.data.length === 30 ? 25 :
              this.state.data.length === 15 ? 50 : 100);
            const xPercent = (new Date(createAt).toTimeString().slice(0, 2) - 0) / 24;
            const x = (cx - (width / 2)) + (width * xPercent);
            return (
              <Popover
                content={this.renderPopover()}
              >
                <rect
                  onMouseEnter={() => { this.mouseEnter(createAt, completeAt); }}
                  x={x}
                  y={25}
                  width={width * timePercent < 3 ? 3 : width * timePercent}
                  height={height / 2} fill={color}
                />
              </Popover>
            );
          })
        }
      </g>
    );
  };
  changeTime = (e) => {
    const value = e.target.value;
    const length = this.data02().length;
    const dataT = [];
    for (let i = length - value; i < length; i += 1) {
      dataT.push(this.data02()[i]);
    }
    this.setState({
      buttonValue: value,
      data: dataT,
    });
    this.props.dateChange(value);
  };
  mouseEnter = (value1, value2) => {
    this.setState({
      createAt: value1,
      completeAt: value2,
    });
  };
  renderPopover = () => {
    const createAt = this.state.createAt;
    const completeAt = this.state.completeAt;
    const whichDev = [];
    this.props.alarmData.map((value) => {
      if ((value.alarmAt <= createAt &&
          (value.completeAt ? value.completeAt : this.completeAt) > createAt) ||
        (value.alarmAt >= createAt &&
          (value.completeAt ? value.completeAt : this.completeAt) < completeAt)) {
        whichDev.push({
          createAt: value.alarmAt,
          completeAt: (value.completeAt ? value.completeAt : this.completeAt),
          type: value.type,
        });
      }
      return null;
    });
    return (
      <div>
        {whichDev.map((value) => {
          return (<div>
            <p>告警类型:{value.type === 'NET' ? '网络连接异常' : value.type === 'POWER' ? '电源异常' : value.type === 'LINK' ? '端口异常' : '未知错误'}</p>
            <p>影响时间:{dateTimeFormat(value.createAt)}~{dateTimeFormat(value.completeAt)}</p>
          </div>);
        })}
      </div>
    );
  };
  render = () => {
    const type = 'category';
    const { styleRadio } = this.props;
    return (<div style={{ marginTop: 15, position: 'relative' }}>
      <Radio.Group value={this.state.buttonValue} onChange={this.changeTime} style={{ position: 'absolute', ...styleRadio }}>
        <Radio.Button value={7}>最近7天</Radio.Button>
        <Radio.Button value={15}>最近15天</Radio.Button>
        <Radio.Button value={30}>最近30天</Radio.Button>
      </Radio.Group >
      <ScatterChart
        width={800}
        height={100}
      >
        <XAxis dataKey={'value'} name={'日期'} type={type} domain={['dataMin', 'dataMax']} tickLine={false} />
        <YAxis dataKey={'x'} name={'告警类型'} type={type} tick={false} tickLine={false} />
        <ZAxis dataKey={'y'} type={type} />
        <rect x={80} y={25} fill={'#76d0a3'} width={685} height={30} />
        <Scatter data={this.state.data.length === 0 ? this.data02() : this.state.data} fill={'#8884d8'} shape={this.square} isAnimationActive={false} />
      </ScatterChart>
    </div>);
  }
}
