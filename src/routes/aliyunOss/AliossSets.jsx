import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import BackHeader from '@/components/BackHeader'
import { Panel } from '@/components'

class AliossSets extends React.Component {
  render() {
    return (
      <Panel>
        <BackHeader title="返回" />
        <div>oss</div>
      </Panel>
    )
  }
}

export default withRouter(connect()(AliossSets))
