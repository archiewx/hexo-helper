import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Panel } from '../Common'
import { Icon } from 'antd'

class FileList extends React.Component {
  render() {
    return (
      <Panel>
        <p>
          <a onClick={() => this.props.history.go(-1)}>
            <Icon type="arrow-left" />主页
          </a>
        </p>
        选项
      </Panel>
    )
  }
}

export default withRouter(connect()(FileList))
