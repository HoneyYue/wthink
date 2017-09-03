import React from 'react';
import { Icon, Popover } from 'antd';
import { queryTree } from 'utils';

class OrgColumn extends React.Component {
  renderPath = (path) => {
    const { orgs } = this.props;
    return path
      .map(id => queryTree(orgs, id))
      .filter(org => org !== null)
      .map(org => org.name)
      .join('=>');
  };
  render = () => {
    const { orgs, id } = this.props;
    if (orgs.length === 0) {
      return <Icon type="loading" />;
    }
    const org = queryTree(orgs, id);
    if (!org) {
      return <span />;
    }
    if (org.path && org.path.length > 0) {
      return (
        <Popover content={this.renderPath(org.path)} title="上级机构">
          {org.name}
        </Popover>
      );
    }
    return <span>{org.name}</span>;
  }
}

export default OrgColumn;
