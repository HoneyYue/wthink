import React from 'react';
import { Select } from 'antd';

export default class ContentSelect extends React.Component {
  constructor(props) {
    super(props);
    const value = this.props.Selected || {};
    this.state = {
      productBy: value.productBy,
      model: value.model,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState(nextProps.value || { productBy: null, model: null });
    }
  };
  handleProductChange= (val) => {
    this.setState({
      productBy: val,
      model: '',
    });
  };
  handleModelChange= (val) => {
    this.setState({
      model: val,
    });
  };
  // triggerChange = (changedValue) => {
  //   const onChange = this.props.onChange;
  //   if (onChange) {
  //     onChange({ ...this.state, ...changedValue });
  //   }
  // };
  renderModel = () => {
    const { data } = this.props;
    const { productBy } = this.state;
    let find = data.find(product => product.name === productBy)
    if (!find) {
      return;
    }
    return find.models.map(model => {
      return <Select.Option key={model}>{model}</Select.Option>;
    });
  }
  render() {
    const { data } = this.props;
    const { productBy, model } = this.state;
    return (
      <span>
        <Select style={{ width: 115 }} value={productBy} mode="combobox" onBlur={() => {console.log(this)}} onChange={this.handleProductChange}>
          {
            data.map(product => {
              return <Select.Option key={product.name}>{product.name}</Select.Option>;
            })
          }
        </Select>
        -
        <Select style={{ width: 115 }} mode="combobox" value={model} onChange={this.handleModelChange} onBlur={() => {console.log(this)}}>
          {this.renderModel()}
        </Select>
      </span>
    );
  }
}
