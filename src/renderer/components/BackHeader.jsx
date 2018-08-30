import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Icon } from 'antd'

class BackHeader extends React.Component {
  onClick() {
    this.props.history.go(-1)
    this.props.onBack && this.props.onBack()
  }
  render() {
    return (
      <p>
        <a onClick={this.onClick.bind(this)} className="btn">
          <Icon type="arrow-left" />
          {this.props.title}
        </a>
        {this.props.children}
      </p>
    )
  }
}

BackHeader.propTypes = {
  title: PropTypes.string,
  onBack: PropTypes.func
}

BackHeader.defaultProps = {
  title: '返回'
}

export default withRouter(BackHeader)
