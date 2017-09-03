import React from 'react';
import { Tree, message, Button } from 'antd';
import { connect } from 'dva';

import Modal from 'components/Form/Modal';
import TreeNodeTitle from './components/TreeNodeTitle';
import styles from './index.less';

const ADD = 'ADD';
const EDIT = 'EDIT';
const NULL = 'NULL';
class Org extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: NULL,
    };
  }
  onSelect = ({ node }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'org/select', payload: { id: node.props.orgId } });
  };
  onSaveSuccess = () => {
    this.hideModal();
  };
  onSaveError = (error) => {
    message.error(error);
  };
  getNodes = (nodes) => {
    return nodes.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode
            key={item.id}
            orgId={item.id}
            title={this.renderTitle(item)}
          >
            {this.getNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          orgId={item.id}
          key={item.id}
          title={this.renderTitle(item)}
        />
      );
    });
  };
  addRoot = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'org/select', payload: { id: null } });
    this.setState({ modal: ADD, data: null });
  };
  addClick = () => {
    this.setState({ modal: ADD, data: null });
  };
  editClick = (data) => {
    this.setState({ modal: EDIT, data });
  };
  hideModal = () => {
    this.setState({ modal: NULL, data: null });
  };
  del = () => {
    const { select, dispatch } = this.props;
    dispatch({ type: 'org/del', payload: { id: select }, callback: { onError: message.error } });
  };
  save = (org) => {
    const { dispatch, select } = this.props;
    const { modal } = this.state;
    if (modal === ADD) {
      dispatch({ type: 'org/add', payload: { name: org.name, loc: org.map, pid: select }, callback: { onSuccess: this.onSaveSuccess, onError: this.onSaveError } });
    } else if (modal === EDIT) {
      dispatch({ type: 'org/edit', payload: { name: org.name, loc: org.map, id: select }, callback: { onSuccess: this.onSaveSuccess, onError: this.onSaveError } });
    }
  };
  reload = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'org/fetch' });
  };
  renderTitle = (item) => {
    const { select } = this.props;
    return (
      <TreeNodeTitle
        select={select === item.id}
        data={item}
        add={this.addClick}
        edit={this.editClick}
        del={this.del}
      />
    );
  };
  renderModal = () => {
    const { saveloading } = this.props;
    const { modal, data } = this.state;
    const fields = [{
      text: '分组名称',
      name: 'name',
      type: 'input',
      value: data ? data.name : null,
      validate: [{
        rules: [
          { required: true, message: '请输入分组名称' },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
    }, {
      text: '位置',
      name: 'map',
      type: 'locselect',
      value: data ? data.map : null,
    }];
    const title = modal === ADD ? '添加' : '修改';
    return (
      <Modal
        title={title}
        visible={modal !== NULL}
        fields={fields}
        onCancel={this.hideModal}
        onSubmit={this.save}
        confirmLoading={saveloading}
      />
    );
  };
  render = () => {
    const { orgs } = this.props;
    return (
      <div>
        <Button.Group>
          <Button type="primary" icon="folder-add" onClick={this.addRoot}>添加根分组</Button>
        </Button.Group>
        <Tree
          showLine
          defaultExpandAll
          onMouseEnter={this.onSelect}
          className={styles.showidth}
        >
          {this.getNodes(orgs)}
        </Tree>
        {this.renderModal()}
      </div>
    );
  }
}

export default connect(({ org, loading }) => ({
  orgs: org.orgs,
  select: org.select,
  loading: loading.effects['org/fetch'],
  saveloading: loading.effects['org/add'] || loading.effects['org/edit'],
}))(Org);
