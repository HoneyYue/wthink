import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import maploader from './maploader';

export default class BDMap extends React.Component {

  static defaultProps = {
    id: 'id',
    componets: [],
    reloadJS: false,
  };
  static propTypes = {
    id: PropTypes.string,
    componets: PropTypes.array,
    onMapInit: PropTypes.func,
    reloadJS: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.controls = [];
  }
  componentDidMount = () => {
    this.unload = false;
    const { componets, onMapInit, reloadJS, id } = this.props;

    maploader(reloadJS).then(() => {
      const map = new BMap.Map(id, {
        enableMapClick: false,
      });
      map.enableScrollWheelZoom();
      componets.forEach((componet) => {
        map.addControl(this.createControl(componet));
      });

      this.map = map;
      if (onMapInit && !this.unload) {
        onMapInit(map);
      }
    });
  }
  componentWillUnmount = () => {
    this.unload = true;
    for (const control of this.controls) {
      ReactDOM.unmountComponentAtNode(control);
    }
  }

  createControl = ({ id, pos, style = {}, component }) => {
    function Control() {
      this.defaultAnchor = pos.loc;
      this.defaultOffset = new BMap.Size(pos.leftOffset, pos.topOffset);
    }

    Control.prototype = new BMap.Control();
    Control.prototype.initialize = (map) => {
      const container = map.getContainer();
      if (!container) {
        return;
      }

      const div = document.createElement('div');
      div.id = id;
      for (const key in style) {
        if ({}.hasOwnProperty.call(style, key)) {
          div.style[key] = style[key];
        }
      }
      container.appendChild(div);
      const router = () => component;
      ReactDOM.render(window.app._getProvider(router)(), div);
      this.controls.push(div);
      return div;
    };

    return new Control();
  }

  render() {
    const { id, children } = this.props;
    return (
      <div
        id={id}
        style={{
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </div>
    );
  }
}
