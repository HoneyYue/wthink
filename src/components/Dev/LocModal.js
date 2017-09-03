import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import LocView from 'components/Map/LocView';

export default class LocModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }
  render = () => {
    const { visible, onClose, lat, lng } = this.props;
    return (
      <Modal
        title="设备位置"
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <LocView lat={lat} lng={lng} width={500} />
      </Modal>
    );
  };
}
