import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Card, Form, Input, Button, message } from 'antd'
import { Panel } from '@/components'
import BackHeader from '@/components/BackHeader'
import Section from '@/components/Section'
import Loading from '@/components/Loading'
import { readConfigAsync, setOssSecretKey } from '../../store/conf/actions'

const FormItem = Form.Item

/**
 * 七牛云设置
 */
class KeySettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      providers: [],
      type: 'qiniu',
      config: {},
      form: {},
      loading: {
        visible: false,
        tips: '正在保存...'
      }
    }
    this.onTabChange = this.onTabChange.bind(this)
    this.handleSaveKey = this.handleSaveKey.bind(this)
  }

  componentWillMount() {
    const providers = [{ key: 'qiniu', tab: '七牛' }]
    if (this.props.base.isDev) {
      providers.push({ key: 'oss', tab: '阿里云' })
    }
    this.setState({ providers })
  }

  componentDidMount() {
    this.props.dispatch(readConfigAsync())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.conf.config !== this.props.conf.config) {
      const config = nextProps.conf.config
      this.setState(prevState => ({
        config,
        form: {
          accessKey: config[prevState.type].accessKey,
          secretKey: config[prevState.type].secretKey
        }
      }))
      setTimeout(() => {
        this.setState(prevState => ({
          loading: { ...prevState.loading, visible: false }
        }))
      }, 2000)
    }
  }

  onTabChange(type) {
    this.setState(prevState => ({
      type,
      form: {
        accessKey: prevState.config[type].accessKey,
        secretKey: prevState.config[type].secretKey
      }
    }))
  }

  handleSaveKey() {
    if (this.checkInput()) {
      message.warning('请修改key值后再保存')
      return
    }
    const type = this.state.type
    this.setState(prevState => ({
      loading: { ...prevState.loading, visible: true }
    }))
    this.props.form.validateFields((errors, form) => {
      if (!errors) {
        const accessKey = form.accessKey
        const secretKey = form.secretKey
        this.props.dispatch(setOssSecretKey(type, accessKey, secretKey))
      }
    })
  }

  checkInput() {
    const accessKey = this.props.form.getFieldValue('accessKey')
    const secretKey = this.props.form.getFieldValue('secretKey')
    const type = this.state.type
    const config = this.state.config
    if (accessKey !== config[type].accessKey || secretKey !== config[type].secretKey) {
      return false
    }
    return true
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Panel>
        <BackHeader title="返回设置" />
        <Section>
          <Card hoverable tabList={this.state.providers} onTabChange={this.onTabChange}>
            <Form>
              <FormItem label="accesskey">
                {getFieldDecorator('accessKey', {
                  rules: [{ required: true, message: '请输入accesskey值' }],
                  initialValue: this.state.form.accessKey
                })(<Input placeholder="请输入accesskey" />)}
              </FormItem>
              <FormItem label="secretkey">
                {getFieldDecorator('secretKey', {
                  rules: [{ required: true, message: '请输入secretkey' }],
                  initialValue: this.state.form.secretKey
                })(<Input placeholder="请输入secretkey" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSaveKey}>
                  保存
                </Button>
              </FormItem>
            </Form>
          </Card>
        </Section>
        <Loading {...this.state.loading} />
      </Panel>
    )
  }
}

const KeySettingsForm = Form.create()(KeySettings)
const mapStateToProps = state => state

export default withRouter(connect(mapStateToProps)(KeySettingsForm))
