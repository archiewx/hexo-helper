import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button } from 'antd'
import { Panel } from '@/components'
import Section from '@/components/Section'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
    this.handleGoBack = this.handleGoBack.bind(this)
  }

  componentDidCatch(err, info) {
    this.setState({
      hasError: true
    })
  }

  handleGoBack() {
    this.props.history.go(-1)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Panel>
          <Section>
            <p>读取配置文件数据出错，请检查设置中是否完成设置.</p>
            <Button onClick={this.handleGoBack}>返回主页</Button>
          </Section>
        </Panel>
      )
    }
    return this.props.children
  }
}

export default withRouter(ErrorBoundary)
