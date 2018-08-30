import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import FullScreen from './FullScreen'

class Loading extends React.Component {
  render() {
    return (
      <FullScreen visible={this.props.visible}>
        <Icon type="loading" />
        <p align="center" style={{ marginTop: 16 }}>
          {this.props.tips}
        </p>
      </FullScreen>
    )
  }
}

Loading.propTypes = {
  tips: PropTypes.string,
  visible: PropTypes.bool
}
Loading.defaultProps = {
  tips: '等待中...',
  visible: true
}

export default Loading
