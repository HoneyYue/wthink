import React from 'react';
import { Icon, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from '../index.less';

class TreeNodeTitle extends React.Component {
  renderOperation = () => {
    const { select, add, edit, del, data } = this.props;
    if (!select) {
      return;
    }
    return (
      <Button.Group className={styles.groupmrg}>
        <Button icon="folder-add" onClick={add} />
        <Button icon="edit" onClick={() => { edit(data); }} />
        <Popconfirm placement="right" title="确定删除" onConfirm={del} okText="确定" cancelText="取消">
          <Button icon="delete" />
        </Popconfirm>
      </Button.Group>
    );
  };
  render = () => {
    const { data } = this.props;
    return (
      <span>
        {data.icon ? <Icon type={data.icon} /> : null}
        {data.img ? <img className={styles.imgs} src={data.img} alt="" /> : null}
        {data.name}
        {this.renderOperation()}
      </span>
    );
  }
}

export default connect(({ org }) => ({ orgs: org.orgs }))(TreeNodeTitle);
