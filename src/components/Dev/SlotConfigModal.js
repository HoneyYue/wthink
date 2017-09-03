import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';

import Modal from 'components/Form/Modal';

import { queryArray } from 'utils';
import SlotConfigFormset from './components/SlotConfigFormset';

class SlotConfigModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props);
    this.validate = [{
      rules: [
        {
          message: '请输入合法的IP地址',
          validator: (rule, value, callback) => {
            if (value.ip && value.ip !== '') {
              const ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
              if (!ip.test(value.ip)) {
                return callback('请输入合法的IP地址');
              }
            }
            callback();
          },
        },
      ],
      trigger: ['onChange'],
    }, {
      rules: [
        {
          message: '请输入合法的MAC地址',
          validator: (rule, value, callback) => {
            if (value.mac && value.mac !== '') {
              const mac = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
              if (!mac.test(value.mac)) {
                return callback('请输入合法的MAC地址');
              }
            }
            callback();
          },
        },
      ],
      trigger: ['onChange'],
    }];
    this.fields = [{
      name: 'slot1',
      validate: this.validate,
      value: {
        num: 1,
      },
      component: <SlotConfigFormset />,
    }, {
      name: 'slot2',
      validate: this.validate,
      value: {
        num: 2,
      },
      component: <SlotConfigFormset />,
    }, {
      name: 'slot3',
      validate: this.validate,
      value: {
        num: 3,
      },
      component: <SlotConfigFormset />,
    }, {
      name: 'slot4',
      validate: this.validate,
      value: {
        num: 4,
      },
      component: <SlotConfigFormset />,
    }];
  }
  updateSlot = (values) => {
    const { dispatch, sn, onClose } = this.props;
    const slots = [{
      num: values.slot1.num,
      ip: values.slot1.ip,
      mac: values.slot1.mac,
    }, {
      num: values.slot2.num,
      ip: values.slot2.ip,
      mac: values.slot2.mac,
    }, {
      num: values.slot3.num,
      ip: values.slot3.ip,
      mac: values.slot3.mac,
    }, {
      num: values.slot4.num,
      ip: values.slot4.ip,
      mac: values.slot4.mac,
    }];
    dispatch({ type: 'devslot/edit', payload: { sn, slots }, callback: { onSuccess: onClose } });
  };
  render = () => {
    const { visible, onClose, updateloading, queryloading, slots } = this.props;
    const newfields = this.fields.map((field) => {
      return { ...field, value: slots ? queryArray(slots, field.value.num, 'num') : field.value };
    });
    return (
      <Modal
        visible={visible}
        title="端口配置"
        onCancel={onClose}
        fields={queryloading ? [] : newfields}
        onSubmit={this.updateSlot}
        confirmLoading={updateloading}
        formprops={{
          columns: 2,
          formloading: queryloading,
        }}
        width={600}
      />
    );
  };
}

function mapStateToProps(state) {
  const { loading } = state;
  return {
    sn: state.devslot.sn,
    slots: state.devslot.slots,
    updateloading: loading.effects['devslot/edit'],
    queryloading: loading.effects['devslot/fetch'],
  };
}

export default connect(mapStateToProps)(SlotConfigModal);
