import React from 'react';
import { connect } from 'dva';

import Form from 'components/Form';
import LocView from 'components/Map/LocView';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.Form = Form();
    this.formFields = [{
      text: '名称',
      name: 'name',
      type: 'input',
    }, {
      text: '时间',
      name: 'createAt',
      type: 'date',
    }, {
      text: '默认地图中心',
      name: 'loc',
      type: 'locselect',
    }, {
      text: '选择文件',
      name: 'file',
      type: 'upload',
      url: 'http://127.0.0.1:90/upload',
      onSuccess: this.onSuccess,
      onError: this.onError,
      validate: [{
        rules: [
          { required: true, message: '请选择上传文件' },
        ],
      }],
    }];
  }
  onSuccess = (resp) => {
    console.log(resp);
  };
  onError = (err) => {
    console.log(err);
  };
  render = () => {
    const lat = 39.915;
    const lng = 116.404;
    return (
      <div>
        <this.Form fields={this.formFields} />
        <LocView lat={lat} lng={lng} />
      </div>
    );
  };
}
export default connect()(Test);
